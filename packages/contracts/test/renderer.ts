import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import fs from 'fs';

import chroma from 'chroma-js';

import GenericRendererArtifact from '../artifacts/contracts/GenericRenderer.sol/GenericRenderer.json';
import { GenericRenderer } from '../typechain';

const { deployContract } = waffle;

const RAINBOW_SCALE = chroma
  .scale(['#f00', '#0f0', '#00f', '#f00'])
  .mode('hsl');
const CUBEHELIX_SCALE = chroma.cubehelix().gamma(0.6).scale();

function saveSVG(data: string, name: string) {
  // mkdir test/svg
  fs.mkdir('test/svg', (e) => {
    if (e && e.code != 'EEXIST') {
      console.log(e);
    }
  });
  fs.writeFile(`test/svg/${name}.svg`, data, (e) => {
    if (e) console.log(e);
    else console.log(`wrote test/svg/${name}.svg`);
  });
}

async function renderCubeHelix(
  renderer: GenericRenderer,
  numRows: number,
  numCols: number,
  numColors: number
) {
  const result = await renderer.renderSVG(
    generatePixels(numRows, numCols, numColors),
    CUBEHELIX_SCALE.colors(numColors),
    numColors,
    numRows,
    numCols
  );

  saveSVG(result, `HELIX_${numColors}COLORS_${numCols}x${numRows}`);
}

async function renderRainbow(
  renderer: GenericRenderer,
  numRows: number,
  numCols: number,
  numColors: number
) {
  const result = await renderer.renderSVG(
    generatePixels(numRows, numCols, numColors),
    RAINBOW_SCALE.colors(numColors),
    numColors,
    numRows,
    numCols
  );

  saveSVG(result, `RAINBOW_${numColors}COLORS_${numCols}x${numRows}`);
}

function generatePixels(nRows: number, nCols: number, nColors: number) {
  var s = '0x';
  for (var i = 0; i < nRows * nCols; i++) {
    let colorIndex = i % nColors;
    if ((colorIndex % nColors) / 16 < 1) {
      s += '0' + colorIndex.toString(16);
    } else {
      s += colorIndex.toString(16);
    }
  }
  return s;
}

describe('Renderer', () => {
  let renderer: GenericRenderer;

  beforeEach(async () => {
    // 1
    const signers = await ethers.getSigners();

    // 2
    renderer = (await deployContract(
      signers[0],
      GenericRendererArtifact
    )) as GenericRenderer;
  });

  // describe('32x32 - 16 Colors', () => {
  //   it('Should render 32x32 with 16 Colors', async function () {
  //     const WIDTH = 32;
  //     const HEIGHT = 32;
  //     const NUM_COLORS = 16;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('32x32 - 32 Colors', function () {
  //   it('Should render 32x32 with 32 Colors', async function () {
  //     const WIDTH = 32;
  //     const HEIGHT = 32;
  //     const NUM_COLORS = 32;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('32x32 - 256 Colors', function () {
  //   it('Should render 32x32 with 256 Colors', async function () {
  //     const WIDTH = 32;
  //     const HEIGHT = 32;
  //     const NUM_COLORS = 256;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('48x48 - 48 Colors', function () {
  //   it('Should render 48x48 with 48 Colors', async function () {
  //     const WIDTH = 48;
  //     const HEIGHT = 48;
  //     const NUM_COLORS = 48;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('48x48 - 16 Colors', function () {
  //   it('Should render 48x48 with 16 Colors', async function () {
  //     const WIDTH = 48;
  //     const HEIGHT = 48;
  //     const NUM_COLORS = 16;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('54x54 - 54 Colors', function () {
  //   it('Should render 54x54 with 54 Colors', async function () {
  //     const WIDTH = 54;
  //     const HEIGHT = 54;
  //     const NUM_COLORS = 54;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // for (let v = 16; v < 65; v += 4) {
  //   describe(`${v}x${v} - 2 Colors`, function () {
  //     it(`Should render ${v}x${v} with 2 Colors`, async function () {
  //       const WIDTH = v;
  //       const HEIGHT = v;
  //       const NUM_COLORS = 2;

  //       const done = await renderCubeHelix(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //     });
  //   });
  // }

  for (let v = 56; v < 65; v += 4) {
    describe(`${v}x${v} - 16 Colors`, function () {
      it(`Should render ${v}x${v} with 16 Colors`, async function () {
        const WIDTH = v;
        const HEIGHT = v;
        const NUM_COLORS = 16;

        const done = await renderCubeHelix(renderer, HEIGHT, WIDTH, NUM_COLORS);
      });
    });
  }

  // describe('32x32 - 2 Colors', function () {
  //   it('Should render 32x32 with 2 Colors', async function () {
  //     const WIDTH = 32;
  //     const HEIGHT = 32;
  //     const NUM_COLORS = 2;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('56x56 - 56 Colors', function () {
  //   it('Should render 56x56 with 56 Colors', async function () {
  //     const WIDTH = 56;
  //     const HEIGHT = 56;
  //     const NUM_COLORS = 56;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('60x60 - 60 Colors', function () {
  //   it('Should render 60x60 with 60 Colors', async function () {
  //     const WIDTH = 60;
  //     const HEIGHT = 60;
  //     const NUM_COLORS = 60;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('60x60 - 60 Colors Cube', function () {
  //   it('Should render 60x60 with 60 Colors', async function () {
  //     const WIDTH = 60;
  //     const HEIGHT = 60;
  //     const NUM_COLORS = 60;

  //     const done = await renderCubeHelix(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  describe('56x56 - 16 Colors', function () {
    it('Should render 56x56 with 16 Colors', async function () {
      const WIDTH = 56;
      const HEIGHT = 56;
      const NUM_COLORS = 16;

      const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
    });
  });

  // describe('64x64 - 16 Colors', function () {
  //   it('Should render 64x64 with 16 Colors', async function () {
  //     const WIDTH = 64;
  //     const HEIGHT = 64;
  //     const NUM_COLORS = 16;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });

  // describe('64x64 - 64 Colors', function () {
  //   it('Should render 64x64 with 64 Colors', async function () {
  //     const WIDTH = 64;
  //     const HEIGHT = 64;
  //     const NUM_COLORS = 64;

  //     const done = await renderRainbow(renderer, HEIGHT, WIDTH, NUM_COLORS);
  //   });
  // });
});
