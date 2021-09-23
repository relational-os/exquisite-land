import { useFetchTile } from "@app/features/Graph";
import React from "react";

interface TileSVGProps {
  x: number;
  y: number;
  style?: React.CSSProperties;
  // TODO: this should change to K,V to replace SVG props easier
  viewbox?: string;
}

const TileSVG = ({ x, y, style, viewbox }: TileSVGProps) => {
  const { tile } = useFetchTile(x, y);

  const getTileSVG = () => {
    if (tile.svg) {
      if (viewbox) {
        var parsedSVG = new DOMParser().parseFromString(
          tile.svg,
          "image/svg+xml"
        ) as XMLDocument;

        parsedSVG.querySelector("svg")?.setAttribute("viewBox", viewbox);
        // parsedSVG.querySelector("svg")?.setAttribute("width", "100%");
        // parsedSVG
        //   .querySelector("svg")
        //   ?.setAttribute("preserveAspectRatio", "none");

        // @ts-ignore
        return new XMLSerializer().serializeToString(parsedSVG);
      } else {
        return tile.svg;
      }
    }
    return <></>;
  };

  return (
    <div className="svg" style={style}>
      {tile?.svg && (
        <div
          // className="svg"
          dangerouslySetInnerHTML={{ __html: getTileSVG() }}
        />
      )}
      <style jsx>{`
        .svg {
           {
            /* width: 100%;
          height: 100%; */
          }
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TileSVG;
