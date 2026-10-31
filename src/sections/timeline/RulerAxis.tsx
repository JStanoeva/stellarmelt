import { AXIS_Y, type Ruler } from "./ruler";

// The ruler's fine print: the axis out of the moon's ring, week or day ticks, longer month ticks with their names
// (and the year under the first month and each January), and an arrowhead where time runs on.
export default function RulerAxis({ ruler }: { ruler: Ruler }) {
  const { months, ticks, axisEnd } = ruler;
  return (
    <>
      <svg aria-hidden="true" className="absolute inset-0 size-full overflow-visible fill-none">
        <path d={`M0 ${AXIS_Y}H${axisEnd}`} className="stroke-starlight-300/60" strokeWidth="1" />
        {ticks.map((x) => (
          <path key={x} d={`M${x} ${AXIS_Y - 4}V${AXIS_Y}`} className="stroke-starlight-300/40" strokeWidth="1" />
        ))}
        {months.map((month) => (
          <path
            key={month.key}
            d={`M${month.x} ${AXIS_Y - 7}V${AXIS_Y + 7}`}
            className="stroke-starlight-300/75"
            strokeWidth="1"
          />
        ))}
        <path
          d={`M${axisEnd - 5} ${AXIS_Y - 4}L${axisEnd} ${AXIS_Y}L${axisEnd - 5} ${AXIS_Y + 4}`}
          className="stroke-starlight-300/70"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div aria-hidden="true">
        {months
          .filter((month) => month.labelled)
          .map((month) => (
            <span
              key={month.key}
              style={{ left: month.x + 7, top: AXIS_Y + 13 }}
              className="absolute font-mono text-[0.625rem] leading-[1.5] tracking-[0.2em] whitespace-nowrap text-starlight-300/90 wide:text-[0.6875rem]"
            >
              {month.month}
              {month.year && <span className="block text-mauve-200/75">{month.year}</span>}
            </span>
          ))}
      </div>
    </>
  );
}
