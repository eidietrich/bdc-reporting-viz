import React, { Component } from 'react';
import { timeFormat } from 'd3';

class TeaseContainer extends React.Component {
  constructor(props){
    super(props)
    this.formatDate = timeFormat('%a %b %d, %Y');
  }

  render(){
    if (!this.props.threadStories) {
      return this.renderDefault();
    } else {
      const threadHeader = this.props.focusThread || '';
      const teases = this.props.threadStories.map(story =>{
        return this.buildBlurb(story);
      });

      // const header = (
      //   <div className='tease-header'>
      //     <h4>{threadHeader}</h4>
      //   </div>
      // );
       const header = (
        <div className='tease-header'>
          <h4>Header</h4>
        </div>
      );

      return (
        <div className='tease-container'>
          {header}
          <div className='story-teases'>
            {teases}
          </div>
        </div>
      )
    }
  }

  buildBlurb(story){
    const date = this.formatDate(story.date);
    return (
      <div className='story-tease' key={story.key}>
        <h5>{story.type}</h5>
        <h4><a href={story.link} target='_blank'>{story.title}</a></h4>
        <h6>{`${story.creator} | ${date}`}</h6>
      </div>
    );
  }

  renderDefault(){
    return (<div className='tease-container'>TODO: Default text for this</div>);
  }
}

export default TeaseContainer;
