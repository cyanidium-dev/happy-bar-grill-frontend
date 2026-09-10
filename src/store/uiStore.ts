import { create } from "zustand";

/**
 * Which full-screen overlay is currently open, if any.
 *
 * A single value rather than a flag per panel: the cart, the last-order card
 * and the mobile menu are mutually exclusive, and modelling that as three
 * independent booleans is what let two of them open at once before (every
 * opener had to remember to close the other two by hand).
 */
export type Overlay = "cart" | "lastOrder" | "menu" | null;

interface UiState {
  overlay: Overlay;
  open: (overlay: Exclude<Overlay, null>) => void;
  close: () => void;
  /** Opens `overlay`, or closes it if it is already the open one. */
  toggle: (overlay: Exclude<Overlay, null>) => void;
}

/**
 * Overlay state lives outside the header because the bottom navigation opens
 * the same cart panel from the other end of the screen. Keeping it in a store
 * means neither component owns the other.
 */
export const useUiStore = create<UiState>()((set, get) => ({
  overlay: null,
  open: (overlay) => set({ overlay }),
  close: () => set({ overlay: null }),
  toggle: (overlay) =>
    set({ overlay: get().overlay === overlay ? null : overlay }),
}));

export const selectIsOpen = (overlay: Exclude<Overlay, null>) => (state: UiState) =>
  state.overlay === overlay;
