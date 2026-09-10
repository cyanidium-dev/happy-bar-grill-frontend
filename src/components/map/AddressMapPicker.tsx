"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Map as LeafletMap, Marker } from "leaflet";
import { VENUE_COORDS } from "@/constants/contacts";
import type { SavedCoords } from "@/store/profileStore";
import { cn } from "@/utils/cn";

type PickedAddress = { address: string; coords: SavedCoords };

type AddressMapPickerProps = {
  /** Pin position to open on. Falls back to the venue when absent. */
  coords: SavedCoords | null;
  onPick: (picked: PickedAddress) => void;
  className?: string;
};

/** Tight enough to read house numbers, wide enough to get your bearings. */
const PIN_ZOOM = 17;
const CITY_ZOOM = 13;

/**
 * Delay between the pin settling and asking Nominatim what is under it.
 * Their usage policy is one request per second; a drag would otherwise fire
 * dozens.
 */
const GEOCODE_DEBOUNCE_MS = 700;

/**
 * Map-based address picker for delivery.
 *
 * Typing a street address on a phone is the single slowest step of this
 * checkout, and the one most likely to arrive wrong — "вул." vs "ул.", a
 * missing building number, a courier calling back. Dropping a pin removes the
 * ambiguity: the coordinates are exact, and the text is generated from them.
 *
 * The map is strictly an assist. It loads only when opened (Leaflet is ~40KB
 * and irrelevant to anyone collecting their order), and the address field it
 * feeds stays freely typeable — if the tiles never load, or the geocoder is
 * down, checkout is exactly as usable as it was before.
 */
export default function AddressMapPicker({
  coords,
  onPick,
  className,
}: AddressMapPickerProps) {
  const t = useTranslations("Map");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<SavedCoords | null>(coords);
  const [address, setAddress] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [failed, setFailed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  /** Ask the proxy what street the pin is standing on. */
  const resolve = useCallback(
    async (next: SavedCoords, signal: AbortSignal) => {
      setIsResolving(true);
      setFailed(false);
      try {
        const res = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: next.lat, lon: next.lng, locale }),
          signal,
        });
        if (!res.ok) throw new Error("geocode failed");
        const data = (await res.json()) as { address?: string };
        setAddress(data.address ?? "");
        if (!data.address) setFailed(true);
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        setFailed(true);
        setAddress("");
      } finally {
        setIsResolving(false);
      }
    },
    [locale],
  );

  // Debounced reverse geocode whenever the pin settles.
  useEffect(() => {
    if (!open || !pin) return;
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => void resolve(pin, controller.signal),
      GEOCODE_DEBOUNCE_MS,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, pin, resolve]);

  /**
   * Latest pin, readable by the build effect without becoming a dependency of
   * it — the map is created once per open, and re-running that on every drag
   * would tear down and rebuild it mid-gesture.
   */
  const pinRef = useRef(pin);
  useEffect(() => {
    pinRef.current = pin;
  });

  // Build the map once the panel is open and its container has a real size.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void (async () => {
      // Dynamic import keeps Leaflet and its stylesheet out of every other page.
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = pinRef.current ?? VENUE_COORDS;
      const map = L.map(containerRef.current, {
        center: [start.lat, start.lng],
        zoom: pinRef.current ? PIN_ZOOM : CITY_ZOOM,
        // The page scrolls under a finger; a map that grabs the wheel or
        // swallows a two-finger scroll is worse than one you have to tap.
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        // Required by the OSM tile usage policy.
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      /**
       * A `divIcon` rather than Leaflet's default marker: the stock icon
       * points at image files resolved relative to the CSS, which bundlers
       * rewrite and Leaflet then fails to find. Inline markup has no assets to
       * lose and takes the brand colour for free.
       */
      const icon = L.divIcon({
        className: "",
        html:
          '<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;' +
          "background:#e31e26;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.35);" +
          'transform:rotate(-45deg)"></span>',
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      });

      const marker = L.marker([start.lat, start.lng], {
        draggable: true,
        icon,
        keyboard: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setPin({ lat, lng });
      });

      map.on("click", (event) => {
        marker.setLatLng(event.latlng);
        setPin({ lat: event.latlng.lat, lng: event.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;

      // The container was `hidden` a moment ago, so Leaflet measured it as
      // 0×0 and would render a single grey tile until something resized it.
      requestAnimationFrame(() => map.invalidateSize());

      if (!pinRef.current) setPin(start);
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // Tear the map down when the panel closes, so reopening builds a fresh one.
  useEffect(() => {
    if (open) return;
    mapRef.current?.remove();
    mapRef.current = null;
    markerRef.current = null;
  }, [open]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPin(next);
        markerRef.current?.setLatLng([next.lat, next.lng]);
        mapRef.current?.setView([next.lat, next.lng], PIN_ZOOM);
      },
      () => setFailed(true),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const confirm = () => {
    if (!pin || !address) return;
    onPick({ address, coords: pin });
    setOpen(false);
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="cursor-pointer text-14med text-navy underline decoration-navy/30 underline-offset-4 transition-colors duration-300 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
      >
        {open ? t("hide") : t("chooseOnMap")}
      </button>

      {open && (
        <div className="mt-3 overflow-hidden rounded-tl-2xl rounded-br-2xl border border-navy/12 bg-white">
          <div
            ref={containerRef}
            role="application"
            aria-label={t("title")}
            className="h-64 w-full sm:h-80"
          />

          <div className="flex flex-col gap-3 border-t border-navy/10 p-4">
            <p className="text-12reg text-grey-dark">{t("hint")}</p>

            <p
              aria-live="polite"
              className={cn(
                "min-h-[1.25rem] text-14med",
                failed ? "text-red" : "text-navy",
              )}
            >
              {isResolving
                ? t("resolving")
                : failed
                  ? t("failed")
                  : address || t("dropPin")}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={confirm}
                disabled={!address || isResolving}
                className="cursor-pointer rounded-tl-[14px] rounded-br-[14px] bg-red px-5 py-2.5 text-14semi text-white transition-colors duration-300 hover:bg-red-dark disabled:cursor-not-allowed disabled:bg-grey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
              >
                {t("use")}
              </button>
              <button
                type="button"
                onClick={locate}
                className="cursor-pointer rounded-full border border-navy/20 px-5 py-2.5 text-14semi text-navy transition-colors duration-300 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
              >
                {t("locate")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
