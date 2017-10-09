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
    if (!this.props.displayStories) {
      // Case: No stories to render
      contents = <BlurbContainerDefaultContents />;
    } else if (this.props.isMobile){
      contents = <BlurbScrollerMobile
        // app data
        stories={this.props.displayStories}

        // display control
        focusThread={this.props.focusThread}
        focusStory={this.props.focusStory}
        formatDate={this.formatDate}

        // interaction handlers
        getPrevStory={this.props.getPrevStory}
        getNextStory={this.props.getNextStory}
      />;
    } else {
      contents = <BlurbScrollerDesktop
        // app data
        stories={this.props.displayStories}
        storyCategories={this.props.storyCategories}

        // display control
        focusThread={this.props.focusThread}
        focusStory={this.props.focusStory}
        formatDate={this.formatDate}

        // interaction handlers
        selectCategoryByKey={this.props.selectCategoryByKey}
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
