import type { ReactNode } from "react";

/**
 * A burger drawn as separable layers so motion can pull it apart.
 *
 * Geometry lives in one place because three things depend on it agreeing:
 * the stacked art, the exploded spacing, and where each label lands. The
 * viewBox is sized for the *exploded* stack (396 tall) rather than the
 * collapsed one (252), so pulling the layers apart never needs a scale —
 * it is pure translation, which stays crisp and cheap to animate.
 */

export type BurgerLayerId =
  | "topBun"
  | "lettuce"
  | "cheese"
  | "patty"
  | "tomato"
  | "pickles"
  | "bottomBun";

export const VIEWBOX_WIDTH = 600;
export const VIEWBOX_HEIGHT = 420;

/** How far the burger group slides left to make room for labels. */
export const COLLAPSED_SHIFT_X = 80;

type Layer = {
  id: BurgerLayerId;
  /** Vertical travel from stacked position to exploded position. */
  dy: number;
  /** Label baseline in the layer's own (collapsed) coordinates. */
  labelY: number;
  shape: ReactNode;
};

const LABEL_X = 400;
const LINE_START_X = 384;
const LINE_END_X = 392;

export const BURGER_LAYERS: Layer[] = [
  {
    id: "topBun",
    dy: -72,
    labelY: 128,
    shape: (
      <>
        <path
          d="M74 172C74 116 106 84 220 84C334 84 366 116 366 172C366 178 361 182 354 182L86 182C79 182 74 178 74 172Z"
          fill="url(#bunTop)"
        />
        <path
          d="M74 172C74 178 79 182 86 182L354 182C361 182 366 178 366 172C366 168 363 165 358 165L82 165C77 165 74 168 74 172Z"
          fill="#c98f4c"
          opacity="0.35"
        />
        {[
          [150, 128, -18],
          [205, 112, 12],
          [262, 126, -8],
          [178, 152, 6],
          [238, 154, -14],
          [300, 148, 16],
          [122, 158, 10],
          [312, 116, -12],
        ].map(([cx, cy, rot]) => (
          <ellipse
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            rx="9"
            ry="5"
            fill="#fdf3e0"
            opacity="0.9"
            transform={`rotate(${rot} ${cx} ${cy})`}
          />
        ))}
      </>
    ),
  },
  {
    id: "lettuce",
    dy: -52,
    labelY: 185,
    shape: (
      <path
        d="M70 170L370 170L370 186C356 202 342 178 326 190C310 202 296 178 280 190C264 202 250 178 234 190C218 202 204 178 188 190C172 202 158 178 142 190C126 202 112 178 96 190C86 197 76 194 70 186Z"
        fill="url(#lettuceFill)"
      />
    ),
  },
  {
    id: "cheese",
    dy: -30,
    labelY: 207,
    shape: (
      <path
        d="M78 202C78 199 80 196 84 196L356 196C360 196 362 199 362 202L362 214C362 217 360 220 356 220L338 220L338 232C338 238 334 242 328 242C322 242 318 238 318 232L318 220L246 220L246 236C246 242 242 246 236 246C230 246 226 242 226 236L226 220L154 220L154 230C154 236 150 240 144 240C138 240 134 236 134 230L134 220L84 220C80 220 78 217 78 214Z"
        fill="url(#cheeseFill)"
      />
    ),
  },
  {
    id: "patty",
    dy: 6,
    labelY: 236,
    shape: (
      <>
        <path
          d="M66 236C66 224 76 216 90 216L350 216C364 216 374 224 374 236C374 248 364 256 350 256L90 256C76 256 66 248 66 236Z"
          fill="url(#pattyFill)"
        />
        {[
          [112, 230],
          [168, 242],
          [224, 228],
          [280, 241],
          [328, 231],
        ].map(([cx, cy]) => (
          <ellipse
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            rx="13"
            ry="5"
            fill="#4a2f1a"
            opacity="0.45"
          />
        ))}
      </>
    ),
  },
  {
    id: "tomato",
    dy: 28,
    labelY: 265,
    shape: (
      <>
        <rect
          x="74"
          y="252"
          width="292"
          height="26"
          rx="12"
          fill="url(#tomatoFill)"
        />
        {[130, 220, 310].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy="265"
            r="9"
            fill="#f4767a"
            opacity="0.7"
          />
        ))}
      </>
    ),
  },
  {
    id: "pickles",
    dy: 50,
    labelY: 284,
    shape: (
      <>
        {[112, 170, 228, 286, 336].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="284" r="15" fill="#5f8f37" />
            <circle cx={cx} cy="284" r="9" fill="#7fae4f" opacity="0.75" />
          </g>
        ))}
      </>
    ),
  },
  {
    id: "bottomBun",
    dy: 72,
    labelY: 313,
    shape: (
      <path
        d="M86 290L354 290C361 290 366 294 366 300L366 312C366 328 328 336 220 336C112 336 74 328 74 312L74 300C74 294 79 290 86 290Z"
        fill="url(#bunBottom)"
      />
    ),
  },
];

export default function BurgerSvg({
  labels = null,
  className,
}: {
  /** Omit to draw the burger alone — used by the preloader. */
  labels?: Record<BurgerLayerId, string> | null;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="bunTop" x1="220" y1="84" x2="220" y2="182">
          <stop stopColor="#f2cd90" />
          <stop offset="1" stopColor="#d09a55" />
        </linearGradient>
        <linearGradient id="bunBottom" x1="220" y1="290" x2="220" y2="336">
          <stop stopColor="#dfab68" />
          <stop offset="1" stopColor="#c68c47" />
        </linearGradient>
        <linearGradient id="lettuceFill" x1="220" y1="170" x2="220" y2="196">
          <stop stopColor="#8fae55" />
          <stop offset="1" stopColor="#5f7a33" />
        </linearGradient>
        <linearGradient id="cheeseFill" x1="220" y1="196" x2="220" y2="246">
          <stop stopColor="#f9cc5a" />
          <stop offset="1" stopColor="#e39a1f" />
        </linearGradient>
        <linearGradient id="pattyFill" x1="220" y1="216" x2="220" y2="256">
          <stop stopColor="#8a5f38" />
          <stop offset="1" stopColor="#5c3c22" />
        </linearGradient>
        <linearGradient id="tomatoFill" x1="220" y1="252" x2="220" y2="278">
          <stop stopColor="#ef4a50" />
          <stop offset="1" stopColor="#c9161d" />
        </linearGradient>
      </defs>

      {/* Labels claim the right half of the viewBox; without them the burger
          would sit off-centre, so nudge the whole drawing across instead. */}
      <g transform={labels ? undefined : `translate(${COLLAPSED_SHIFT_X} 0)`}>
        {/* Soft ground shadow — stays put while the layers travel. */}
        <ellipse
          data-burger-shadow
          cx="220"
          cy="348"
          rx="140"
          ry="14"
          fill="#002755"
          opacity="0.18"
        />

        <g data-burger-stack>
          {BURGER_LAYERS.map((layer) => (
            <g key={layer.id} data-burger-layer={layer.id}>
              {layer.shape}
              {labels && (
                <>
                  <line
                    data-burger-line
                    x1={LINE_START_X}
                    y1={layer.labelY - 6}
                    x2={LINE_END_X}
                    y2={layer.labelY - 6}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0"
                  />
                  <text
                    data-burger-label
                    x={LABEL_X}
                    y={layer.labelY}
                    className="font-findsans text-[20px] uppercase"
                    fill="currentColor"
                    opacity="0"
                  >
                    {labels[layer.id]}
                  </text>
                </>
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
