import React, { Component } from 'react';

class StoryOutline extends React.Component {
  render(){
    const stories = this.props.data;
    console.log(stories);

    const outline = stories.map((story) => {
      return (
        <div key={story.key}>
          <h4>{story.title}</h4>
          <p>{story.story_thread}</p>
        </div>
      )
    });

    return (
      <div>
        {outline}
      </div>
    )
  }
}

export default StoryOutline;