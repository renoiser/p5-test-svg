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
  ALL_CRYSTALS,
  FILL
} from "./constants";

export const doSketch = pe => {
  const p = pe;
  const state = {
    sides: SIDES,
    stepsOut: 8,
    thinStroke: 1,
    thickStroke: 3
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
        if (FILL) {
          p.fill(state.layerColor);
          p.noStroke();
        } else {
          p.stroke(state.layerColor);
          p.strokeWeight(state.weight || 1);
        }
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
        if (FILL) {
          p.fill(state.layerColor);
          p.noStroke();
        } else {
          p.stroke(state.layerColor);
          p.strokeWeight(state.weight || 1);
        }
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
        if (FILL) {
          p.stroke(state.layerColor);
          p.fill(state.fillColor);
          p.strokeWeight(state.weight);
          p.noStroke();
        } else {
          p.stroke(state.layerColor);
          p.strokeWeight(state.weight || 1);
        }

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
    const totalX = START + GRIDBOX * COLUMNS;
    const totalY = START + GRIDBOX * ROWS;
    p.createCanvas(totalX, totalY, p.SVG);

    p.noLoop();
    p.angleMode(p.DEGREES);
    p.rectMode(p.CENTER);
  };

  p.draw = function() {
    // p.background("teal");
    // p.fill(0);
    // p.rect(0, 0, 25, 25);
    // go to a point on the screen and draw a crystal
    // continue to do this until we run out of room
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const posX = START + x * GRIDBOX;
        const posY = START + y * GRIDBOX;
        const crystal = makeCrystal({ x: posX, y: posY }, p);
        console.log(crystal);
        ALL_CRYSTALS.push(crystal);
      }
    }

    ALL_CRYSTALS.forEach(crystal => {
      drawCrystal(crystal, p);
    });

    // If it's time for a new point
  };
};
