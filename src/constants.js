import { rgb, rgba } from "polished";

const SINGLE = false;

let _CRYSTAL_SIZE = 150;
let _SIDES = 3;
// layout
let _MARGIN = _CRYSTAL_SIZE / 2;
let _COLUMNS = 3;
let _ROWS = 4;
let _PADDING = _CRYSTAL_SIZE * 0.1;
let _GRIDBOX = _CRYSTAL_SIZE + _PADDING;
let _START = _CRYSTAL_SIZE / 2 + _MARGIN;
if (!SINGLE) {
  _CRYSTAL_SIZE = 150;

  // layout
  _MARGIN = _CRYSTAL_SIZE / 2;
  _COLUMNS = 3;
  _ROWS = 4;
  _PADDING = _CRYSTAL_SIZE * 0.1;
  _GRIDBOX = _CRYSTAL_SIZE + _PADDING;
  _START = _CRYSTAL_SIZE / 2 + _MARGIN;
} else {
  _CRYSTAL_SIZE = 1000;
  _SIDES = 6;

  // layout
  _MARGIN = 20;
  _COLUMNS = 1;
  _ROWS = 1;
  _PADDING = _CRYSTAL_SIZE * 0.1;
  _GRIDBOX = _CRYSTAL_SIZE + _PADDING;
  _START = _CRYSTAL_SIZE / 2 + _MARGIN;
}

export const CRYSTAL_SIZE = _CRYSTAL_SIZE;
export const SIDES = _SIDES;

// layout
export const MARGIN = _MARGIN;
export const COLUMNS = _COLUMNS;
export const ROWS = _ROWS;
export const PADDING = _PADDING;
export const GRIDBOX = _GRIDBOX;
export const START = _START;

export const FILL = true;

export const PALETTE = [
  // rgb(0, 0, 0), // black
  // rgb(255, 52, 154), // pink
  // rgb(4, 0, 152), // blue
  rgb(240, 85, 48), // POMME Orange
  rgb(29, 90, 73) //POMME GREEN
];

export const ALL_CRYSTALS = [];
