import React, { Component } from 'react';
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';

class DropdownSelect extends React.Component {

  render(){
    const menuItems = this.props.options.map((option, i) => {
      return (
        <MenuItem
          key={String(i)}
          onClick={() => this.handleSubmit(option)}
        >{option}</MenuItem>
      );
    });

    const buttonGroup = (
      <ButtonGroup>
        <DropdownButton title="Select by storyline" id="bg-nested-dropdown">
          {menuItems}
        </DropdownButton>
        <Button
          onClick={this.props.getPrevThread}
        >&larr;</Button>
        <Button
          onClick={this.props.getNextThread}
        >&rarr;</Button>
      </ButtonGroup>
    );

    return buttonGroup;
  }

  handleSubmit(option){
    this.props.getThread(option);
  }

}

export default DropdownSelect;