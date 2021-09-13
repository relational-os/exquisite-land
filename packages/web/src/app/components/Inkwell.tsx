import React from "react";

interface InkwellProps {
  value: number;
}

const Inkwell = ({ value }: InkwellProps) => {
  return (
    <>
      <progress className="inkwell" value={value} />
      <style jsx>{`
        .inkwell {
          transform: rotate(-90deg);
          height: 32px;
          width: calc(600px - 32px);
          appearance: none;
          -webkit-appearance: none;
          border-radius: 16px;
          overflow: hidden;
        }

        .inkwell[value]::-webkit-progress-value {
          background: rgb(${255 - value * 255}, ${value * 255}, 64);
        }

        .inkwell[value]::-webkit-progress-bar {
          background: hsl(0deg 0% 90%);
        }
      `}</style>
    </>
  );
};

export default Inkwell;
