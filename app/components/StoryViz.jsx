import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';

import {scaleTime, scaleLinear, timeMonths, timeMonth,
  timeFormat, dateScale, axisTop, axisBottom, max} from 'd3';

import Tooltip from './Tooltip.jsx';
import Grid from './Grid.jsx';
import Connectors from './Connectors.jsx';
import MarkerGroup from './MarkerGroup.jsx';

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

class StoryViz extends React.Component {
  constructor(props){
    super(props)
    this.margin = {
      top: 50, left: 20,
      bottom: 20, right: 20
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
      // const tooltip = this.buildTooltip();
      return <div>{svg}</div>;
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

  buildSvg(){
    const plotTranslate = `translate(${this.margin.left},${this.margin.top})`;

    const category = this.props.storyCategories.filter(cat => cat.key === this.props.focusThreadKey)[0];

    const grid = <Grid scale={this.dateScale} height={this.plotHeight}/>

    const connectors = category && category.isThreaded ? <Connectors stories={this.props.threadStories}/> : null;

    const storiesSorted = {
      normal: this.props.stories.filter(() => !this.props.focusMode),
      primeHighlight: this.getPrimeStories(),
      highlight: this.getHighlightStories(),
      faded: this.getFadedStories(),
    }
    const normal = (
      <MarkerGroup
        stories={storiesSorted.normal}
        markerClass='marker no-focus'
        shadow

        handleMarkerClick={this.props.handleMarkerClick}
        handleMouseEnter={this.props.handleMouseEnter}
        handleMouseLeave={this.props.handleMouseLeave}
      />);

    const primeHighlight = (
      <MarkerGroup
        stories={storiesSorted.primeHighlight}
        markerClass='marker prime-highlight'
        shadow

        handleMarkerClick={this.props.handleMarkerClick}
        handleMouseEnter={this.props.handleMouseEnter}
        handleMouseLeave={this.props.handleMouseLeave}
      />);

    const highlight = (
      <MarkerGroup
        stories={storiesSorted.highlight}
        markerClass='marker highlight'
        shadow

        handleMarkerClick={this.props.handleMarkerClick}
        handleMouseEnter={this.props.handleMouseEnter}
        handleMouseLeave={this.props.handleMouseLeave}
      />
    );
    const faded = (
      <MarkerGroup
        stories={storiesSorted.faded}
        markerClass='marker fadeout'


        handleMarkerClick={this.props.handleMarkerClick}
        handleMouseEnter={this.props.handleMouseEnter}
        handleMouseLeave={this.props.handleMouseLeave}
      />
    );

    const svg = (
      <svg width={this.width} height={this.height} >
        <g className="plot" transform={plotTranslate}>
          {grid}
          {faded}
          {connectors}
          {normal}
          {highlight}{primeHighlight}
        </g>
      </svg>
    );
    return svg;
  }

  getPrimeStories(){
    if (!this.props.focusMode) return [];
    const primeStories = this.props.stories.filter(d => {
      return d.key === this.props.focusStory.key
    });
    // Should only be one
    return primeStories;
  }

  getHighlightStories(){
    if (!this.props.focusMode) return [];
    const highlightStories = this.props.stories.filter(d => {
      const inHighlightCat = d.categories.indexOf(this.props.focusThreadKey) >= 0;
      const isPrime = d.key === this.props.focusStory.key;
      return  inHighlightCat && !isPrime;
    });
    return highlightStories;
  }

  getFadedStories(){
    if (!this.props.focusMode) return [];
    const fadedStories = this.props.stories.filter(d => {
      const inHighlightCat = d.categories.indexOf(this.props.focusThreadKey) >= 0;
      const isPrime = d.key === this.props.focusStory.key;
      return !inHighlightCat && !isPrime;
    });
    return fadedStories;
  }

  layout(stories){
    const that = this;
    // add stories.x, stories.y

    const spacing = 2; // px
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
    const months = Object.keys(heightCounter)
    const heights = months.map((key) => heightCounter[key])
    const heightMax = Math.max.apply(null, heights);
    const heightScale = scaleLinear()
      .domain([0, heightMax])
      .range([0, this.plotHeight]);
    stories.forEach((d) => {
      d.y = heightScale(d.y);
      d.radius = heightScale(d.radius);
    });

    // Shift down to center (hacky)
    months.forEach((key) => {
      const height = heightCounter[key];
      const yShift = heightScale(heightMax - height) / 2;
      stories
        .filter(d => timeFormat('%-b%-Y')(d.month) === key)
        .forEach(d => d.y += yShift);
    });
    return stories;
  }
}

export default StoryViz;






