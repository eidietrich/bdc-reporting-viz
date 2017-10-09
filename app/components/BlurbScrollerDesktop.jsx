import React, { Component } from 'react';

var scrollTarget = 100; //px from top of container

class BlurbScrollerDesktop extends React.Component {
  render(){
    const teases = this.props.stories.map(story =>{
      const isHighlight = (this.props.focusStoryKey === story.key);

      return <BlurbDesktop
        story={story}
        storyCategories={this.props.storyCategories}
        isHighlight={isHighlight}
        formatDate={this.props.formatDate}
        key={story.key}
        selectCategoryByKey={this.props.selectCategoryByKey}
      />
    });
    const curCategory = this.props.storyCategories.filter(cat => cat.key === this.props.focusThread)[0];
    const header = this.props.focusThread ? (<div className='blurb-scroller-header'>{curCategory.label}</div>) : null;
    return (
      <div className='blurb-scroller-container'>
        <BlurbContainerMarkerDesktop />
        {header}
        <div className='blurb-scroller desktop'
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
    const containerHeight = this.containerNode.offsetHeight;
    const highlightBlurbHeight = this.highlightNode.offsetHeight;

    // dims here relative to top of containerNode
    const highlightBlurbTop = this.highlightNode.offsetTop;
    const highlightBlurbBottom = highlightBlurbTop + highlightBlurbHeight;
    const highlightBlurbMidpoint = highlightBlurbTop + 0.5 * highlightBlurbHeight;

    /* Definitions
    NB: scroll depth is height of element beyond top of container
    - highlightScroll Depth - scroll depth to set container to when new node is selected
    - maxScroll - scroll depth that triggers highlight shift to next node
    - minScroll - scroll depth that triggers highlight shift to previous node
    */

    this.highlightScrollDepth = highlightBlurbMidpoint - scrollTarget;
    this.maxScroll = highlightBlurbBottom - scrollTarget;
    this.minScroll = highlightBlurbTop - scrollTarget;

  }

  setScrollToHighlightBlurb(){
    // buffer here to minimize scrolljacking
    const buffer = 100;
    const distanceBeyondBuffer = (Math.abs(this.containerNode.scrollTop - this.highlightScrollDepth) > buffer);
    if (distanceBeyondBuffer) {
      this.containerNode.scrollTop = this.highlightScrollDepth;
    }
  }

  /* Desired scrolling behavior

  At each scroll event, check whether the top of the currently highlighted blurb is below the scroll depth (then move to previous blurb) or whether the bottom of the current blurb is above the scroll depth (move to next)

  */

  handleScroll(){
    const scrollDepth = this.containerNode.scrollTop;
    if (scrollDepth < this.minScroll) {
      this.scrollHandling = true;
      this.props.getPrevStory();
    } else if (scrollDepth > this.maxScroll) {
      this.scrollHandling = true;
      this.props.getNextStory();
    }
  }
}

function BlurbDesktop(props){
  const className = props.isHighlight ? 'blurb desktop highlight' : 'blurb desktop';
  const date = props.formatDate(props.story.date);
  // const hideImage = !(props.isHighlight && props.story.thumbnail)
  // const hideImage = !(props.story.thumbnail)
  // const image = hideImage ? null :
  //   (<div className='thumbnail-container'>
  //     <img src={props.story.thumbnail} />
  //   </div>);
  const image = null;

  const tags = props.story.categories
    .map(key => {
      const matchCategory = props.storyCategories.filter(cat => key === cat.key)[0]
      return (<span
        key={key}
        onClick={()=> props.selectCategoryByKey(key)}
        >
          {matchCategory.label}
        </span>
      );
    })
    .reduce((acc, x) => acc === null ? [x] : [acc, ' ', x], null);

  return (
    <div className={className}>
      <h5>{props.story.type}</h5>
      {image}
      <h4><a href={props.story.link} target='_blank'>
        {props.story.title}
      </a></h4>
      <p className="tag-container">{tags}</p>
      <h6>{`${props.story.creator} | ${date}`}</h6>
    </div>
  );
}

function BlurbContainerMarkerDesktop(props){
  return (
    <div className="blurb-container-marker">
      <svg style={{'position': 'absolute'}}>
        <rect x={0} y={scrollTarget - 2} width={10} height={4}/>
      </svg>
    </div>
  )
}

export default BlurbScrollerDesktop;