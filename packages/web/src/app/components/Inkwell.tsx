import React from "react";
import InkwellOutline from "@app/graphics/inkwell-outline.svg";

interface InkwellProps {
  value: number;
}

const Inkwell = ({ value }: InkwellProps) => {
  return (
    <>
      <div className="inkwell-mask">
        <progress className="inkwell" value={value} />
        <InkwellOutline style={{ position: "absolute" }} />
      </div>
      <style jsx>{`
        .inkwell {
          position: absolute;
          transform: rotate(-90deg);
          height: 64px;
          width: calc(600px - 32px);
          appearance: none;
          -webkit-appearance: none;
          overflow: hidden;
        }

        .inkwell[value]::-webkit-progress-value {
          background: hsl(${value * 120}, 90%, 80%);
        }

        .inkwell[value]::-webkit-progress-bar {
          background: hsl(0deg 0% 90%);
        }

        .inkwell-mask {
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          width: 64px;
          height: 568px;
          mask-image: url(/graphics/inkwell-mask.svg);
        }
      `}</style>
    </>
  );
};
// green 255 > 0.5
// red 255 < 0.5
export default Inkwell;
