import pe from "p5";
import {
  CRYSTAL_SIZE,
  SIDES,
  MARGIN,
  COLUMNS,
  ROWS,
  PADDING,
  GRIDBOX,
  START,
  PALETTE,
  ALL_CRYSTALS
} from "./constants";

export const doSketch3 = p => {
  //---------------
  p.setup = function() {
    const totalX = START + GRIDBOX * COLUMNS;
    const totalY = START + GRIDBOX * ROWS;
    p.createCanvas(totalX, totalY, p.SVG);

    p.noLoop();
    p.angleMode(p.DEGREES);
    p.rectMode(p.CENTER);
  };

  const drawTriangle = (p, i, size) => {
    const length = size / 2;
    p.triangle(0, 0, -length, size, length, size);
  };
  const drawRect = (p, i, size) => {
    p.rect(0, 0, size, size);
  };
  const drawPoint = (p, i, size) => {
    p.point(0, 0);
  };
  const drawArc = (p, i, size) => {
    p.arc(0, 0, size / 2, size, -size, p.PI);
  };
  const drawCircle = (p, i, size) => {
    p.circle(0, 0, size);
  };

  const options = [drawCircle, drawPoint, drawTriangle];
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  const drawNode = (p, i, size) => {
    let selection = getRandomInt(options.length);
    return options[selection](p, i, size);
  };

  const drawSpoke = (p, i, size, space) => {
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
    p.translate(0, -space);
    drawNode(p, i, size);
  };

  p.draw = function() {
    const totalX = START + GRIDBOX * COLUMNS;
    const totalY = START + GRIDBOX * ROWS;
    p.background(255);
    // p.fill(0);
    // p.fill(0,1,20)
    p.noFill();
    p.translate(totalX / 2, totalY / 2);

    let slice = 361;
    let angle = p.radians(360 / 12);

    let iterator1 = 1;
    let gap1 = 50;
    let iterations1 = 360;
    function bifurcatingGap(gap) {
      gap1 = (gap1 ^ 2) + gap;
    }
    for (let i = 0; i < iterations1; i += iterator1) {
      // bifurcatingGap(1);
      drawSpoke(p, i, 26, gap1);
      p.translate(0, 6 * gap1);
      p.rotate(iterator1);
    }

    // let iterator2 = 23;
    // let gap2 = 10;
    // for (let i = 0; i < slice; i += iterator2) {
    //   let gapper = gap2 ^ 3;
    //   drawSpoke(p, i, 10, gapper);
    //   p.translate(0, 6 * gapper);
    //   p.rotate(iterator2);
    // }

    // let iterator = 3;
    // let gap = 20;
    // for (let i = 0; i < slice; i += iterator) {
    //   let gapper = gap ^ 37;
    //   drawSpoke(p, i, 10, gapper);
    //   p.translate(0, 6 * gapper);
    //   p.rotate(iterator);
    // }

    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal

    // It all starts with the width, try higher or lower values

    // If it's time for a new point
  };
};
