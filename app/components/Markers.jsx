import React from 'react';
import Marker from './Marker.jsx';

function Markers(props){
  console.log(props.stories);

  const markers = props.stories.map((d) => {
    const markerTranslate = `translate(${d.x},${d.y})`;
    return (
      <g className='marker-group'
      transform={markerTranslate}
      key={d.key}>
        <Marker data={d} />
      </g>
    )
  });

  return (<g className="marker-container">{markers}</g>);
}

export default Markers;