import React from "react";
import { render } from "react-dom";
import P5Wrapper from "react-p5-wrapper";
import P6Wrapper from "./pWrapper";
import p from "p5";
import { rgb } from "polished";
import { doSketch } from "./tutorial";
import { doSketch2 } from "./mondlebrot";
import { doSketch3 } from "./mine";
import {
  CRYSTAL_SIZE,
  SIDES,
  MARGIN,
  COLUMNS,
  ROWS,
  PADDING,
  GRIDBOX,
  START
} from "./constants";

let PALETTE = [];
let ALL_CRYSTALS = [];
PALETTE = [
  rgb(255, 52, 154), // pink
  rgb(4, 0, 152) // blue
];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      hue: 0,
      drag: 0.2,
      baseHue: 255,
      lifespan: 255,
      painting: false
    };
  }

  saveSVG() {
    alert("t")
    p.saveSVG("my.svg");
  }

  render() {
    return (
      <div>
        <P6Wrapper sketch={doSketch3}>
          {({ saveSVG }) => <button onClick={saveSVG}>save SVG</button>}
        </P6Wrapper>
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
