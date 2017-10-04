import React, { Component } from 'react';

class BlurbScrollerMobile extends React.Component {
  render(){
    this.scrollTarget = 120;
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
      <div className='blurb-scroller-container'>
        <BlurbContainerMarkerMobile
          scrollTarget={this.scrollTarget}
        />
        <div className='blurb-scroller mobile'
        onScroll={() => this.handleScroll()}
        >
          {teases}
        </div>
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
    const highlightBlurbWidth = this.highlightNode.offsetWidth;
    const highlightBlurbLeft = this.highlightNode.offsetLeft;
    const highlightBlurbMidpoint = highlightBlurbLeft + 0.5 * highlightBlurbWidth;
    const highlightBlurbRight = highlightBlurbLeft + highlightBlurbWidth;

    // // Set highlight midpoint to container midpoint
    // this.highlightScrollDepth = highlightMidpoint - 0.5 *containerWidth;
    // // highlight right aligns with container midpoint
    // this.maxScroll = highlightLeft + highlightWidth - 0.5 * containerWidth;
    // // highlight left aligns with container midpoint
    // this.minScroll = highlightLeft - 0.5 * containerWidth;

    this.highlightScrollDepth = highlightBlurbMidpoint - this.scrollTarget;
    this.maxScroll = highlightBlurbRight - this.scrollTarget;
    this.minScroll = highlightBlurbLeft - this.scrollTarget;

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

function BlurbContainerMarkerMobile(props){
  return (
    <div className="blurb-container-marker">
      <svg style={{'position': 'absolute'}}>
        <rect x={props.scrollTarget - 2} y={0} width={4} height={5}/>
      </svg>
    </div>
  )
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

export default BlurbScrollerMobile;