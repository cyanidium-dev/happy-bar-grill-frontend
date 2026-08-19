/**
 * A photographed burger, cut into layers that motion can pull apart.
 *
 * Each ingredient is its own file rather than one image clipped seven ways.
 * A straight horizontal cut cannot separate the cheese from the patty — its
 * drips hang down over the meat — so the layers were masked by colour instead,
 * which no rectangular clip could reproduce.
 *
 * Geometry lives here in one place because three things depend on it agreeing:
 * where each layer sits, how far it travels, and where its label lands. All of
 * it is expressed in source-photo pixels and scaled once, so the numbers can be
 * checked against the original artwork.
 */

export type BurgerLayerId =
  | "topBun"
  | "lettuce"
  | "cheese"
  | "patty"
  | "tomato"
  | "pickles"
  | "bottomBun";

export const VIEWBOX_WIDTH = 860;
export const VIEWBOX_HEIGHT = 760;

/**
 * Two different horizontal offsets, and they are not the same number.
 *
 * Stacked, the burger alone should sit centred, so the whole drawing carries a
 * static shift. Pulled apart, it is the burger *plus* its labels that should
 * read as centred — a wider block, so the stack walks back further than the
 * shift that put it there.
 */
export const COLLAPSED_SHIFT_X = 156;
export const EXPLODE_SHIFT_X = 186;

/** Source photo pixels → viewBox units. */
const SCALE = 0.4451;
const OFFSET_Y = 110;

const LABEL_X = 462;
const LABEL_SIZE = 22;
const TEXT_SIZE = 13;
const TEXT_LEADING = 16;
const LINE_START_X = 440;
const LINE_END_X = 454;

/** Roughly how many characters of the smaller copy fit on one line. */
const WRAP_AT = 36;

/** Any more and neighbouring callouts start writing over each other. */
const MAX_LINES = 2;

export type BurgerLabel = { name: string; text: string };

/**
 * SVG text does not wrap, so the description is broken into `<tspan>` lines
 * here. Two lines is the ceiling: any more and neighbouring ingredients start
 * writing over each other once the burger is open.
 */
function wrap(text: string): string[] {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;

    // The last permitted line absorbs whatever is left. Overrunning slightly
    // is recoverable; silently dropping the end of a sentence is not.
    if (candidate.length <= WRAP_AT || lines.length === MAX_LINES - 1) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  return lines;
}

/** Gap opened between neighbouring layers when the burger comes apart. */
const SPREAD = 26;

type Layer = {
  id: BurgerLayerId;
  /** Bounding box in source-photo pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * How far this layer is pulled up to sit *onto* the one above it, in source
   * pixels. Cumulative — each value already carries the ones before it — and
   * negative, since packing the stack means moving everything upward.
   */
  collapse: number;
};

const LAYERS: Layer[] = [
  { id: "topBun", x: 294, y: 24, w: 644, h: 220, collapse: 0 },
  { id: "lettuce", x: 257, y: 247, w: 719, h: 193, collapse: -63 },
  { id: "cheese", x: 294, y: 440, w: 643, h: 194, collapse: -123 },
  // The cheese box runs long because its drips hang over the meat, so this
  // junction needs a deeper pull than the others to close the gap you actually
  // see between the slice and the patty. Everything below inherits it.
  { id: "patty", x: 311, y: 600, w: 616, h: 191, collapse: -179 },
  { id: "tomato", x: 347, y: 798, w: 533, h: 133, collapse: -246 },
  { id: "pickles", x: 322, y: 943, w: 585, h: 116, collapse: -318 },
  { id: "bottomBun", x: 293, y: 1059, w: 645, h: 184, collapse: -378 },
];

/**
 * Exposed for the animation: how far each layer travels from its packed
 * resting place out to its place in the diagram — the collapse undone, plus an
 * even gap opened around the patty in the middle.
 */
export const BURGER_LAYERS = LAYERS.map((layer, index) => ({
  id: layer.id,
  dy: -layer.collapse * SCALE + (index - 3) * SPREAD,
}));

export default function BurgerSvg({
  labels = null,
  className,
}: {
  /** Omit to draw the burger on its own, with no callouts. */
  labels?: Record<BurgerLayerId, BurgerLabel> | null;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      aria-hidden
    >
      {/*
        The photo is authored flush to the left so the labels have the right
        side to themselves; this shift centres the stacked burger, and the
        explode animation walks the stack back past it.
      */}
      <g transform={`translate(${COLLAPSED_SHIFT_X} 0)`}>
        {/*
          Painted bottom-up. In SVG the last sibling wins, so reversing the list
          gives the stack the z-order a real burger has: the base sits under the
          pickles, those under the tomato, and so on up to the lid. In source
          order the base would cover everything above it.
        */}
        <g data-burger-stack>
          {[...LAYERS].reverse().map((layer) => {
            const centreY = OFFSET_Y + (layer.y + layer.h / 2) * SCALE;

            return (
              // Outer group packs the layer onto its neighbour; the inner one
              // is what the animation moves, so the two never fight over a
              // single transform.
              <g
                key={layer.id}
                transform={`translate(0 ${(layer.collapse * SCALE).toFixed(1)})`}
              >
                <g data-burger-layer={layer.id}>
                  <image
                    href={`/images/home/anatomy/burger-${layer.id}.webp`}
                    x={(layer.x * SCALE).toFixed(1)}
                    y={(OFFSET_Y + layer.y * SCALE).toFixed(1)}
                    width={(layer.w * SCALE).toFixed(1)}
                    height={(layer.h * SCALE).toFixed(1)}
                  />
                  {labels && (
                    <>
                      <line
                        data-burger-line
                        x1={LINE_START_X}
                        y1={centreY}
                        x2={LINE_END_X}
                        y2={centreY}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0"
                      />
                      <text
                        data-burger-label
                        x={LABEL_X}
                        y={centreY - 4}
                        fontSize={LABEL_SIZE}
                        className="font-findsans uppercase"
                        fill="currentColor"
                        opacity="0"
                      >
                        {labels[layer.id].name}
                      </text>
                      <text
                        data-burger-label
                        x={LABEL_X}
                        fontSize={TEXT_SIZE}
                        fill="currentColor"
                        opacity="0"
                      >
                        {wrap(labels[layer.id].text).map((line, i) => (
                          <tspan
                            key={line}
                            x={LABEL_X}
                            y={centreY + 14 + i * TEXT_LEADING}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
