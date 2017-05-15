import React, { Component } from 'react';

import Typeahead from './Typeahead.jsx';
import DropdownSelect from './DropdownSelect.jsx';

class ControlPanel extends React.Component {
  render(){
    return (
      <div className='control-panel'>
        <Typeahead
          options={this.makeHeadlineOptions()}
          getStory={this.props.getStory}
        />
        <DropdownSelect
          options={this.props.threads}
          getThread={this.props.getThread}
          getPrevThread={this.props.getPrevThread}
          getNextThread={this.props.getNextThread}
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