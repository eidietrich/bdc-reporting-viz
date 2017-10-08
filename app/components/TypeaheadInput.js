import React, { Component } from 'react';
import { FormControl} from 'react-bootstrap';

class TypeaheadInput extends React.Component {
  render(){
    return <FormControl
      type='text'
      value={this.props.value}
      placeholder={this.props.placeholder}
      onChange={this.props.handleInput}
      onFocus={this.props.onFocus}
    />
  }
}

export default TypeaheadInput;