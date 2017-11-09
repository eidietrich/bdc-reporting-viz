

Oct. 3 2017

- Push to github pages, pass around for UI testing
- Multiple columns for highlight topic typeahead menu
- Finish refactoring CSS
- adjust scrollhandling so it works for long scrolls (repeating until scrollCondition isn't met)
- Address mouseover lag
- Bug in that selecting new topic by tag sometimes doesn't keep the current story in focus
- BUG: Rect height changing on storyviz update on mobile
- Add 'scroll to viz' functionality in Story/Category hook components

Pre-beta testing TODO:
- Polish intro/analysis text
- Add interface for 'links' triggering actions on viz.

Data cleaning to-dos
- Tighten housing plan narrative?
- Does cost-of-living fit in somewhere else?
- Growth-and-change is too much of a catch all
- Add missing tags

Jul 1 2017

# Hierarchy

App
- ControlPanel
    + TypeaheadByHeadline (can select specific stories)
    + TopicSelector (can select categories)
        * TypeaheadByTopic
        * Other controls
- StoryViz
    + Tooltip
    + Grid
    + Connectors
    + Markers
- BlurbContainer
    + BlurbScrollerMobile
        * BlurbMobile
    + BlurbScrollerDesktop
        * 
    + BlurbContainerDefaultContents
- StoryOutline (old/unused)

# Interaction design:
Ways to categorize stories:
- type - blog/news/feature, etc. --> controls box color, blurb tag. Each story has exactly one.
- series - tag for 'How will we grow?' etc. Story can have zero or one.
- story_threads - Threaded narrative. Story can have zero or more
- tags - Unthreaded collections (e.g. data viz). Story can have zero or more.

Interactions:
- Mouseover (desktop only) --> Display blurb for story in blurb container
- Click/tap story --> Make story prime highlight, highlight/connect others in series/thread if there is one.
- Select by title search --> Same as clicking/tapping story
- Select in 'highlight topic' box --> highlight/connect stories in series/thread OR highlight stories with same topic




-- 