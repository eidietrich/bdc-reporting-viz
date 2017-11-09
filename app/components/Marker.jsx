import React from 'react';

class Marker extends React.Component {
  render(){
    const props = this.props;
    // const circle = (<circle
    //   className={props.markerClass}
    //   cx={-props.data.markerWidth / 2}
    //   cy={0}
    //   r={props.data.radius}
    //   fill={props.data.color}
    //   stroke={props.data.color}
    // />);

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

    // const shadow = props.shadow ? (<rect
    //   x={-props.data.markerWidth / 2 + 2}
    //   y={0 + 2}
    //   width={props.data.markerWidth}
    //   height={props.data.radius * 2}
    //   className='marker-shadow'
    // />) : null;

    const marker = (
      <g>
        {rect}
      </g>
    )
    return marker;
  }
}

export default Marker;