import React from 'react';
import { line, curveMonotoneY } from 'd3';

// Line generator
var curve = line()
    .x(function(d){ return d.x; })
    .y(function(d){ return d.y + d.radius; })
    .curve(curveMonotoneY);

function Connectors(props){
  if (props.stories === null) return null;

  const path = curve(props.stories);

  return (<g className="connector-container">
      <path d={path} className='story-thread'/>
    </g>);
}

export default Connectors;