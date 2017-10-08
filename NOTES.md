

Oct. 3 2017
Getting back into this TODO
- BlurbContainer spec behavior:
    + Default contents TBD (color/size key?)
    + Display theme key before blurbs on mobile
- Fine-tune CSS/styling
    + Better colors
    + Nicer design for ticker shape
- Figure out/write new intro framing 
- Push to github pages, pass around for UI testing
- On tag select, keep memory of focus node
- Multiple columns for highlight topic typeahead menu
- Include #s of nodes in highlight topic typeahead menu, sort by #

Data cleaning to-dos
- Food trucks missing early pieces (attached to vacation rentals?)
- Cost-of-living missing first-annual beer index story
- ID blog posts/midform/features
- Tighten housing plan narrative
- Add Kagy to spending-on-streets?
- Add 'with dataviz?' tag?
- Does cost-of-living fit in somewhere else?
- Is the walkability graphic in there?
- Housing tag is redundant

Jul 1 2017

# Hierarchy

App
- ControlPanel
    + Typeahead
    + DropdownSelect
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


# LEAD-IN New:

It's hard to see how just how much work local news produces, given how news tends to come to readers piecemeal these days, through the web. But this is what we're in danger losing.


# LEAD-IN Text

# Two years of tracking Bozeman's growth

At 27 years old, I'm young to have a job that's part of a dying breed —- a beat reporter for a small local newspaper, specifically Bozeman, Montana's [Daily Chronicle](http://www.bozemandailychronicle.com/).

[Describe job, how long I've been doing it for]

With 

Newsrooms like mine are smaller, less experienced and more poorly compensated than we once were. 

Still, our work still matters.

I'm quite often the only professional in the room as Bozeman's city commission . 

A couple times now, I've had the terrifying experience of interviewing candidates for public office, only to realize that the vast majority of what they know about the relevant issues comes from stories I've written.

Beyond that sort of anecdote, though, what sort of impact

[Get at what's the impact of local journalism]

[Here, I've visualized two years of work - not everything the Chronicle has published under my byline, but all of it that's been focused on governance and growth]

[Number of pieces, estimated word count, compare to some piece of classic literature in terms of length]

[Reflect on work here]

-- 