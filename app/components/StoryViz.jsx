import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';

import {scaleTime, scaleLinear, timeMonths, timeMonth,
  timeFormat, dateScale, axisTop, axisBottom, max} from 'd3';

import Tooltip from './Tooltip.jsx';
import Grid from './Grid.jsx';
import Connectors from './Connectors.jsx';
import Markers from './Markers.jsx';

/* Interactivity behavior

Three key aspects of state (passed down from App):
- in focus mode (props.focusMode, true/false)
  - false: no fade, tooltip on hover any story
  - true: fade all stories except focus thread, tooltip render on focus story, change focus story on hover/click
- focus story -
  - focus mode false - NA
  - focus mode true - attach tooltip, highlight in teaseContainer
- focus thread - string together stories if non-null
  - focus mode false - NA
  - focus mode true - string together stories if non-null


*/

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
      .domain([this.startDate, this.endDate]);
  }

  render(){
    // console.log(this.props.stories);

    const renderWithDims = ({width, height}) => {
      this.setDimensions(width, height);
      this.stories = this.layout(this.props.stories);
      const svg = this.buildSvg();
      const tooltip = this.buildTooltip();
      return <div>{svg}{tooltip}</div>;
    }

    return (
      <div className='viz-container' >
        <ContainerDimensions>
          {renderWithDims}
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

  buildTooltip(){
    const tipStory = this.props.tooltipStory;
    const tooltip = !tipStory ? null : (
      <Tooltip
        x={tipStory.x + this.markerWidth / 2 + this.margin.left}
        y={tipStory.y + this.margin.top}
        data={tipStory}
      />
    );
    return tooltip;
  }

  buildSvg(){
    const plotTranslate = `translate(${this.margin.left},${this.margin.top})`;
    const svg = (
      <svg width={this.width} height={this.height} >
        <g className="plot" transform={plotTranslate}>
          <Grid scale={this.dateScale} height={this.plotHeight}/>
          <Connectors stories={this.props.threadStories}/>
          <Markers
            stories={this.stories}
            focusMode={this.props.focusMode}
            focusStoryKey={this.props.focusStoryKey}
            focusThread={this.props.focusThread}

            handleMarkerClick={this.props.handleMarkerClick}
            handleMouseEnter={this.props.handleMouseEnter}
            handleMouseLeave={this.props.handleMouseLeave}
          />
        </g>
      </svg>
    )
    return svg;
  }

  layout(stories){
    const that = this;
    // add stories.x, stories.y

    const spacing = 2.5; // px
    let heightCounter = {}

    stories.forEach((d) => {
      d.markerWidth = this.markerWidth;
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






