import React, { Component } from 'react';

var scrollTarget = 100; //px from top of container

class BlurbScrollerDesktop extends React.Component {
  render(){
    const focusCategoryKey = this.props.focusCategory ? this.props.focusCategory.key : null;
    const header = this.props.focusThread ? (
      <div className='blurb-scroller-header'>
        {this.props.focusCategory.catLabel + ': ' + this.props.focusCategory.label}
      </div>
      ) : null;

    const teases = this.props.stories.map(story =>{
      const isHighlight = (this.props.focusStory && this.props.focusStory.key === story.key);

      return <BlurbDesktop
        story={story}
        storyCategories={this.props.storyCategories}
        isHighlight={isHighlight}
        formatDate={this.props.formatDate}
        key={story.key}
        focusCategory={this.props.focusCategory}

        // interaction handler
        selectCategoryByKey={this.props.selectCategoryByKey}
      />
    });

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

  const tags = props.story.fullCategories
    .map(category => {
      const matchCategory = props.storyCategories.filter(cat => category.key === cat.key)[0];
      const catLabel = matchCategory ? matchCategory.label : null;
      const isFocusCat = (props.focusCategory && category.key === props.focusCategory.key);
      return (<span
        key={category.key}
        style={{color: category.tagColor}}
        className={isFocusCat ? 'highlight' : null}
        onClick={()=> props.selectCategoryByKey(category.key)}
        >
          {catLabel}
        </span>
      );
    })
    .reduce((acc, x) => acc === null ? [x] : [acc, ' ', x], null);

  return (
    <div className={className}>
      <h5 style={{color: props.story.color}}>
        {props.story.type}
      </h5>
      <h4><a href={props.story.link} target='_blank'>
        {props.story.title}
      </a></h4>
      <div className="tag-container">{tags}</div>
      <h6>{`${props.story.creator} | ${date}`}</h6>
    </div>
  );
}

function BlurbContainerMarkerDesktop(props){
  return (
    <div className="blurb-scroller-marker">
      <svg>
        <g transform={'translate(0,' + (scrollTarget - 5) + ')'}>
            <path d={"M0 0 l 10 10 l -10 10"} />
        </g>
      </svg>
    </div>
  )
}



export default BlurbScrollerDesktop;