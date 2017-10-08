import React, { Component } from 'react';
import { nest } from 'd3'

import ControlPanel from './ControlPanel.jsx';
import StoryViz from './StoryViz.jsx';
import BlurbContainer from './BlurbContainer.jsx';
import StoryOutline from './StoryOutline.jsx'

import stories from './../data/stories.json';
import categoryKeys from './../data/category-keys.json';

function parseDate(dateString){
  return new Date(dateString);
}

var markStyle = {
  web: { radius: 9, color: '#7570b3'},
  blog: { radius: 5, color: '#7570b3'},
  news: { radius: 7, color: '#a6761d'},
  midform: { radius: 10, color: '#d95f02'},
  feature: { radius: 13, color: '#e6ab02'},
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.stories = this.cleanData(stories);
    // this.categories = this.getCategories(this.stories); // OLD
    this.initializeStoryCategories(categoryKeys, this.stories)
    // this.threads = this.getThreads(this.stories);
    // this.tags = this.getTags(this.stories);
    // this.logUniqueProperties(); // Utility function
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
        <h1>Two years of local reporting</h1>
        <p>Lead in text here</p>
        <ControlPanel
          // display control
          stories={this.stories}
          threads={this.categories}
          storyCategories={this.storyCategories}
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
          // app data
          stories={this.stories}
          storyCategories={this.storyCategories}

          // display control
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
          // app data
          storyCategories={this.storyCategories}

          // display control
          isMobile={this.state.isMobile}
          focusThread={this.state.focusThreadKey}
          focusStoryKey={this.state.focusStoryKey}
          threadStories={this.state.focusThreadStories}

          // interaction handlers
          getThread={this.selectThread}
          getStory={this.getStoryByKey}
          getPrevStory={() => this.incrementStoryFocus(-1)}
          getNextStory={() => this.incrementStoryFocus(1)}
        />
      </div>
    )
  }
  // DATA INITIALIZATION
  cleanData(rawData){
    const cleaned = rawData.map(function(row, i){
      let object = {};
      object.key = String(i);
      // object.category = row.category;
      object.creator = row.creator;
      object.description = row.description;
      object.link = row.link;
      object.key_topic = row.key_topic;
      object.date = parseDate(row.pubDate);
      // object.related_topics = row.related_topics;

      object.thumbnail = row.thumbnail;
      object.title = row.title;
      object.type = row.type;

      // categories
      const series = row.series.split(',')
      const story_threads = row.story_threads.split(',');
      const tags = row.tags.split(',');
      object.categories = series.concat(story_threads, tags).filter(i => i !== "");

      // // for selection handling
      // // primary_cat_threaded is true if primary_cat is series/thread, false if it's a tag
      // if (object.series[0] !== "") {
      //   object.primary_cat = object.series[0];
      //   object.primary_cat_threaded = true;
      // }
      // else if (object.story_threads[0] !== "") {
      //   object.primary_cat = object.story_threads[0];
      //   object.primary_cat_threaded = true;
      // }
      // else if (object.tags[0] !== ""){
      //   object.primary_cat = object.tags[0];
      //   object.primary_cat_threaded = false;
      // }
      // else {
      //   object.primary_cat = null;
      //   object.primary_cat_threaded = false;
      // }


      // Calculated for display
      object.radius = markStyle[row.type].radius;
      object.color = markStyle[row.type].color;
      return object;
    });

    const sorted = cleaned.sort(function(a,b){
      return a.date - b.date;
    });
    console.log('data', sorted)
    return sorted;
  }
  getCategories(stories){
    // return array of series, storyThreads and tags
    const allCategories = this.concatPropertyArrays(stories, 'categories')
    const uniqueCategories = [...new Set(allCategories.categories)]
    return uniqueCategories;
  }

  initializeStoryCategories(categoriesRaw, stories){
    console.log(categoriesRaw);
    // expects categories as a flat json

    // TODO: Add code that checks to see whether stories have missing categories

    // Populate hashed cat-label key
    this.storyCategories = categoriesRaw.map(row => {
      // pre-populate list of stories matching, length variable
      const matchingStories = this.stories.filter(story => {
        return story.categories.indexOf(row.key) >= 0;
      })

      const object = {
        key: row.key,
        label: row.label,
        isThreaded: row.isThreaded,
        type: row.type,
        stories: matchingStories,
        numStories: matchingStories.length
      }
      return object;
    })

    this.storyCategories.sort((a,b) => b.numStories - a.numStories)

    // TODO: Sort by type [series, story-arc, tag], then #

    // Dict for mapping category keys to labels
    // Could add other attributes here
    this.categoryLabelDict = {};
    categoriesRaw.forEach(row => {
      this.categoryLabelDict[row.key] = row.label;
    })
  }


  // getThreads(stories){
  //   // OLD
  //   // return array of threaded story collections
  //   const allSeries = this.concatPropertyArrays(stories, 'series');
  //   const allStory_threads = this.concatPropertyArrays(stories, 'story_threads');
  //   const uniqueThreads = [...new Set(allSeries.series.concat(allStory_threads.story_threads))];
  //   const filtered = uniqueThreads.filter(i => i !== ""); // remove blank
  //   return filtered;
  // }
  // getTags(stories){
  //   // OLD
  //   // return array of non-threaded story collections
  //   const allTags = this.concatPropertyArrays(stories, 'tags');
  //   const uniqueTags = [...new Set(allTags.tags)]
  //   const filtered = uniqueTags.filter(i => i !== "");
  //   return filtered;
  // }



  // INTERACTIVITY HANDLING - EVENT LISTENERS
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
    } else if (story.categories.indexOf(this.state.focusThreadKey) >=0){
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
    const newThreadStories = this.getStoriesInCategory(newThreadKey)
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
    // console.log('get story by', newStoryKey);
    const stories = this.stories.filter((d) => {return d.key === newStoryKey});
    const story = stories[0]; // Should only be one if keys are unique
    this.selectStory(story);
  }

  getStoriesInCategory(threadKey){
    if (threadKey === null) return null;
    const threadStories = this.stories.filter(story => {
      return (story.categories.indexOf(threadKey) >= 0);
    });
    return threadStories;
  }

  selectStory(newStory){
    const newStoryKey = newStory.key;
    const newStoryCategory = newStory.categories[0]; // pick first if multiple

    if (categoryKeys[newStoryCategory] && categoryKeys[newStoryCategory].threaded) {
      this.setState({
        focusMode: true,
        focusStoryKey: newStoryKey,
        focusStory: newStory,
        focusThreadKey: newStoryCategory,
        focusThreadStories: this.getStoriesInCategory(newStoryCategory),
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
    const length = this.storyCategories.length;
    const threadKey = this.state.focusThreadKey;
    const index = this.storyCategories
      .map(d => d.key)
      .indexOf(threadKey);

    let newIndex = index + increment;
    if (newIndex < 0) newIndex = length - 1;
    if (newIndex >= length) newIndex = 0;
    if (index === -1) newIndex = 0; // no match case

    const newThreadKey = this.storyCategories[newIndex].key;
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
    } else if (newStory.categories.indexOf(this.state.focusThreadKey) >=0){
      this.setFocusStory(newStory);
    }
  }

  // UTILITY FUNCTIONS

  concatPropertyArrays(data, key){
    // utility function
    let initial = {};
    initial[key] = [];
    return data.reduce((a,b) => {
      const concated = a[key].concat(b[key]);
      let obj = {}
      obj[key] = concated;
      return obj;
    }, initial)
  }

  // logUniqueProperties(){
  //   const output = {}
  //   this.threads.forEach(i => output[i] = {
  //     'display': i, 'threaded': true,
  //     'type': 'story-arc'})
  //   this.tags.forEach(i => output[i] = {
  //     'display': i, 'threaded': false,
  //     'type': 'tag'})
  //   console.log(JSON.stringify(output));
  // }

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