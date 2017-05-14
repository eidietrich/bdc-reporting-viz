import React, { Component } from 'react';

import ControlPanel from './ControlPanel.jsx';
import StoryViz from './StoryViz.jsx';
import TeaseContainer from './TeaseContainer.jsx';
import StoryOutline from './StoryOutline.jsx'

import stories from './../data/stories.json';

function parseDate(dateString){
  return new Date(dateString);
}

var markStyle = {
  web: { radius: 9, color: '#7570b3'},
  blog: { radius: 5, color: '#7570b3'},
  news: { radius: 7, color: '#a6761d'},
  midform: { radius: 10, color: '#d95f02'},
  feature: { radius: 13, color: '#e6ab02'},
  'growth-feature': { radius: 13, color: '#e6ab02'},
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.stories = this.cleanData(stories);
  }

  render(){
    return (
      <div className="container">
        <h1>Tracking Bozeman's growth</h1>
        <p>Lead in text here</p>
        <ControlPanel />
        <StoryViz stories={this.stories}/>
        <TeaseContainer />

      </div>
    )
  }

  cleanData(rawData){
    // console.log('raw', data);
    var cleaned = rawData.map(function(row, i){
      var object = {};
      object.key = String(i);
      object.category = row.category;
      object.creator = row.creator;
      object.description = row.description;
      object.link = row.link;
      object.key_topic = row.key_topic;
      object.date = parseDate(row.pubDate);
      object.related_topics = row.related_topics;
      object.story_thread = row.story_thread;
      object.thumbnail = row.thumbnail;
      object.title = row.title;
      object.type = row.type;
      // Calculated
      object.radius = markStyle[row.type].radius;
      object.color = markStyle[row.type].color;
      return object;
    })
    return cleaned;
  }
}

export default App;