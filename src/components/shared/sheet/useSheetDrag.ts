"use client";

import { useCallback, useEffect, useRef } from "react";

/** Past this many pixels, letting go closes the sheet. */
const DISTANCE_THRESHOLD = 110;
/** …or a quick downward flick, however short. */
const VELOCITY_THRESHOLD = 0.55; // px per ms

type Options = {
  /** The element that should follow the finger. */
  sheetRef: React.RefObject<HTMLElement | null>;
  /** Turn the gesture off entirely (desktop, closed sheet). */
  enabled: boolean;
  onDismiss: () => void;
};

/**
 * Drag-to-dismiss for a bottom sheet.
 *
 * The sheet is moved by writing `transform` directly instead of by re-rendering
 * on every pointer event: a React state update per `pointermove` cannot keep up
 * with a 120Hz touch stream, and the panel visibly lags the finger. The CSS
 * transition is switched off for the duration of the drag and restored on
 * release, so the snap-back and the close still animate normally.
 *
 * Attach `handleProps` to the grab area only (the handle and the header), never
 * to the scrolling list — a downward drag inside a scrolled list means "scroll
 * up", and hijacking it makes the sheet feel broken.
 */
export function useSheetDrag({ sheetRef, enabled, onDismiss }: Options) {
  const state = useRef<{
    pointerId: number;
    startY: number;
    lastY: number;
    lastT: number;
    velocity: number;
  } | null>(null);

  const reset = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.transform = "";
    sheet.style.transition = "";
    sheet.style.willChange = "";
  }, [sheetRef]);

  // A sheet closed by any other route (Escape, a link, the backdrop) must not
  // keep an inline transform, or it would reopen mid-drag next time.
  useEffect(() => {
    if (!enabled) {
      state.current = null;
      reset();
    }
  }, [enabled, reset]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      // Mouse users have the close button and the backdrop; dragging with a
      // mouse would only get in the way of selecting text in the header.
      if (event.pointerType === "mouse") return;
      const sheet = sheetRef.current;
      if (!sheet) return;

      state.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        lastT: event.timeStamp,
        velocity: 0,
      };
      sheet.style.transition = "none";
      sheet.style.willChange = "transform";
    },
    [enabled, sheetRef],
  );

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      const current = state.current;
      const sheet = sheetRef.current;
      if (!current || !sheet || event.pointerId !== current.pointerId) return;

      const dy = event.clientY - current.startY;
      const dt = event.timeStamp - current.lastT;
      if (dt > 0) {
        current.velocity = (event.clientY - current.lastY) / dt;
        current.lastY = event.clientY;
        current.lastT = event.timeStamp;
      }

      // Downward only. Pulling up past the top edge would expose the page
      // behind the sheet, so resistance simply stops at 0.
      sheet.style.transform = `translateY(${Math.max(0, dy)}px)`;
    };

    const onUp = (event: PointerEvent) => {
      const current = state.current;
      if (!current || event.pointerId !== current.pointerId) return;
      state.current = null;

      const dy = event.clientY - current.startY;
      const shouldDismiss =
        dy > DISTANCE_THRESHOLD ||
        (dy > 24 && current.velocity > VELOCITY_THRESHOLD);

      // Hand the transform back to CSS first: the class-driven
      // `translate-y-full` then animates from wherever the finger left it.
      reset();
      if (shouldDismiss) onDismiss();
    };

    const onCancel = () => {
      state.current = null;
      reset();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [enabled, onDismiss, reset, sheetRef]);

  return { handleProps: { onPointerDown } };
}
