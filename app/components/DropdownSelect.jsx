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

    const topItems = [
      (<MenuItem key='reset' onClick={this.props.resetFocus}>
        Reset view
      </MenuItem>),
      (<MenuItem key='line' divider/>)
    ];

    const menu = topItems.concat(menuItems)

    const buttonGroup = (
      <ButtonGroup>
        <DropdownButton title="" id="bg-nested-dropdown">
          {menu}
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