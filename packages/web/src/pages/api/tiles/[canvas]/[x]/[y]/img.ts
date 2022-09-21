import { NextApiHandler } from 'next';
import sharp from 'sharp';
import { gql, request } from 'graphql-request';
import { generateTokenID } from '@app/features/TileUtils';
import { GRAPH_URL } from '@app/features/AddressBook';

// @ts-ignore
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

  if (!tile?.svg) return res.status(404).end();

  const sizeParam = parseInt(req.query.size as string);
  let image;

  if (sizeParam) {
    // render with custom size
    image = await sharp(Buffer.from(tile.svg, 'utf-8'), {
      density: 1024
    })
      .resize(sizeParam, sizeParam)
      .png()
      .toBuffer();
  } else {
    // render with defalut size
    image = await sharp(Buffer.from(tile.svg, 'utf-8'), {
      density: 1024
    })
      .resize(512, 512)
      .png()
      .toBuffer();
  }

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, s-max-age=31536000');
  return res.send(image);
};

export default api;
