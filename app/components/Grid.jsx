import React from 'react';
import AxisTop from './AxisTop';
import { timeMonth } from 'd3';

function Grid(props){
  const xAxis = (
    <text className="axis-label" transform="translate(0,-25)">
      Month of publication
    </text>
  );
  const yAxis = (
    <text className="axis-label"
    transform="translate(7,84), rotate(-90)">
      &larr; Later in month
    </text>
  );
  const topAxis = <AxisTop
    scale={props.scale}
    interval={3}
    tick label
    tickLength={5}/>;
  const minorGridLines = <AxisTop
    scale={props.scale}
    interval={1}
    tick
    tickLength={-props.height}
    tickClass='grid-minor'/>;
  const majorGridLines = <AxisTop
    scale={props.scale}
    interval={3}
    tick
    tickLength={-props.height}
    tickClass='grid-major'/>;

  return (<g className="grid-container">
      {xAxis}{yAxis}{topAxis}{minorGridLines}{majorGridLines}
    </g>);
}

export default Grid;