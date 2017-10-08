import React, { Component } from 'react';
import TypeaheadByTopic from './TypeaheadByTopic.jsx';
import { Button, ButtonGroup, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import categoryKeys from './../data/category-keys.json';

class TopicSelector extends React.Component {

  render(){
    const menuItems = this.props.storyCategories.map((cat, i) => {
      return (
        <option key={cat.key} value={cat.key}>
          {cat.label}
        </option>
      );
    });
    const dropdown = (
      <FormControl
        componentClass="select"
        value={this.props.focusThreadKey || 'reset'}
        onChange={e => {this.handleSubmit(e.target.value);}}>
        <option value="reset">All topics</option>
        {menuItems}
      </FormControl>
    );
    const buttonGroup = (
      <ButtonGroup>
        <Button
          onClick={this.props.getPrevThread}
        >&larr;</Button>
        <Button
          onClick={this.props.getNextThread}
        >&rarr;</Button>
        <Button
          onClick={this.props.resetFocus}
        >&#8634;</Button>
      </ButtonGroup>
    );
    const typeahead = (
      <TypeaheadByTopic
          options={this.makeTopicOptions()}
          focusThreadKey={this.props.focusThreadKey}
          getThread={this.props.getThread}
        />
    )

    return (
      <div className='dropdown'>
        {typeahead}
        {buttonGroup}
      </div>
    );
  }

  // makeCategoryHierarchy(){
  //   var flattened = Object.keys(categoryKeys).map(i => {
  //     return {
  //       key: i,
  //       display: categoryKeys[i].display,
  //       threaded: categoryKeys[i].threaded,
  //       type: categoryKeys[i].type
  //     }
  //   })

  //   const nested = nest()
  //     .key(function(d){ return d.type; })
  //     .entries(flattened);

  //   console.log('nested', nested);
  //   return nested;
  // }

  makeTopicOptions(){
    const options = this.props.storyCategories.map(cat => {
      return {
        key: cat.key,
        label: cat.label,
        type: cat.type,
        numStories: cat.numStories,
      }
    })
    return options;
  }

  handleSubmit(option){
    if (option === 'reset'){
      this.props.resetFocus();
    } else {
      this.props.getThread(option);
    }
  }

}

export default TopicSelector;