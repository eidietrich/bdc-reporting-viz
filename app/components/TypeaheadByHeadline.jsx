import React, { Component } from 'react';
import TypeaheadInput from './TypeaheadInput';
import { FormControl, InputGroup, ControlLabel } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';

// options is array of {key: '...', 'label': '...'} objects
// label for display, key for return value


class TypeaheadByHeadline extends React.Component {
  constructor(props){
    super(props);
    this.placeholder = 'Search in headline (e.g. "housing")';
    this.state = {
      inputValue: '',
      menuContents: null
    }

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  render(){

    return (
      <div className='typeahead-container'>
        <ControlLabel>Search for an article</ControlLabel>
        <TypeaheadInput
          placeholder={this.placeholder}
          value={this.state.inputValue}
          handleInput={this.handleInput}
          onFocus={this.onFocus}
        />
        <TypeaheadMenu
          contents={this.state.menuContents}
          handleSubmit={this.handleSubmit}
        />
      </div>
    )
  }

  handleClickOutside() {
    // see https://www.npmjs.com/package/react-onclickoutside
    this.setState({
      inputValue: '',
      menuContents: null
    });
  }

  onFocus(){
    // handle click into input box
    this.setState({
      inputValue: '',
      menuContents: this.props.options
    });
  }

  search(string){
    const results = this.props.options.filter(option => {
      const searchIn = option.label.toLowerCase();
      const searchFor = string.toLowerCase();
      return searchIn.includes(searchFor);
    });
    return results;
  }

  handleInput(e){
    const newValue = e.target.value;
    this.setState({
      inputValue: newValue,
      menuContents: this.search(newValue)
    });
  }

  handleSubmit(item){
    this.props.selectStoryByKey(item.key)
    this.setState({
      inputValue: item.label,
      menuContents: null
    });
  }


}

export default onClickOutside(TypeaheadByHeadline);

class TypeaheadMenu extends React.Component {
  render(){
    // console.log('contents', this.props.contents);
    if (!this.props.contents || this.props.contents.length === 0) return null;

    const items = this.props.contents.map((item, i) => {
     return ( <li key={item.key}>
        <a onClick={() => this.props.handleSubmit(item)}>
          <span className='dropdown-num'>{(i+1) + '. '}</span>
          {item.label}
        </a>
      </li>);
    });

    // style display: block; overrides default hiding of menu items
    return (
      <div className="dropdown">
        <ul className="dropdown-menu" style={{display: 'block'}}>
          {items}
        </ul>
      </div>
    );
  }
}