import React, { Component } from 'react';

import ControlPanel from './ControlPanel.jsx';
import StoryViz from './StoryViz.jsx';
import BlurbContainer from './BlurbContainer.jsx';
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
    this.threads = this.getThreads(this.stories);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isMobile: null,
      focusMode: false, // true if story/thread is selected
      focusStoryKey: null,
      focusStory: null,
      focusThreadKey: null,
      focusThreadStories: null,
      tooltipStory: null, // story to draw tooltip on (desktop)
    }

    // for event handling
    // TODO - Iron out redundancy with this logic
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.resetFocus = this.resetFocus.bind(this);
    this.getStoryByKey = this.getStoryByKey.bind(this);
    this.selectThread = this.selectThread.bind(this);
    this.incrementThreadFocus = this.incrementThreadFocus.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  render(){
    // console.log(this.state);

    return (
      <div className="container">
        <h1>Two years of reporting on Bozeman's growth</h1>
        <p>Lead in text here</p>
        <ControlPanel
          // display control
          stories={this.stories}
          threads={this.threads}
          focusStoryKey={this.state.focusStoryKey}
          focusThreadKey={this.state.focusThreadKey}
          // interaction handlers
          getStory={this.getStoryByKey}
          getThread={this.selectThread}
          getPrevThread={() => this.incrementThreadFocus(-1)}
          getNextThread={() => this.incrementThreadFocus(1)}
          resetFocus={this.resetFocus}
        />
        <StoryViz
          // display control
          stories={this.stories}
          focusMode={this.state.focusMode}
          focusStoryKey={this.state.focusStoryKey}
          focusStory={this.state.focusStory}
          focusThread={this.state.focusThreadKey}
          threadStories={this.state.focusThreadStories}
          tooltipStory={this.state.tooltipStory}
          // interaction handlers
          handleMarkerClick={this.handleMarkerClick}
          handleMouseEnter={this.handleMouseEnter}
          handleMouseLeave={this.handleMouseLeave}
          handleReset={this.resetFocus}
          />
        <BlurbContainer
          // display control
          isMobile={this.state.isMobile}
          focusThread={this.state.focusThreadKey}
          focusStoryKey={this.state.focusStoryKey}
          threadStories={this.state.focusThreadStories}
          // interaction handlers
          getStory={this.getStoryByKey}
          getPrevStory={() => this.incrementStoryFocus(-1)}
          getNextStory={() => this.incrementStoryFocus(1)}
        />
      </div>
    )
  }
  // DATA HANDLING
  cleanData(rawData){
    // console.log('raw', data);
    const cleaned = rawData.map(function(row, i){
      let object = {};
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
    });

    const sorted = cleaned.sort(function(a,b){
      return a.date - b.date;
    });

    return sorted;
  }
  getThreads(data){
    const threads = [...new Set(data.map(story => story.story_thread))];
    return threads;
  }
  getThreadStories(threadKey){
    if (threadKey === null) return null;
    const threadStories = this.stories.filter(story => {
      return story.story_thread === threadKey;
    });
    return threadStories;
  }
  // INTERACTIVITY HANDLING - HIGH LEVEL
  // reference to event objects
  handleMarkerClick(story){
    this.resetTooltip();
    this.selectStory(story);
  }
  // assume this only works on desktop!
  handleMouseEnter(story){
    if (!this.state.focusMode){
      this.setTeaseStories([story]);
      this.setFocusStory(story);
    } else if (this.state.focusThreadKey === story.story_thread){
      this.setFocusStory(story);
    }
    // ALT BEHAVIOR
    // // Tooltip unless focus is activated, then only on focus thread stories
    // const matchFocusThread = (story.story_thread === this.state.focusThreadKey);
    // if (!this.state.focusMode){
    //   this.addTooltip(story);
    // } else if (matchFocusThread) {
    //   this.addTooltip(story);
    // }
  }
  handleMouseLeave(){
    // if (!this.state.focusMode){
    //   // this.resetTooltip();
    //   this.setTeaseStories(null);
    //   this.setFocusStory(null);
    // }

  }

  // INTERACTIVITY HANDLING - LOW LEVEL
  // reference to mechanics of what happens
  resetFocus(){
    this.setState({
      focusMode: false,
      focusStoryKey: null,
      focusStory: null,
      focusThreadKey: null,
      focusThreadStories: null,
    });
  }
  resetTooltip(){
    this.setState({
      tooltipStory: null,
    });
  }

  addTooltip(story){
    this.setState({
      tooltipStory: story
    });
  }

  setTeaseStories(stories){
    this.setState({
      focusThreadStories: stories,
    })
  }

  setFocusStory(story){
    const newKey = story ? story.key : null;
    this.setState({
      focusStory: story,
      focusStoryKey: newKey,
    });
  }


  selectThread(newThreadKey){
    // console.log('new thread select', newThreadKey);
    const newThreadStories = this.getThreadStories(newThreadKey)
    const newFocusStory = newThreadStories[0];
    const newFocusStoryKey = newFocusStory.key;

    this.setState({
      focusMode: true,
      focusStoryKey: newFocusStoryKey,
      focusStory: newFocusStory,
      focusThreadKey: newThreadKey,
      focusThreadStories: newThreadStories,
    });
  }
  getStoryByKey(newStoryKey){
    console.log('get story by', newStoryKey);
    const stories = this.stories.filter((d) => {return d.key === newStoryKey});
    const story = stories[0]; // Should only be one if keys are unique
    this.selectStory(story);
  }

  selectStory(newStory){
    const newStoryKey = newStory.key;
    const newThreadKey = newStory.story_thread;
    const partOfStoryThread = (newStory.story_thread.length > 0);
    if (partOfStoryThread) {
      this.setState({
        focusMode: true,
        focusStoryKey: newStoryKey,
        focusStory: newStory,
        focusThreadKey: newThreadKey,
        focusThreadStories: this.getThreadStories(newThreadKey),
        // tooltipStory: newStory,
      });
    } else {
      this.setState({
        focusMode: true,
        focusStoryKey: newStoryKey,
        focusStory: newStory,
        focusThreadKey: null,
        focusThreadStories: [newStory],
        // tooltipStory: newStory,
      });
    }
  }

  incrementThreadFocus(increment){
    const length = this.threads.length;
    const threadKey = this.state.focusThreadKey;
    const index = this.threads.indexOf(threadKey);

    let newIndex = index + increment;
    if (newIndex < 0) newIndex = length - 1;
    if (newIndex >= length) newIndex = 0;
    if (index === -1) newIndex = 0; // no match case

    const newThreadKey = this.threads[newIndex];
    this.selectThread(newThreadKey);
  }
  incrementStoryFocus(increment){
    const stories = this.state.focusMode ? this.state.focusThreadStories : this.stories;
    const length = stories.length;
    const storyKey = this.state.focusStoryKey;
    const keys = stories.map(d => d.key);
    const index = keys.indexOf(storyKey);

    let newIndex = index + increment;
    if (newIndex < 0) newIndex = length - 1;
    if (newIndex >= length) newIndex = 0;
    if (index === -1) newIndex = 0; // no match found

    const newStory = stories[newIndex];
    if (!this.state.focusMode){
      this.setTeaseStories([newStory]);
      this.setFocusStory(newStory);
    } else if (this.state.focusThreadKey === newStory.story_thread){
      this.setFocusStory(newStory);
    }
  }

  updateWindowDimensions(){
    const breakpoint = 768;
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isMobile: (window.innerWidth < breakpoint)
    });
  }
}

export default App;