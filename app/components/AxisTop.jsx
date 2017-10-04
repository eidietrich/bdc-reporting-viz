import React from 'react';
import {timeFormat, timeMonth} from 'd3';

function AxisTop(props){
  // This is going to be hard
  const tickLength = props.tickLength;
  const ticks = props.scale.ticks(timeMonth.every(props.interval));
  const bounds = props.scale.domain();

  let axisLine = <line
    x1={props.scale(bounds[0])}
    x2={props.scale(bounds[1])}
    y1={0}
    y2={0}
    stroke={'black'}
  />;
  let tickLines = ticks.map((tick, i) => {
    const x = props.scale(tick);
    return <line x1={x} x2={x}
      y1={0} y2={-tickLength}
      key={String(i)}
      className={props.tickClass}/>
  });
  let tickLabels = ticks.map((tick, i) => {
    const x = props.scale(tick);
    const label = timeFormat('%b%y')(tick);
    return (<text textAnchor='middle' className='axis-label'
      key={String(i)}
      x={x} y={-tickLength - 3} fill='black'>
      {label}
      </text>)
  });

  // conditionals
  axisLine = props.line ? axisLine : null;
  tickLines = props.tick ? tickLines : null;
  tickLabels = props.label ? tickLabels : null;

  return (<g>{axisLine}{tickLines}{tickLabels}</g>);
}

export default AxisTop;