import { request, gql } from "graphql-request";
import useSWR, { SWRConfiguration } from "swr";

const graphURL = "https://api.thegraph.com/subgraphs/name/shahruz/mydemograph";

let query = gql`
  query TilesQuery($canvas: String) {
    tiles(first: 500, where: { canvas: $canvas }) {
      id
      x
      y
      status
      canvas {
        id
      }
      owner {
        id
      }
      svg
    }
  }
`;

// TODO: pagination

export const useFetchTile = (
  canvasID: number,
  x: number,
  y: number,
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR(
    [canvasID, "canvas-fetch"],
    (canvasID) => request(graphURL, query, { canvas: `${canvasID}` }),
    { revalidateOnMount: true, ...swrOptions }
  );
  let tile = data?.tiles.find((tile: any) => {
    return tile.x == x && tile.y == y;
  });

  return { tile, error, refresh: mutate };
};

export const useFetchCanvas = (
  canvasID: number,
  // variables?: Variables,
  swrOptions?: Partial<SWRConfiguration>
) => {
  const { data, error, mutate } = useSWR(
    [canvasID, "canvas-fetch"],
    (canvasID) => request(graphURL, query, { canvas: `${canvasID}` }),
    { revalidateOnMount: true, ...swrOptions }
  );
  return { data, error, refresh: mutate };
};
