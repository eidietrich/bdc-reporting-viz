import React, { Component } from 'react';
import { Button, ButtonGroup, DropdownButton, MenuItem, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class DropdownSelect extends React.Component {

  render(){
    const menuItems = this.props.options.map((option, i) => {
      return (
        <option key={String(i)} value={option}>
          {option}
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

    return (
      <div>
        <ControlLabel>Highlight a topic</ControlLabel>
        {dropdown}
        {buttonGroup}
      </div>
    );
  }

  handleSubmit(option){
    if (option === 'reset'){
      this.props.resetFocus();
    } else {
      this.props.getThread(option);
    }
  }

}

export default DropdownSelect;