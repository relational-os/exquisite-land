// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract GenericRenderer {
  struct RLEPaths {
    RLEPath[] paths;
    uint16 num_paths;
  }

  struct RLEPath {
    uint16 colStart;
    uint16 rowStart;
    uint8 runLength;
    uint8 colorIndex;
  }

  // TODO: ^ is it more gas efficient to construct this on the fly using char codes directly?

  string[256] lookup = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '100',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
    '111',
    '112',
    '113',
    '114',
    '115',
    '116',
    '117',
    '118',
    '119',
    '120',
    '121',
    '122',
    '123',
    '124',
    '125',
    '126',
    '127',
    '128',
    '129',
    '130',
    '131',
    '132',
    '133',
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '140',
    '141',
    '142',
    '143',
    '144',
    '145',
    '146',
    '147',
    '148',
    '149',
    '150',
    '151',
    '152',
    '153',
    '154',
    '155',
    '156',
    '157',
    '158',
    '159',
    '160',
    '161',
    '162',
    '163',
    '164',
    '165',
    '166',
    '167',
    '168',
    '169',
    '170',
    '171',
    '172',
    '173',
    '174',
    '175',
    '176',
    '177',
    '178',
    '179',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189',
    '190',
    '191',
    '192',
    '193',
    '194',
    '195',
    '196',
    '197',
    '198',
    '199',
    '200',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
    '208',
    '209',
    '210',
    '211',
    '212',
    '213',
    '214',
    '215',
    '216',
    '217',
    '218',
    '219',
    '220',
    '221',
    '222',
    '223',
    '224',
    '225',
    '226',
    '227',
    '228',
    '229',
    '230',
    '231',
    '232',
    '233',
    '234',
    '235',
    '236',
    '237',
    '238',
    '239',
    '240',
    '241',
    '242',
    '243',
    '244',
    '245',
    '246',
    '247',
    '248',
    '249',
    '250',
    '251',
    '252',
    '253',
    '254',
    '255'
  ];
  uint8 constant NUM_PIXELS_PER_BYTE = 2;
  uint16 constant MAX_COLORS = 16;
  uint8 constant MAX_ROWS = 64;
  uint8 constant MAX_COLS = 64;
  uint16 constant MAX_DATA_SIZE = 512;
  string constant SVG_OPENER =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 -0.5 ';
  string constant CLOSE_SVG_OPENER = '">';
  string constant SVG_CLOSER = '</svg>';
  string constant PATH_PREFIX = '<path stroke="';
  string constant PATH_START_DATA = '" d="';
  string constant END_TAG = '"/>';

  // TODO: it might be useful to try to have a 2d array here for scratch instead of using memory

  function countConsecutive(
    bytes calldata data,
    uint16 index,
    uint16 num_cols
  ) internal pure returns (uint8) {
    uint8 num = 1;

    while ((index + num) % num_cols != 0) {
      if (data[index] == data[index + num]) num++;
      else break;
    }

    return num;
  }

  function isEmptyString(bytes memory s) internal pure returns (bool) {
    return (s.length == 0);
  }

  function renderSVGGenericPacked(
    bytes calldata data,
    string[] calldata palette,
    uint16 num_colors,
    uint8 num_rows,
    uint8 num_cols
  ) public view returns (string memory) {}

  function renderSVG(
    bytes calldata data,
    string[] calldata palette,
    uint16 num_colors,
    uint16 num_rows,
    uint16 num_cols
  ) public view returns (string memory) {
    console.log('data', data.length);
    console.log('palette', palette.length);
    console.log('num colors', num_colors);
    console.log('num rows', num_rows);
    console.log('num cols', num_cols);
    console.log('num pixels', num_cols * num_rows);

    require(num_colors <= 256, 'number of colors is greater than 256');
    require(
      palette.length == num_colors,
      'Palette specified does not match the number of colors in it'
    );
    require(num_rows <= 128, 'number of rows is greater than 128');
    require(num_cols <= 128, 'number of columns is greater than 128');
    require(
      data.length == num_rows * num_cols,
      'Amount of data provided does not match the number of rows and columns'
    );

    uint256 startGas = gasleft();

    // prettier-ignore
    // string[256] memory paths = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
    // string[256] memory paths;
    // prettier-ignore
    bytes[256] memory paths;
    // prettier-ignore
    uint8[16] memory multiplier = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (uint16 h = 0; h < num_rows; h++) {
      for (uint16 m = 0; m < num_cols; m) {
        uint16 index = (h * num_rows) + m;
        // uint8 c = countConsecutive(data, index, num_cols);

        uint8 c = 1;

        while ((index + c) % num_cols != 0) {
          if (data[index] == data[index + c]) c++;
          else break;
        }

        uint8 ci = uint8(data[index]);
        ci = uint8(ci + (num_colors * multiplier[ci]));
        if (paths[ci].length > 500) {
          if (multiplier[ci % num_colors] < 8) {
            multiplier[ci % num_colors]++;
          }
          ci = uint8(ci + num_colors * multiplier[ci % num_colors]);
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

    string memory output = string(
      abi.encodePacked(
        SVG_OPENER,
        lookup[num_cols],
        ' ',
        lookup[num_rows],
        CLOSE_SVG_OPENER
      )
    );
    for (uint16 i = 0; i < num_colors; i++) {
      for (uint8 mul = 0; mul < 8; mul++) {
        if (isEmptyString(paths[i + (num_colors * mul)])) break;
        output = string(
          abi.encodePacked(
            output,
            PATH_PREFIX,
            palette[i % num_colors],
            PATH_START_DATA,
            paths[i + (num_colors * mul)],
            END_TAG
          )
        );
      }
    }

    output = string(abi.encodePacked(output, SVG_CLOSER));

    console.log('String len', paths[0].length);
    console.log('Gas Used', startGas - gasleft());
    console.log('Gas Left', gasleft());

    return output;
  }
}
