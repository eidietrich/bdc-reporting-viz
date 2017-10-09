import React, { Component } from 'react';

import TypeaheadByHeadline from './TypeaheadByHeadline.jsx';
import TopicSelector from './TopicSelector.jsx';

class ControlPanel extends React.Component {
  render(){
    return (
      <div className='control-panel'>


        <TopicSelector
          storyCategories={this.props.storyCategories}
          selectCategoryByKey={this.props.selectCategoryByKey}
          focusThreadKey={this.props.focusThreadKey}
          selectPrevCategory={this.props.selectPrevCategory}
          selectNextCategory={this.props.selectNextCategory}
          resetFocus={this.props.resetFocus}
        />
        <TypeaheadByHeadline
          options={this.makeHeadlineOptions()}
          focusStory={this.props.focusStory}
          selectStoryByKey={this.props.selectStoryByKey}
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