import React, { Component } from 'react';
import { timeFormat } from 'd3';

class BlurbContainer extends React.Component {
  constructor(props){
    super(props)
    this.formatDate = timeFormat('%a %b %d, %Y');
    this.defaultHeader = 'TODO';
  }

  render(){
    const className = this.props.isMobile ? 'blurb-container mobile' : 'blurb-container desktop';
    let contents = null;
    if (!this.props.threadStories) {
      // Case: No stories to render
      contents = <DefaultContents />;
    } else if (this.props.isMobile){
      contents = <BlurbScrollerMobile
        stories={this.props.threadStories}
        focusStoryKey={this.props.focusStoryKey}
        formatDate={this.formatDate}
        getPrevStory={this.props.getPrevStory}
        getNextStory={this.props.getNextStory}
      />;
    } else {
      contents = <BlurbScrollerDesktop
        stories={this.props.threadStories}
        focusStoryKey={this.props.focusStoryKey}
        formatDate={this.formatDate}
        getPrevStory={this.props.getPrevStory}
        getNextStory={this.props.getNextStory}
      />;
    }
    return (
      <div className={className}>
        {contents}
      </div>
    );
  }
}

class BlurbScrollerMobile extends React.Component {
  render(){
    const teases = this.props.stories.map(story =>{
      const isHighlight = (this.props.focusStoryKey === story.key);
      return <BlurbMobile
        story={story}
        isHighlight={isHighlight}
        formatDate={this.props.formatDate}
        key={story.key}
      />
    });
    return (
      <div className='blurb-scroller mobile'
        onScroll={() => this.handleScroll()}
      >
        {teases}
      </div>
    );
  }

  componentDidMount(){
    this.containerNode = document.getElementsByClassName('blurb-scroller')[0];
    this.setScrollDims();
    this.setScrollToHighlightBlurb();
    this.scrollHandling = false;
  }

  componentDidUpdate(){
    /* scrollHandling is flag to prevent scrolljacking when update is triggered by highlight shift from scroll event */
    this.setScrollDims();
    if (!this.scrollHandling) {
      this.setScrollToHighlightBlurb();
    }
    this.scrollHandling = false;
  }

  setScrollDims(){
    this.highlightNode = document.getElementsByClassName('blurb highlight')[0];

    const containerWidth = this.containerNode.offsetWidth;
    const highlightLeft = this.highlightNode.offsetLeft;
    const highlightWidth = this.highlightNode.offsetWidth;
    const highlightMidpoint = highlightLeft + 0.5 * highlightWidth;

    // Set highlight midpoint to container midpoint
    this.highlightScrollDepth = highlightMidpoint - 0.5 *containerWidth;
    // highlight right aligns with container midpoint
    this.maxScroll = highlightLeft + highlightWidth - 0.5 * containerWidth;
    // highlight left aligns with container midpoint
    this.minScroll = highlightLeft - 0.5 * containerWidth;

  }

  setScrollToHighlightBlurb(){
    this.containerNode.scrollLeft = this.highlightScrollDepth;
  }

  handleScroll(){
    const scrollDepth = this.containerNode.scrollLeft;
    if (scrollDepth < this.minScroll) {
      this.scrollHandling = true;
      this.props.getPrevStory();
    }
    if (scrollDepth > this.maxScroll) {
      this.scrollHandling = true;
      this.props.getNextStory();
    }
  }
}

class BlurbScrollerDesktop extends React.Component {
  render(){
    const teases = this.props.stories.map(story =>{
      const isHighlight = (this.props.focusStoryKey === story.key);
      return <BlurbDesktop
        story={story}
        isHighlight={isHighlight}
        formatDate={this.props.formatDate}
        key={story.key}
      />
    });
    return (
      <div className='blurb-scroller desktop'
        onScroll={() => this.handleScroll()}
      >
        {teases}
      </div>
    );
  }

  componentDidMount(){
    this.containerNode = document.getElementsByClassName('blurb-scroller')[0];
    this.setScrollDims();
    this.setScrollToHighlightBlurb();
    this.scrollHandling = false;
  }

  componentDidUpdate(){
    /* scrollHandling is flag to prevent scrolljacking when update is triggered by highlight shift from scroll event */

    this.setScrollDims();
    if (!this.scrollHandling) {
      this.setScrollToHighlightBlurb();
    }
    this.scrollHandling = false;
  }

  setScrollDims(){
    this.highlightNode = document.getElementsByClassName('blurb highlight')[0];

    const containerHeight = this.containerNode.offsetHeight;
    const highlightTop = this.highlightNode.offsetTop;
    const highlightHeight = this.highlightNode.offsetHeight;
    const highlightMidpoint = highlightTop + 0.5 * highlightHeight;

    // put element midpoint at container midpoint
    this.highlightScrollDepth = highlightMidpoint - 0.5 *containerHeight;
    // when highlight box top aligns with container top
    this.maxScroll = highlightTop;
    // when highlight box bottom aligns with container bottom
    this.minScroll = highlightTop + highlightHeight - containerHeight;
  }

  setScrollToHighlightBlurb(){
    // buffer here to minimize scrolljacking
    const buffer = 100;
    const distanceBeyondBuffer = (Math.abs(this.containerNode.scrollTop - this.highlightScrollDepth) > buffer);
    if (distanceBeyondBuffer) {
      this.containerNode.scrollTop = this.highlightScrollDepth;
    }
  }

  handleScroll(){
    const scrollDepth = this.containerNode.scrollTop;
    if (scrollDepth < this.minScroll) {
      this.scrollHandling = true;
      this.props.getPrevStory();
    }
    if (scrollDepth > this.maxScroll) {
      this.scrollHandling = true;
      this.props.getNextStory();
    }
  }
}

function DefaultContents(props){
  return (
    <div>TODO, write this</div>
  );
}

function BlurbMobile(props){
  const date = props.formatDate(props.story.date);
  const className = props.isHighlight ? 'blurb mobile highlight' : 'blurb mobile';
  return (
    <div className={className}>
      <h5>{props.story.type}</h5>
      <h4><a href={props.story.link} target='_blank'>
        {props.story.title}
      </a></h4>
      <h6>{`${props.story.creator} | ${date}`}</h6>
    </div>
  );
}

function BlurbDesktop(props){
  const className = props.isHighlight ? 'blurb desktop highlight' : 'blurb desktop';
  const date = props.formatDate(props.story.date);
  const hideImage = !(props.isHighlight && props.story.thumbnail)
  // const hideImage = !(props.story.thumbnail)
  const image = hideImage ? null :
    (<div className='thumbnail-container'>
      <img src={props.story.thumbnail} />
    </div>);
  return (
    <div className={className}>
      <h5>{props.story.type}</h5>
      {image}
      <h4><a href={props.story.link} target='_blank'>
        {props.story.title}
      </a></h4>
      <h6>{`${props.story.creator} | ${date}`}</h6>
    </div>
  );
}

export default BlurbContainer;
