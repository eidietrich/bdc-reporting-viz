import React, { Component } from 'react';
import Marker from './Marker.jsx';

class MarkerGroup extends React.Component {

  render(){
    const markers = this.props.stories.map((d) => {
      const markerTranslate = `translate(${d.x},${d.y})`;

      return (
        <g className='marker-group'
        transform={markerTranslate}
        key={d.key}
        onClick={(e) => {this.props.handleMarkerClick(d)}}
        onMouseEnter={(e) => {this.props.handleMouseEnter(d)}}
        onMouseLeave={(e) => {this.props.handleMouseLeave()}}
        >
          <Marker
            data={d}
            // Signals for marker display state
            markerClass={this.props.markerClass}
            shadow={this.props.shadow}
            />
        </g>
      )
    });

    return (<g className="marker-container">{markers}</g>);
  }

}

export default MarkerGroup;