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

const fill = '#a6761d'
const background = '#cccccc'
const lines = (
  <g className='markerPattern' style={{'stroke': fill}}>
    <rect className='background' style={{'stroke': 'none', 'fill': background}} width="20" height="40"/>
    <rect style={{'stroke': 'none', 'fill': fill}}  x="2" y="2" width="16" height="8"/>
    <line x1="9" y1="2.5" x2="18" y2="2.5"/>
    <line x1="9" y1="4.5" x2="18" y2="4.5"/>
    <line x1="9" y1="6.5" x2="18" y2="6.5"/>
    <line x1="2" y1="8.5" x2="18" y2="8.5"/>
    <line x1="2" y1="10.5" x2="18" y2="10.5"/>
    <line x1="2" y1="12.5" x2="18" y2="12.5"/>
    <line x1="2" y1="14.5" x2="18" y2="14.5"/>
    <line x1="2" y1="16.5" x2="18" y2="16.5"/>
    <line x1="2" y1="18.5" x2="18" y2="18.5"/>
    <line x1="2" y1="20.5" x2="18" y2="20.5"/>
    <line x1="2" y1="24.5" x2="18" y2="24.5"/>
    <line x1="2" y1="22.5" x2="18" y2="22.5"/>
    <line x1="2" y1="26.5" x2="14" y2="26.5"/>
    <line x1="2" y1="28.5" x2="18" y2="28.5"/>
    <line x1="2" y1="32.5" x2="18" y2="32.5"/>
    <line x1="2" y1="30.5" x2="18" y2="30.5"/>
    <line x1="2" y1="34.5" x2="18" y2="34.5"/>
    <line x1="2" y1="36.5" x2="7" y2="36.5"/>
  </g>
);

class StoryViz extends React.Component {
  constructor(props){
    super(props)
    this.margin = {
      top: 50, left: 20,
      bottom: 50, right: 30
    };

    this.startDate = new Date('Jul 1, 2015');
    this.endDate = new Date('Jun 1, 2017');
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

    const category = this.props.storyCategories.filter(cat => cat.key === this.props.focusThread)[0];

    const grid = <Grid scale={this.dateScale} height={this.plotHeight}/>

    const connectors = category && category.isThreaded ? <Connectors stories={this.props.threadStories}/> : null;
    const markers = (
      <Markers
        stories={this.stories}
        focusMode={this.props.focusMode}
        focusStory={this.props.focusStory}
        focusThread={this.props.focusThread}

        handleMarkerClick={this.props.handleMarkerClick}
        handleMouseEnter={this.props.handleMouseEnter}
        handleMouseLeave={this.props.handleMouseLeave}
      />);

    const svg = (
      <svg width={this.width} height={this.height} >
        <defs>
          <pattern id="Lines" width="90%" height="30">
            {lines}
          </pattern>
        </defs>

        <g className="plot" transform={plotTranslate}>
          {grid}
          {connectors}
          {markers}
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






