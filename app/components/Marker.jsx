import React from 'react';

function Marker(props){
  // const marker = <circle cx={0} cy={0} r={10} />
  // TODO: Set this up so it flows from this.markerWidth
  // OR: Really, it should be a layout-applied property
  const markerWidth = 12;
  const marker = <rect
    className='marker'
    x={-markerWidth / 2}
    y={0}
    width={markerWidth}
    height={props.data.radius * 2}
    fill={props.data.color}
  />
  return marker;
}

export default Marker;