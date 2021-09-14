import { request, gql } from 'graphql-request';
import useSWR, { SWRConfiguration } from 'swr';

export const GRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/shahruz/mydemograph2';

let query = gql`
  query CanvasQuery($canvas: String) {
    canvas(id: $canvas) {
      id
      palette
      tiles(first: 500) {
        id
        x
        y
        status
        svg
        owner {
          id
        }
      }
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
    [canvasID, 'canvas-fetch'],
    canvasID => request(GRAPH_URL, query, { canvas: `${canvasID}` }),
    { revalidateOnMount: true, ...swrOptions }
  );
  const tile = data?.canvas?.tiles.find((tile: any) => {
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
    [canvasID, 'canvas-fetch'],
    canvasID => request(GRAPH_URL, query, { canvas: `${canvasID}` }),
    { revalidateOnMount: true, ...swrOptions }
  );
  return { data, error, refresh: mutate };
};
