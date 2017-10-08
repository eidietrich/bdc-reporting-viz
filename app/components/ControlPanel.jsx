import React, { Component } from 'react';

import TypeaheadByHeadline from './TypeaheadByHeadline.jsx';
import TopicSelector from './TopicSelector.jsx';

class ControlPanel extends React.Component {
  render(){
    return (
      <div className='control-panel'>
        <TopicSelector
          storyCategories={this.props.storyCategories}
          getThread={this.props.getThread}
          focusThreadKey={this.props.focusThreadKey}
          getPrevThread={this.props.getPrevThread}
          getNextThread={this.props.getNextThread}
          resetFocus={this.props.resetFocus}
        />
        <TypeaheadByHeadline
          options={this.makeHeadlineOptions()}
          focusStoryKey={this.props.focusStoryKey}
          getStory={this.props.getStory}
        />
      </div>
    )
  }

  makeHeadlineOptions(){
    const options = this.props.stories.map(function(d){
      return { key: d.key, label: d.title}
    });
    return options;
  }
}

export default ControlPanel;