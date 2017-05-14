import React from 'react';
import AxisTop from './AxisTop';

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
    line tick label
    tickLength={5}/>;
  const gridLines = <AxisTop
    scale={props.scale}
    tick
    tickLength={-props.height}/>;

  return (<g className="grid-container">
      {xAxis}{yAxis}{topAxis}{gridLines}
    </g>);
}

export default Grid;