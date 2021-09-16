import React, { useState } from "react";

const SIZE = 20;
const columns = Array.from(Array(32).keys());
const rows = Array.from(Array(32).keys());

const palette = ["#B0B", "B00B", "#B0B0"];

const Test = () => {
  const [drawing, setDrawing] = useState(false);
  const [pickles, setPixels] = useState<string[][]>([]);

  const [activeColor, setActiveColor] = useState("#B00B");
  console.log(pickles);

  const touchEnter = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!drawing) return;
    e.preventDefault();

    const elem = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    if (!elem) return;
    if (!elem.getAttribute("class")?.includes("box")) return;
    elem?.setAttribute("style", `background-color: ${activeColor}`);
    const [x, y] = elem
      .getAttribute("id")!
      .split("_")
      .map((n) => parseInt(n));

    e.currentTarget.style.backgroundColor = activeColor;

    setPixels((pickles) => {
      if (!pickles[x]) {
        pickles[x] = [];
      }
      pickles[x][y] = activeColor;

      return pickles;
    });

    // console.log(e, x, y);
  };

  const onMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    if (!drawing) return;

    e.preventDefault();
    // console.log(e.clientX, e.clientY);
    // const elem = document.elementFromPoint(e.clientX, e.clientY);
    // elem?.setAttribute("style", "backgroundColor: #000");
    e.currentTarget.style.backgroundColor = activeColor;

    setPixels((pickles) => {
      if (!pickles[x]) {
        pickles[x] = [];
      }
      pickles[x][y] = activeColor;
      return pickles;
    });

    // console.log(e, x, y);
  };

  return (
    <div className="page">
      {drawing ? "drawing" : "not"}
      <div
        className="test"
        draggable={false}
        onPointerDown={() => setDrawing(true)}
        onPointerUp={() => setDrawing(false)}
      >
        {columns.map((y) => {
          return rows.map((x) => {
            return (
              <div
                id={`${x}_${y}`}
                className="box"
                style={{ backgroundColor: pickles?.[x]?.[y] }}
                onPointerEnter={(e) => onMouseEnter(e, x, y)}
                onMouseDown={(e) => onMouseEnter(e, x, y)}
                onMouseOver={(e) => onMouseEnter(e, x, y)}
                onTouchMove={(e) => {
                  //   console.log("touch move", e);
                  //   onMouseEnter(e, x, y);
                  touchEnter(e);
                }}
                onTouchStart={(e) => {
                  //   console.log("touch start", e);
                  //   onMouseEnter(e, x, y);
                  touchEnter(e);
                }}
                // onFocus={(e) => onMouseEnter(e, x, y)}
                // onTouchStart={(e) => onMouseEnter(e, x, y)}
              ></div>
            );
          });
        })}
      </div>
      <style jsx>{`
        .test {
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          width: ${rows.length * SIZE}px;
          height: ${columns.length * SIZE}px;
          user-select: none;
          touch-action: none;
        }
        .box {
          width: ${SIZE}px;
          height: ${SIZE}px;
          border: 1px solid #000;
        }
        .page {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          margin: 5rem;
        }
      `}</style>
    </div>
  );
};

export default Test;
