import React, { Component } from 'react';

import Typeahead from './Typeahead.jsx';
import DropdownSelect from './DropdownSelect.jsx';

class ControlPanel extends React.Component {
  render(){
    return (
      <div className='control-panel'>
        <h4>Select by article</h4>
        <Typeahead
          options={this.makeHeadlineOptions()}
          focusStoryKey={this.props.focusStoryKey}
          getStory={this.props.getStory}
        />
        <h4>Select by storyline</h4>
        <DropdownSelect
          options={this.props.threads}
          getThread={this.props.getThread}
          getPrevThread={this.props.getPrevThread}
          getNextThread={this.props.getNextThread}
          resetFocus={this.props.resetFocus}
        />
        <p>Showing {this.props.focusThreadKey || 'no focus thread'}</p>
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