import React, { Component } from 'react';
import Marker from './Marker.jsx';

class Markers extends React.Component {

  render(){
    const markers = this.props.stories.map((d) => {
      const markerTranslate = `translate(${d.x},${d.y})`;
      const isHighlight = (d.story_thread === this.props.focusThread);
      const isPrime = (d.key === this.props.focusStory);
      const isFade = this.props.focusOn && !isHighlight && !isPrime;
      return (
        <g className='marker-group'
        transform={markerTranslate}
        key={d.key}
        onClick={(e) => {this.props.handleMarkerClick(d)}}
        >
          <Marker
            data={d}
            // Signals for marker display state
            fade={isFade}
            highlight={isHighlight}
            prime={isPrime}
            />
        </g>
      )
    });

    return (<g className="marker-container">{markers}</g>);
  }

}

export default Markers;