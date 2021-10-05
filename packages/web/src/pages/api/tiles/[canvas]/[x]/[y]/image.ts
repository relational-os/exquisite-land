import { NextApiHandler } from 'next';
import sharp from 'sharp';
import { gql, request } from 'graphql-request';
import { GRAPH_URL } from '@app/features/Graph';
import { generateTokenID } from '@app/features/TileUtils';

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

  if (!tile?.svg) {
    return res.status(404).end();
  }

  const image = await sharp(Buffer.from(tile.svg, 'utf-8'))
    .resize(32, 32)
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  return res.send(image);
};

export default api;
