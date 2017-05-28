import React from 'react';

function Marker(props){
  // const marker = <circle cx={0} cy={0} r={10} />
  // TODO: Set this up so it flows from this.markerWidth
  // OR: Really, it should be a layout-applied property
  // const markerWidth = 12;
  let classNames = 'marker'
  classNames += (props.data.type === 'growth-feature') ? ' secondary' : '';
  classNames += props.fade ? ' fadeout': '';
  classNames += props.highlight ? ' highlight' : '';
  classNames += props.prime ? ' prime-highlight': '';
  const marker = <rect
    className={classNames}
    x={-props.data.markerWidth / 2}
    y={0}
    width={props.data.markerWidth}
    height={props.data.radius * 2}
    // fill={props.data.color}
  />
  return marker;
}

export default Marker;