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

    this.initializeStoryCategories(categoryKeys, this.stories)
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isMobile: null,
      focusMode: false, // true if story/thread is selected
      focusStory: null,
      focusThreadKey: null,
      focusThreadStories: null,
    }

    // for event handling
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.resetFocus = this.resetFocus.bind(this);
    this.selectStoryByKey = this.selectStoryByKey.bind(this);
    this.selectCategoryByKey = this.selectCategoryByKey.bind(this);
    this.incrementCategoryFocus = this.incrementCategoryFocus.bind(this);
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
          // app data
          stories={this.stories}
          storyCategories={this.storyCategories}

          // display control
          focusStory={this.state.focusStory}
          focusThreadKey={this.state.focusThreadKey}

          // interaction handlers
          selectStoryByKey={this.selectStoryByKey}
          selectCategoryByKey={this.selectCategoryByKey}
          selectPrevCategory={() => this.incrementCategoryFocus(-1)}
          selectNextCategory={() => this.incrementCategoryFocus(1)}
          resetFocus={this.resetFocus}
        />
        <StoryViz
          // app data
          stories={this.stories}
          storyCategories={this.storyCategories}

          // display control
          focusMode={this.state.focusMode}
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
          focusStory={this.state.focusStory}
          displayStories={this.state.focusThreadStories}

          // interaction handlers
          selectCategoryByKey={this.selectCategoryByKey}
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

  initializeStoryCategories(categoriesRaw, stories){
    // expects categories as a flat json

    // TODO: Add code that checks to see whether stories have missing categories

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

    // sort by numb stories descending, then type
    const refArray = ['series','story-arc','tag']
    // TODO - avoid hardcoding this here
    this.storyCategories.sort((a,b) => {
      if (a.type === b.type){
        return b.numStories - a.numStories;
      } else {
        return refArray.indexOf(a.type) - refArray.indexOf(b.type);
      }
    })

    console.log('categories', this.storyCategories);
  }

  // INTERACTIVITY HANDLING - EVENT LISTENERS
  // reference to event objects
  handleMarkerClick(story){
    this.resetTooltip();
    this.selectStory(story);
  }
  // assume this only works on desktop!
  handleMouseEnter(story){
    if (!this.state.focusMode){
      this.setBlurbContainerStories([story]);
      this.setFocusStory(story);
    } else if (story.categories.indexOf(this.state.focusThreadKey) >=0){
      this.setFocusStory(story);
    }
  }
  handleMouseLeave(){
    // null
  }

  // INTERACTIVITY HANDLING - LOW LEVEL
  // reference to mechanics of what happens
  resetFocus(){
    this.setState({
      focusMode: false,
      // focusStoryKey: null,
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

  setBlurbContainerStories(stories){
    this.setState({
      focusThreadStories: stories,
    })
  }

  setFocusStory(story){
    const newKey = story ? story.key : null;
    this.setState({
      focusStory: story
      // focusStoryKey: newKey,
    });
  }

  // Story handling
  selectStoryByKey(newStoryKey){
    const newStory = this.getStoryByKey(newStoryKey)
    this.selectStory(newStory);
  }
  getStoryByKey(newStoryKey){
    const story = this.stories.filter((d) => {return d.key === newStoryKey})[0];
    return story; // Should only be one if keys are unique
  }
  selectStory(newStory){
    const newStoryKey = newStory.key;
    const newStoryCategoryKey = newStory.categories[0]; // pick first if multiple

    // TODO: Break this out as a utility function, pass down to objects that need it
    const newStoryCategory = this.storyCategories.filter(cat => cat.key === newStoryCategoryKey)[0];

    if (newStoryCategory && newStoryCategory.isThreaded) {
      this.setState({
        focusMode: true,
        focusStory: newStory,
        focusThreadKey: newStoryCategoryKey,
        focusThreadStories: newStoryCategory.stories,
        // tooltipStory: newStory,
      });
    } else {
      this.setState({
        focusMode: true,
        focusStory: newStory,
        focusThreadKey: null,
        focusThreadStories: [newStory],
      });
    }
  }

  // Category handling
  selectCategoryByKey(newCategoryKey){
    const newCategory = this.getCategoryByKey(newCategoryKey);
    this.selectCategory(newCategory);
  }
  getCategoryByKey(newCategoryKey){
    const category = this.storyCategories.filter((d) => {
      return d.key === newCategoryKey
    })[0];
    return category;
  }
  selectCategory(newCategory){
    // TODO: Refine here so selecting new category doesn't change focusStory if current focusStory is part of thread
    const newFocusStory = newCategory.stories[0];
    this.setState({
      focusMode: true,
      // focusStoryKey: newFocusStory.key,
      focusStory: newFocusStory,
      focusThreadKey: newCategory.key,
      focusThreadStories: newCategory.stories,
    })
  }

  // Incremental shifts
  incrementCategoryFocus(increment){
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
    this.selectCategoryByKey(newThreadKey);
  }
  incrementStoryFocus(increment){
    const stories = this.state.focusMode ? this.state.focusThreadStories : this.stories;
    const length = stories.length;
    const storyKey = this.state.focusStory.key;
    const keys = stories.map(d => d.key);
    const index = keys.indexOf(storyKey);

    let newIndex = index + increment;
    if (newIndex < 0) newIndex = length - 1;
    if (newIndex >= length) newIndex = 0;
    if (index === -1) newIndex = 0; // no match found

    const newStory = stories[newIndex];

    if (!this.state.focusMode){
      this.setBlurbContainerStories([newStory]);
      this.setFocusStory(newStory);
    } else if (newStory.categories.indexOf(this.state.focusThreadKey) >=0){
      this.setFocusStory(newStory);
    }
  }

  // UTILITY FUNCTIONS

  // concatPropertyArrays(data, key){
  //   // utility function
  //   let initial = {};
  //   initial[key] = [];
  //   return data.reduce((a,b) => {
  //     const concated = a[key].concat(b[key]);
  //     let obj = {}
  //     obj[key] = concated;
  //     return obj;
  //   }, initial)
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