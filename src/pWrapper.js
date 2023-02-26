import React, { Component } from "react";
import p5 from "p5";

// export interface P5WrapperProps {
//   sketch: (p: p5) => void;
// }
// export interface P5WrapperState {
//   sketch: (p: p5) => void;
//   canvas: p5;
//   wrapper: HTMLElement;
// }

export default class P5Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sketch: props.sketch,
      canvas: null,
      wrapper: null
    };
  }
  // wrapper: HTMLElement;

  componentDidMount() {
    const canvas = new p5(this.state.sketch, this.wrapper);
    if (canvas.myCustomRedrawAccordingToNewPropsHandler) {
      canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
    }
    this.setState({
      canvas: canvas,
      wrapper: this.wrapper
    });
  }

  static getDerivedStateFromProps(props, state) {
    let canvas = state.canvas;
    if (state.sketch !== props.sketch) {
      state.wrapper.removeChild(state.wrapper.childNodes[0]);
      canvas.remove();
      canvas = new p5(props.sketch, state.wrapper);
      return {
        ...state,
        sketch: props.sketch,
        canvas: canvas
      };
    }
    if (canvas && canvas.myCustomRedrawAccordingToNewPropsHandler) {
      canvas.myCustomRedrawAccordingToNewPropsHandler(props);
    }
    return state;
  }

  componentWillUnmount() {
    this.state.canvas.remove();
  }

  render() {
    return (
      <div>
        {this.props.children({
          saveSVG: this.state.canvas
            ? this.state.canvas.saveSVG
            : () => {
                console.log("NO SVG SAVE", this.state.canvas);
              }
        })}
        <div ref={wrapper => (this.wrapper = wrapper)} />
      </div>
    );
  }
}
