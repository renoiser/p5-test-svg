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

export const doSketch2 = p => {
  const state = {
    sides: SIDES,
    stepsOut: 10,
    thinStroke: 0.5,
    thickStroke: 2
  };

  const setState = state => {
    (state.numShapes = state.sides),
      (state.angle = 360 / state.numShapes),
      (state.singleStep = CRYSTAL_SIZE / 2 / state.stepsOut),
      (state.layerColor = getRandomFromPalette());
    return state;
  };

  const circles = state => {
    state.shapeSize = (CRYSTAL_SIZE / 2) * 0.93;
    state.position = CRYSTAL_SIZE / 2 - state.shapeSize / 2;

    return {
      name: "circles",
      state,
      render: () => {
        p.noFill();
        p.stroke(state.layerColor);
        p.strokeWeight(1);
        p.push();
        //translate(width/2, height/2)
        for (let i = 0; i <= state.numShapes; i++) {
          p.ellipse(state.position, 0, state.shapeSize, state.shapeSize);
          p.rotate(state.angle);
        }
        p.pop();
      }
    };
  };

  const simpleLines = state => {
    state.numSteps = randomSelectTwo()
      ? state.stepsOut
      : p.int(state.stepsOut * 1.25);
    state.step = CRYSTAL_SIZE / 2 / state.numSteps;
    state.start = p.floor(p.random(0, state.numSteps));
    state.stop = p.floor(p.random(state.start, state.numSteps + 1));
    state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;
    state.numShapes = randomSelectTwo() ? state.sides : state.sides * 2;
    state.angle = 360 / state.numShapes;

    return {
      name: "Simple Lines",
      state,
      render: () => {
        p.noFill();
        p.stroke(state.layerColor);
        p.strokeWeight(state.weight);
        p.push();
        //translate(width/2, height/2)
        for (let i = 0; i < state.numShapes; i++) {
          p.line(state.start * state.step, 0, state.stop * state.step, 0);
          p.rotate(state.angle);
        }
        p.pop();
      }
    };
  };

  const outlineShape = state => {
    state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;
    state.hexagonTrue = randomSelectTwo();

    return {
      name: "Outline Shape",
      state,
      render: () => {
        p.stroke(state.layerColor);
        p.strokeWeight(state.weight);
        p.push();
        //translate(width/2, height/2)
        if (state.hexagonTrue) {
          hexagon(0, 0, CRYSTAL_SIZE / 2);
        } else {
          p.ellipse(0, 0, CRYSTAL_SIZE, CRYSTAL_SIZE);
        }
        p.pop();
      }
    };
  };

  const dottedLines = state => {
    state.numShapes = randomSelectTwo() ? state.sides : state.sides * 2;
    state.angle = 360 / state.numShapes;
    state.shapeSize = 3;
    state.centerOffset = state.singleStep;

    return {
      name: "Dotted Lines",
      state,
      render: () => {
        p.fill(state.layerColor);
        p.noStroke();
        p.push();
        //translate(width / 2, height / 2)
        for (let i = 0; i <= state.numShapes; i++) {
          for (
            let x = state.centerOffset;
            x < CRYSTAL_SIZE / 2;
            x += state.singleStep
          ) {
            p.rect(x, 0, state.shapeSize, state.shapeSize);
          }
          p.rotate(state.angle);
        }
        p.pop();
      }
    };
  };

  const centeredShape = state => {
    state.randomShape = p.random(1);
    state.shapeSize =
      p.floor(p.random(state.stepsOut / 2, state.stepsOut - 2)) *
      state.singleStep;

    return {
      name: "Centered Shape",
      state,
      render: () => {
        p.fill(state.layerColor);
        p.noStroke();
        p.push();
        // translate(width / 2, height / 2)
        if (state.randomShape < 0.1) {
          p.rect(0, 0, state.shapeSize * 2, state.shapeSize * 2);
        } else if (state.randomShape >= 0.1 && state.randomShape < 0.6) {
          p.ellipse(0, 0, state.shapeSize * 2, state.shapeSize * 2);
        } else if (state.randomShape >= 0.6) {
          p.rotate(state.angle / 2);
          hexagon(0, 0, state.shapeSize);
        }
        p.pop();
      }
    };
  };

  const ringOfShapes = state => {
    state.steps = p.floor(p.random(1, state.stepsOut));
    state.center = state.steps * state.singleStep;
    state.randomShape = p.random(1);
    state.direction = randomSelectTwo(); // used for triangle only
    state.fillColor = randomSelectTwo() ? state.layerColor : p.color(0, 1);
    state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;

    if (state.steps < state.stepsOut / 2) {
      state.radius = p.floor(p.random(1, state.steps)) * state.singleStep;
    } else if (state.steps > state.stepsOut / 2) {
      state.radius =
        p.floor(p.random(1, state.stepsOut - state.steps)) * state.singleStep;
    } else {
      state.radius =
        p.floor(p.random(1, state.stepsOut / 2 + 1)) * state.singleStep;
    }

    return {
      name: "Ring of Shapes",
      state,
      render: () => {
        p.stroke(state.layerColor);
        p.fill(state.fillColor);
        p.strokeWeight(state.weight);
        p.push();
        //translate(width / 2, height / 2)
        for (let i = 0; i < state.numShapes; i++) {
          if (state.randomShape < 0.33) {
            p.ellipse(0, state.center, state.radius, state.radius);
          } else if (state.randomShape >= 0.33 && state.randomShape < 0.66) {
            p.rect(0, state.center, state.radius, state.radius);
          } else if (state.randomShape >= 0.66) {
            myTriangle(state.center, state.radius, state.direction);
          }
          p.rotate(state.angle);
        }
        p.pop();
      }
    };
  };

  const steppedHexagons = state => {
    state.numSteps = randomSelectTwo() ? state.stepsOut : state.stepsOut * 1.25;
    state.centerOffset = (CRYSTAL_SIZE / 2) * 0.15;
    state.singleStep = (CRYSTAL_SIZE / 2 - state.centerOffset) / state.numSteps;
    state.weight = randomSelectTwo() ? state.thinStroke : state.thickStroke;

    return {
      name: "Stepped Hexagons",
      state,
      render: () => {
        p.stroke(state.layerColor);
        p.noFill();
        p.strokeWeight(state.weight);
        p.push();
        //translate(width / 2, height / 2)
        p.rotate(state.angle / 2);
        for (let i = 1; i < state.numSteps + 1; i++) {
          hexagon(0, 0, state.centerOffset + i * state.singleStep);
        }
        p.pop();
      }
    };
  };

  ///----------------------

  const pointOnCircle = (posX, posY, radius, angle) => {
    const x = posX + radius * p.cos(angle);
    const y = posY + radius * p.sin(angle);
    return p.createVector(x, y);
  };

  const hexagon = (posX, posY, radius) => {
    const rotAngle = 360 / 6;
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      const thisVertex = pointOnCircle(posX, posY, radius, i * rotAngle);
      p.vertex(thisVertex.x, thisVertex.y);
    }
    p.endShape(p.CLOSE);
  };

  const randomSelectTwo = () => {
    const rando = p.random(1);
    return rando > 0.5 ? true : false;
  };

  const getRandomFromPalette = () => {
    const rando = p.floor(p.random(0, PALETTE.length));
    return PALETTE[rando];
  };

  const testLines = state => {
    state.numShapes = randomSelectTwo() ? state.sides : state.sides * 2;
    state.angle = 360 / state.numShapes;

    return {
      name: "testLines",
      state,
      render: () => {
        p.stroke(state.layerColor);
        p.noFill();
        p.strokeWeight(state.thickStroke);
        p.push();
        // translate(width / 2, height / 2) //**
        if (state.lines) {
          for (let i = 0; i < 360 - 0.1; i += state.angle) {
            p.line(0, 0, 0, CRYSTAL_SIZE / 2);
            p.rotate(state.angle);
          }
        }
        if (state.circle) {
          p.ellipse(0, 0, CRYSTAL_SIZE, CRYSTAL_SIZE);
        }
        p.pop();
      }
    };
  };

  const myTriangle = (center, radius, direction) => {
    if (direction) {
      p.beginShape();
      p.vertex(center + radius * p.cos(0), radius * p.sin(0));
      p.vertex(center + radius * p.cos(120), radius * p.sin(120));
      p.vertex(center + radius * p.cos(240), radius * p.sin(240));
      p.endShape(p.CLOSE);
    } else {
      p.beginShape();
      p.vertex(center + radius * p.cos(180), radius * p.sin(180));
      p.vertex(center + radius * p.cos(300), radius * p.sin(300));
      p.vertex(center + radius * p.cos(60), radius * p.sin(60));
      p.endShape(p.CLOSE);
    }
  };

  const layerConstructors = [
    {
      name: "Outline Shape",
      init: props =>
        outlineShape({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Centered Shape",
      init: props =>
        centeredShape({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Circles",
      init: props =>
        circles({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Simple Lines",
      init: props =>
        simpleLines({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Dotted Lines",
      init: props =>
        dottedLines({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Ring of Shapes",
      init: props =>
        ringOfShapes({
          ...props,
          ...setState(state)
        }),
      weight: 0.3
    },
    {
      name: "Stepped Hexagons",
      init: props =>
        steppedHexagons({
          ...props,
          ...setState(state)
        }),
      weight: 0.7
    },
    {
      name: "Test Lines",
      init: props =>
        testLines({
          lines: false,
          circle: false,
          ...props,
          ...setState(state)
        }),
      weight: 1
    }
  ];

  const makeCrystal = pos => {
    const layers = layerConstructors.map(lcon => {
      let picker = p.random(1);
      const draw = picker > lcon.weight;
      // const draw = lcon.name === 'Test Lines'
      return lcon.init({
        pos,
        draw
      });
    });
    return layers;
  };

  const drawCrystal = crystal => {
    crystal.forEach(layer => {
      if (layer.state.draw) {
        p.push();
        p.translate(layer.state.pos.x, layer.state.pos.y);
        layer.render();
        p.pop();
      }
    });
  };
  //---------------
  p.setup = function() {
    p.createCanvas(710, 400);
    p.pixelDensity(1);
    p.noLoop();
  };

  p.draw = function() {
    p.background(0);

    // Establish a range of values on the complex plane
    // A different range will allow us to "zoom" in or out on the fractal

    // It all starts with the width, try higher or lower values
    const w = 7;
    const h = (w * p.height) / p.width;

    // Start at negative half the width and height
    const xmin = -w / 2;
    const ymin = -h / 2;

    // Make sure we can write to the pixels[] array.
    // Only need to do this once since we don't do any other drawing.
    p.loadPixels();

    // Maximum number of iterations for each point on the complex plane
    const maxiterations = 100;

    // x goes from xmin to xmax
    const xmax = xmin + w;
    // y goes from ymin to ymax
    const ymax = ymin + h;

    // Calculate amount we increment x,y for each pixel
    const dx = (xmax - xmin) / p.width;
    const dy = (ymax - ymin) / p.height;

    // Start y
    let y = ymin;
    for (let j = 0; j < p.height; j++) {
      // Start x
      let x = xmin;
      for (let i = 0; i < p.width; i++) {
        // Now we test, as we iterate z = z^2 + cm does z tend towards infinity?
        let a = x;
        let b = y;
        let n = 0;
        while (n < maxiterations) {
          const aa = a * a;
          const bb = b * b;
          const twoab = 2.0 * a * b;
          a = aa - bb + x;
          b = twoab + y;
          // Infinty in our finite world is simple, let's just consider it 16
          if (p.dist(aa, bb, 0, 0) > 37) {
            break; // Bail
          }
          n++;
        }

        // We color each pixel based on how long it takes to get to infinity
        // If we never got there, let's pick the color black
        const pix = (i + j * p.width) * 4;
        const norm = p.map(n, 0, maxiterations, 0, 1);
        let bright = p.map(p.sqrt(norm), 0, 1, 0, 255);
        if (n == maxiterations) {
          bright = 10;
        } else {
          // Gosh, we could make fancy colors here if we wanted
          p.pixels[pix + 0] = bright;
          p.pixels[pix + 1] = bright;
          p.pixels[pix + 2] = bright;
          p.pixels[pix + 3] = 255;
        }
        x += dx;
      }
      y += dy;
    }
    p.updatePixels();

    // If it's time for a new point
  };
};
