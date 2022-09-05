// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract GenericRenderer {
  // prettier-ignore
  string[256] lookup = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100','101','102','103','104','105','106','107','108','109','110','111','112','113','114','115','116','117','118','119','120','121','122','123','124','125','126','127','128','129','130','131','132','133','134','135','136','137','138','139','140','141','142','143','144','145','146','147','148','149','150','151','152','153','154','155','156','157','158','159','160','161','162','163','164','165','166','167','168','169','170','171','172','173','174','175','176','177','178','179','180','181','182','183','184','185','186','187','188','189','190','191','192','193','194','195','196','197','198','199','200','201','202','203','204','205','206','207','208','209','210','211','212','213','214','215','216','217','218','219','220','221','222','223','224','225','226','227','228','229','230','231','232','233','234','235','236','237','238','239','240','241','242','243','244','245','246','247','248','249','250','251','252','253','254','255'];

  uint16 constant MAX_COLORS = 256;
  uint8 constant MAX_ROWS = 56;
  uint8 constant MAX_COLS = 56;
  uint8 constant MAX_MULTIPLIER = 16;

  // TODO: incorporate this into the interface, or directly into the rendering step
  string constant PATH_SVG_OPENER =
    '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 -0.5 ';
  string constant RECT_SVG_OPENER =
    '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" version="1.1" viewBox="0 0 512 512';
  string constant RECT_STYLES = '<style>rect{height:1px;width:1px;}</style>';
  string constant RECT_TRANSFORM = '<g transform="scale(16 16)">';
  string constant CLOSE_SVG_OPENER = '">';
  string constant PATH_SVG_CLOSER = '</g></svg>';
  string constant RECT_PREFIX = '<rect fill="';
  string constant PATH_PREFIX = '<path stroke="';
  string constant PATH_START_DATA = '" d="';
  string constant END_TAG = '"/>';

  function isEmptyString(bytes memory s) internal pure returns (bool) {
    return (s.length == 0);
  }

  function getPaths(
    bytes calldata data,
    uint16 numColors,
    uint16 numRows,
    uint16 numCols
  ) internal view returns (bytes[] memory, uint8[] memory) {
    uint256 startGas = gasleft();
    uint8 c;
    bytes[] memory paths = new bytes[](MAX_COLORS * MAX_MULTIPLIER);

    // bytes[] memory paths = new bytes[](numColors);
    // prettier-ignore
    uint8[] memory multiplier = new uint8[](MAX_COLORS);

    for (uint16 h = 0; h < numRows; h++) {
      for (uint16 m = 0; m < numCols; m) {
        uint16 index = (h * numCols) + m;

        /* == START: Get RLE length ==*/
        c = 1;

        while ((index + c) % numCols != 0) {
          if (data[index] == data[index + c]) c++;
          else break;
        }
        /* == END: Get RLE length ==*/

        uint16 ci = uint16(uint8(data[index]));

        // Optimize gas by not creating long strings
        ci = uint16(ci + (numColors * multiplier[ci]));
        if (paths[ci].length > 700) {
          if (multiplier[ci % numColors] < MAX_MULTIPLIER) {
            multiplier[ci % numColors]++;
          }
          ci = uint16(
            uint8(data[index]) + numColors * multiplier[ci % numColors]
          );
        }

        paths[ci] = abi.encodePacked(
          paths[ci],
          'M',
          lookup[m],
          ' ',
          lookup[h],
          'h',
          lookup[c]
        );

        m += c;
      }
    }

    console.log('Gas Used while creating paths', startGas - gasleft());
    console.log('Gas Left after creating paths', gasleft());

    return (paths, multiplier);
  }

  function renderSVGPaths(
    bytes calldata data,
    string[] calldata palette,
    uint16 numRows,
    uint16 numCols
  ) public view returns (string memory) {
    require(
      palette.length <= MAX_COLORS,
      'number of colors is greater than max'
    );
    require(numRows <= MAX_ROWS, 'number of rows is greater than max');
    require(numCols <= MAX_COLS, 'number of columns is greater than max');
    require(
      data.length == numRows * numCols,
      'Amount of data provided does not match the number of rows and columns'
    );

    uint8 numColors = uint8(palette.length);

    uint256 startGas = gasleft();

    (bytes[] memory paths, uint8[] memory multiplier) = getPaths(
      data,
      numColors,
      numRows,
      numCols
    );

    string memory output = string(
      abi.encodePacked(
        PATH_SVG_OPENER,
        lookup[numCols],
        ' ',
        lookup[numRows],
        CLOSE_SVG_OPENER
      )
    );

    for (uint16 i = 0; i < numColors; i++) {
      // for (uint8 mul = 0; mul < 1; mul++) {
      for (uint8 mul = 0; mul <= multiplier[i]; mul++) {
        // TODO for gas savings it might be worth inlining the function call
        if (isEmptyString(paths[i + (numColors * mul)])) break;
        output = string(
          abi.encodePacked(
            output,
            PATH_PREFIX,
            palette[i % numColors],
            PATH_START_DATA,
            paths[i + (numColors * mul)],
            END_TAG
          )
        );
      }
    }

    output = string(abi.encodePacked(output, PATH_SVG_CLOSER));

    // console.log('String len', paths[0].length);
    console.log('Gas Used', startGas - gasleft());
    console.log('Gas Left', gasleft());

    return output;
  }

  struct SVGCursor {
    uint8 x;
    uint8 y;
    string color1;
    string color2;
    string color3;
    string color4;
  }

  function pixel4(SVGCursor memory pos) internal view returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<rect fill="',
          pos.color1,
          '" x="',
          lookup[pos.x],
          '" y="',
          lookup[pos.y],
          '" height="1" width="1"/>',
          '<rect fill="',
          pos.color2,
          '" x="',
          lookup[pos.x + 1],
          '" y="',
          lookup[pos.y],
          '" height="1" width="1"/>',
          string(
            abi.encodePacked(
              '<rect fill="',
              pos.color3,
              '" x="',
              lookup[pos.x + 2],
              '" y="',
              lookup[pos.y],
              '" height="1" width="1"/>',
              '<rect fill="',
              pos.color4,
              '" x="',
              lookup[pos.x + 3],
              '" y="',
              lookup[pos.y],
              '" height="1" width="1"/>'
            )
          )
        )
      );
  }

  function encodeBufferPos(string[36] memory buffer, uint8 pos)
    internal
    pure
    returns (bytes memory)
  {
    return
      abi.encodePacked(
        buffer[0 + (pos * 12)],
        buffer[1 + (pos * 12)],
        buffer[2 + (pos * 12)],
        buffer[3 + (pos * 12)],
        buffer[4 + (pos * 12)],
        buffer[5 + (pos * 12)],
        buffer[6 + (pos * 12)],
        buffer[7 + (pos * 12)],
        buffer[8 + (pos * 12)],
        buffer[9 + (pos * 12)],
        buffer[10 + (pos * 12)],
        buffer[11 + (pos * 12)]
      );
  }

  function encodeBuffer(string[36] memory buffer)
    internal
    pure
    returns (bytes memory)
  {
    return (
      abi.encodePacked(
        encodeBufferPos(buffer, 0),
        encodeBufferPos(buffer, 1),
        encodeBufferPos(buffer, 2)
      )
    );
  }

  /* RECT RENDERER */
  function renderSVG(
    bytes calldata data,
    string[] calldata palette,
    uint16 numRows,
    uint16 numCols
  ) public view returns (string memory) {
    require(
      palette.length <= MAX_COLORS,
      'number of colors is greater than max'
    );
    require(numRows <= MAX_ROWS, 'number of rows is greater than max');
    require(numCols <= MAX_COLS, 'number of columns is greater than max');
    require(
      data.length == numRows * numCols,
      'Amount of data provided does not match the number of rows and columns'
    );

    uint256 startGas = gasleft();

    string memory output = string(
      abi.encodePacked(
        RECT_SVG_OPENER,
        // TODO: viewbox needs to be calculated
        // lookup[numCols],
        // ' ',
        // lookup[numRows],
        '">',
        RECT_TRANSFORM
        // '<style>rect{height:1px;width:1px;}</style>'
      )
    );

    // TODO: Optimize buffer structure
    // uint8 bufSize = numRows >= numCols ? numRows : numCols;
    // console.log('allocating buffer of size:', bufSize);

    SVGCursor memory pos;
    string[36] memory buffer;
    uint8 buffSize = 0;

    for (uint8 h = 0; h < numRows; h++) {
      for (uint8 m = 0; m < numCols; m) {
        // uint16 index = ;

        pos.color1 = palette[uint8(data[(h * numCols) + m])];
        pos.color2 = palette[uint8(data[(h * numCols) + m + 1])];
        pos.color3 = palette[uint8(data[(h * numCols) + m + 2])];
        pos.color4 = palette[uint8(data[(h * numCols) + m + 3])];
        pos.x = m;
        pos.y = h;

        // /* == START: Get RLE length ==*/
        // c = 1;

        // while ((index + c) % numCols != 0) {
        //   if (data[index] == data[index + c]) c++;
        //   else break;
        // }
        // /* == END: Get RLE length ==*/

        // uint16 ci = uint16(uint8(data[index]));
        buffer[buffSize] = string(pixel4(pos));
        buffSize++;

        if (buffSize == 36) {
          output = string(abi.encodePacked(output, encodeBuffer(buffer)));
          buffSize = 0;
        }

        // m += c;
        m += 4;
      }
    }

    while (buffSize != 0) {
      output = string(abi.encodePacked(output, buffer[buffSize - 1]));
      buffSize--;
    }

    output = string(abi.encodePacked(output, '</g></svg>'));

    // console.log('String len', paths[0].length);
    console.log('Gas Used', startGas - gasleft());
    console.log('Gas Left', gasleft());

    return output;
  }
}
