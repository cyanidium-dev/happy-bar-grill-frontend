import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliveryType, PaymentMethod } from "@/types/cart";
import { isDeliveryAddress } from "@/utils/address";
import { isPersonName } from "@/utils/personName";
import { isUaSubscriberDigits } from "@/utils/phone";

/**
 * Remembered checkout details.
 *
 * There are no accounts on this site, so this is the whole of "who you are":
 * a device-local note of what you typed last time, kept so a repeat order is a
 * couple of taps instead of re-entering a name, a phone number and a street
 * address on a phone keyboard. It is never sent anywhere on its own — the
 * checkout form reads it as a default, and the order request still carries the
 * fields the customer actually confirmed.
 *
 * Nothing here is trusted: every value is re-validated by the same predicates
 * the checkout form uses, both on write and on rehydrate, so a hand-edited
 * localStorage entry can only ever prefill the form with something the form
 * would have accepted anyway.
 */

export type SavedCoords = { lat: number; lng: number };

export type Profile = {
  name: string;
  /** Nine subscriber digits, without the `+380` prefix. */
  phone: string;
  /** Preferred fulfilment, preselected at checkout. */
  deliveryType: DeliveryType;
  address: string;
  /** Map pin for the saved address, when it was chosen on the map. */
  coords: SavedCoords | null;
  payment: PaymentMethod;
};

const EMPTY: Profile = {
  name: "",
  phone: "",
  deliveryType: "delivery",
  address: "",
  coords: null,
  payment: "cash",
};

interface ProfileState extends Profile {
  /** Merges valid fields; anything that fails validation is dropped. */
  update: (patch: Partial<Profile>) => void;
  clear: () => void;
}

function sanitizeCoords(raw: unknown): SavedCoords | null {
  if (!raw || typeof raw !== "object") return null;
  const { lat, lng } = raw as Partial<SavedCoords>;
  if (typeof lat !== "number" || !Number.isFinite(lat)) return null;
  if (typeof lng !== "number" || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

/**
 * Applies only the fields that pass the checkout's own validators. Empty
 * strings are allowed through so a customer can deliberately clear a field.
 */
function sanitizeProfile(raw: unknown): Profile {
  const data =
    raw && typeof raw === "object" ? (raw as Partial<Profile>) : {};

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const address = typeof data.address === "string" ? data.address.trim() : "";

  return {
    name: isPersonName(name) ? name : "",
    phone: isUaSubscriberDigits(phone) ? phone : "",
    deliveryType: data.deliveryType === "pickup" ? "pickup" : "delivery",
    address: isDeliveryAddress(address) ? address : "",
    coords: sanitizeCoords(data.coords),
    payment: data.payment === "card" ? "card" : "cash",
  };
}

export const PROFILE_PERSIST_VERSION = 1;

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...EMPTY,

      update: (patch) => {
        const next = sanitizeProfile({ ...get(), ...patch });
        // A pin only means anything alongside the address it was chosen for.
        if (patch.address !== undefined && patch.coords === undefined) {
          next.coords = next.address ? get().coords : null;
        }
        set(next);
      },

      clear: () => set({ ...EMPTY }),
    }),
    {
      name: "vtiha-profile",
      version: PROFILE_PERSIST_VERSION,
      partialize: (state) => ({
        name: state.name,
        phone: state.phone,
        deliveryType: state.deliveryType,
        address: state.address,
        coords: state.coords,
        payment: state.payment,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...sanitizeProfile(persisted),
      }),
    },
  ),
);

/** `true` when there is anything worth prefilling a form with. */
export const selectHasProfile = (state: ProfileState) =>
  Boolean(state.name || state.phone || state.address);

/** Mirrors `useCartHydrated` — defer reads until localStorage has landed. */
export function useProfileHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useProfileStore.persist.onFinishHydration(onChange),
    () => useProfileStore.persist.hasHydrated(),
    () => false,
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== useProfileStore.persist.getOptions().name) return;
    void useProfileStore.persist.rehydrate();
  });
}
