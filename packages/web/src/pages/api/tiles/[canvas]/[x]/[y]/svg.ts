import { NextApiHandler } from 'next';
import sharp from 'sharp';
import { gql, request } from 'graphql-request';
import { generateTokenID } from '@app/features/TileUtils';
import { GRAPH_URL } from '@app/features/AddressBook';

const api: NextApiHandler = async (req, res) => {
  const tokenId = generateTokenID(
    parseInt(req.query.x as string),
    parseInt(req.query.y as string)
  );
  const { tile } = await request(
    GRAPH_URL,
    gql`
      {
        tile(id: ${tokenId}) {
          svg
        }
      }
    `
  );

  if (!tile) return res.status(404).end();

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-max-age=31536000');
  return res.send(tile.svg);
};

export default api;
