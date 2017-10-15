import React from 'react';

function Marker(props){
  // const marker = <circle cx={0} cy={0} r={10} />
  // TODO: Set this up so it flows from this.markerWidth
  // OR: Really, it should be a layout-applied property
  // const markerWidth = 12;
  // let classNames = 'marker'
  // classNames += (props.data.type === 'growth-feature') ? ' secondary' : '';
  // classNames += props.fade ? ' fadeout': '';
  // classNames += props.highlight ? ' highlight' : '';
  // classNames += props.prime ? ' prime-highlight': '';

  // const fill = (props.data.markerWidth > 10) ? 'url(#Lines)' : '#bbb';
  const rect = (<rect
    className={props.markerClass}
    x={-props.data.markerWidth / 2}
    y={0}
    width={props.data.markerWidth}
    height={props.data.radius * 2}
    // fill={fill}
    fill={props.data.color}
    stroke={props.data.color}
  />);

  const shadow = props.shadow ? (<rect
    x={-props.data.markerWidth / 2 + 1}
    y={0 + 1}
    width={props.data.markerWidth}
    height={props.data.radius * 2}
    className='marker-shadow'
  />) : null;

  const marker = (
    <g>
      {shadow}{rect}
    </g>
  )
  return marker;
}

export default Marker;