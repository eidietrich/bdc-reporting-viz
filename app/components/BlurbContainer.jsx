import React, { Component } from 'react';
import BlurbScrollerDesktop from './BlurbScrollerDesktop';
import BlurbScrollerMobile from './BlurbScrollerMobile';
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
      contents = <BlurbContainerDefaultContents />;
    } else if (this.props.isMobile){
      contents = <BlurbScrollerMobile
        stories={this.props.threadStories}
        focusThread={this.props.focusThread}
        focusStoryKey={this.props.focusStoryKey}
        formatDate={this.formatDate}
        getPrevStory={this.props.getPrevStory}
        getNextStory={this.props.getNextStory}
      />;
    } else {
      contents = <BlurbScrollerDesktop
        stories={this.props.threadStories}
        focusThread={this.props.focusThread}
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


function BlurbContainerDefaultContents(props){
  return (
    <div>TODO, write this.</div>
  );
}





export default BlurbContainer;
