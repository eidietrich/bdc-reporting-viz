import React, { Component } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import onClickOutside from 'react-onclickoutside';

// options is array of {key: '...', 'label': '...'} objects
// label for display, key for return value


class Typeahead extends React.Component {
  constructor(props){
    super(props);
    this.placeholder = 'Search by title (e.g. "housing," "parking")';
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
      <div>
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
    console.log('submitted', item);
    console.log(this.props);
    this.props.getStory(item.key)
    this.setState({
      inputValue: item.label,
      menuContents: null
    });
  }


}

export default onClickOutside(Typeahead);

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

class TypeaheadMenu extends React.Component {
  render(){
    // console.log('contents', this.props.contents);
    if (!this.props.contents || this.props.contents.length === 0) return null;

    const items = this.props.contents.map(item => {
     return ( <li key={item.key}>
        <a onClick={() => this.props.handleSubmit(item)}>
          {item.label}
        </a>
      </li>);
    });
    // console.log(items);

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