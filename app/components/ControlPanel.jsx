import React, { Component } from 'react';

import Typeahead from './Typeahead.jsx';
import DropdownSelect from './DropdownSelect.jsx';

class ControlPanel extends React.Component {
  render(){
    return (
      <div className='control-panel'>
        <DropdownSelect
          options={this.props.threads}
          getThread={this.props.getThread}
          focusThreadKey={this.props.focusThreadKey}
          getPrevThread={this.props.getPrevThread}
          getNextThread={this.props.getNextThread}
          resetFocus={this.props.resetFocus}
        />
        <Typeahead
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