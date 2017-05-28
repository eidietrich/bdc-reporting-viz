import React, { Component } from 'react';
import { timeFormat } from 'd3';

class TeaseContainer extends React.Component {
  constructor(props){
    super(props)
    this.formatDate = timeFormat('%a %b %d, %Y');
    this.defaultHeader = 'TODO';
  }

  render(){
    if (!this.props.threadStories) {
      return this.buildDefaultContents();
    } else {
      return this.buildBlurbContainer();
    }
  }

  componentDidMount(){
    this.containerNode = document.getElementsByClassName('tease-container')[0];
    this.highlightNode = document.getElementsByClassName('story-tease highlight')[0];
  }

  componentDidUpdate(){
    this.containerNode = document.getElementsByClassName('tease-container')[0];
    this.highlightNode = document.getElementsByClassName('story-tease highlight')[0];
    this.setScrollToHighlightBlurb();
  }

  buildBlurbContainer(){
    const threadHeader = this.props.focusThread || this.defaultHeader;
    const teases = this.props.threadStories.map(story =>{
      const isHighlight = (this.props.focusStoryKey === story.key);
      return isHighlight ? this.buildLongBlurb(story) : this.buildShortBlurb(story);
    });

    const header = (
      <div className='tease-header'>
        <h4>{threadHeader}</h4>
      </div>
    );
     const teaseDiv = (
      <div className='story-teases'>
          {teases}
      </div>
    );

    return (
      <div className='tease-container'
        onScroll={() => this.handleScroll()}
      >
        {teases}
      </div>
    )
  }

  buildShortBlurb(story){
    const date = this.formatDate(story.date);
    return (
      <div
        className='story-tease'
        key={story.key}
        // onMouseEnter={() => this.props.getStory(story.key)}
      >
        <h5>{story.type}</h5>
        <h4><a href={story.link} target='_blank'>{story.title}</a></h4>
        <h6>{`${story.creator} | ${date}`}</h6>
      </div>
    );
  }

  buildLongBlurb(story){
     const date = this.formatDate(story.date);
     const image = story.thumbnail ? (
      <div className='thumbnail-container'>
        <img src={story.thumbnail} />
      </div>
      ) : null;
     return (
      <div className='story-tease highlight' key={story.key}>
        <h5>{story.type}</h5>
        <div className='thumbnail-container' />
        <h4><a href={story.link} target='_blank'>{story.title}</a></h4>
        <h6>{`${story.creator} | ${date}`}</h6>
      </div>
    );
  }

  buildDefaultContents(){
    return (<div className='tease-container'>TODO: Default text for this</div>);
  }

  setScrollToHighlightBlurb(){
    // center tease container on highlighted blurb
    const scrollDepth = this.containerNode.scrollTop;
    const containerHeight = this.containerNode.offsetHeight;
    const highlightDepth = this.highlightNode.offsetTop;
    const highlightHeight = this.highlightNode.offsetHeight;
    console.log(highlightDepth, highlightHeight, containerHeight);
    const newScrollDepth =
      highlightDepth
      - 0.5 * containerHeight
      + 0.5 * highlightHeight;

    // effort to minimize scrolljacking here
    if (Math.abs(scrollDepth - newScrollDepth) > 100){
      this.setScrollHeight(newScrollDepth);
    }
  }

  setScrollHeight(height){
    // console.log('scroll to', height);
    this.containerNode.scrollTop = height;
  }

  handleScroll(){
    // Update focus story to match what's at top of container

    // scroll depth of container (0 = top)
    const scrollDepth = this.containerNode.scrollTop;
    const containerHeight = this.containerNode.offsetHeight;
    const highlightDepth = this.highlightNode.offsetTop;
    const highlightHeight = this.highlightNode.offsetHeight;

    const scrollUpThreshold =
      highlightDepth
      - 0.5 * containerHeight
      - 0.0 * highlightHeight;
    const scrollDownThreshold =
      highlightDepth
      - 0.5 * containerHeight
      + 1.0 * highlightHeight;

    if (scrollDepth < scrollUpThreshold) this.props.getPrevStory();
    if (scrollDepth > scrollDownThreshold) this.props.getNextStory();


  }
}

export default TeaseContainer;
