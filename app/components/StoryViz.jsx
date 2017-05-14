import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import {scaleTime, scaleLinear, timeMonths, timeMonth,
  timeFormat, dateScale, axisTop, axisBottom, max} from 'd3';

import Grid from './Grid.jsx';
import Connectors from './Connectors.jsx';
import Markers from './Markers.jsx';

class StoryViz extends React.Component {
  constructor(props){
    super(props)
    this.margin = {
      top: 50, left: 20,
      bottom: 50, right: 30
    };
    this.startDate = new Date('Jun 1, 2015');
    this.endDate = new Date('May 31, 2017');
    this.dateScale = scaleTime()
      .domain([this.startDate, this.endDate])
  }

  render(){
    // console.log(this.props.stories);

    return (
      <div className='viz-container'>
        <ContainerDimensions>
          { ({ width, height }) => {
              this.setDimensions(width, height);
              return this.buildSvg();
            }
          }
        </ContainerDimensions>
      </div>
    )
  }

  setDimensions(width, height){
    // console.log('dims', width, height);
    this.width = width;
    this.height = height;
    this.plotWidth = this.width - this.margin.left - this.margin.right;
    this.plotHeight = this.height - this.margin.top - this.margin.bottom;

    // Calc marker width
    const markerMargin = 3;
    const bins = timeMonths(this.startDate, this.endDate).length;
    this.markerWidth = Math.floor(this.plotWidth / bins) - markerMargin;

    // pin dateScale to plot dims
    this.dateScale.range([0, this.plotWidth]);

  }

  buildSvg(){
    const svg = (
      <svg width={this.width}
        height={this.height}>
      {this.draw()}
      </svg>
    )
    return svg;
  }

  draw(){
    // assumes setDims has been called higher in stack
    const plotTranslate = `translate(${this.margin.left},${this.margin.top})`;

    const stories = this.layout(this.props.stories);

    return (
      <g className="plot"
        transform={plotTranslate}>
        <Grid scale={this.dateScale} height={this.plotHeight}/>
        <Connectors />
        <Markers stories={stories} />

      </g>
    )
  }

  layout(stories){
    const that = this;
    // add stories.x, stories.y

    // Group by month
    stories.sort(function(a,b){
      return a.date - b.date;
    });

    const spacing = 2.5; // px
    let heightCounter = {}

    stories.forEach((d) => {
      d.month = timeMonth(d.date);
      d.x = this.dateScale(d.month);
      var key = timeFormat('%-b%-Y')(d.month);

      if (!(heightCounter[key] >= 0)){
        heightCounter[key] = spacing;
      }
      d.y = heightCounter[key];
      heightCounter[key] += (d.radius*2 + spacing);
    });

    // Scale to plot height
    var heights = Object.keys(heightCounter).map((key) => heightCounter[key])
    var heightMax = Math.max.apply(null, heights);
    const heightScale = scaleLinear()
      .domain([0, heightMax])
      .range([0, this.plotHeight]);
    stories.forEach((d) => {
      d.y = heightScale(d.y);
      d.radius = heightScale(d.radius);
    });

    return stories;
  }
}

export default StoryViz;






