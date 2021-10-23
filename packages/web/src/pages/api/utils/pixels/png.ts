import { NextApiHandler } from 'next';
import sharp from 'sharp';
import { Pixels } from '@app/hooks/use-editor';
import { getPathSVGFromPixels } from '@app/features/TileUtils';

const api: NextApiHandler = async (req, res) => {
  const pixels = req.body.pixels as Pixels;
  const image = await getPNGFromPixels(pixels);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  return res.send(image);
};

export const getPNGFromPixels = async (pixels: Pixels) => {
  const png = await sharp(Buffer.from(getPathSVGFromPixels(pixels)))
    .png()
    .toBuffer();
  return png;
};

export default api;
