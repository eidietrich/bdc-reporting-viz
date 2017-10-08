Used Blox RSS feed to pull down story summaries 100 at a time

Example RSS call: http://www.bozemandailychronicle.com/search/?sd=desc&s=start_time&t=article&b=Eric%20Dietrich&f=rss&l=100&d2=06/07/2015

Reference: https://help.bloxcms.com/knowledge-base/applications/editorial/assets/tasks/article_504ccd62-2bfd-11e5-8804-131eebdc4425.html

Converted to csv with online tool (did have to remove colons on tags)

Cleaning data in a google doc
https://docs.google.com/spreadsheets/d/1dcQY43Xq6wPTHQF2HB-_INBHBj35OxTdBWYgZejgQ7M/edit#gid=590176656

# TODO

Decide how far back to go

Consider adding taproom stories back in (would make for an interesting thread)



# Story typography
(This is the hard part of this, I think)

Story types:
- Daily (change to news)
- Midform
- Feature
- growth-feature
- Blog
- Web-extra

story_thread - one-per story.

- downtown-midrise - Downtown building up (midrise buildings, parking concerns), Black-Olive
- planning-coordination - City/county stuff (transpo master plan spat?, annexation, )
- ymca-city-break
- l-and-j
- infrastructure costs - How the city is planning infrastructure (streets esp) & who'll end up paying for it
- 
- baxter-davis

Topics (tags)
Multiple per story

# For accessing google sheets via API
https://developers.google.com/sheets/api/quickstart/nodejs

# Visualization / Interactivity

Story tease pane: 
- At right, scroll up/down on desktop (DONE)
- At bottom, scroll left/right on mobile (DONE)

Arrange:
- By geography (show a map of Bozeman, downtown/broader views)
- By chronology (single line, maybe a snake, showing how stories move)
- By story thread
- By groupings (e.g. growth stories / daily coverage)

Filter:
- By topic (manually set up tags)
- By story type
- To Growth series


Top level/main/app object:
- State management
- Contain button bars / manage interaction

Viz object
- Contain layouts
- Rendering?

Things layout object needs to provide/point to:
- Point layout function
- How to draw points function
- Whether/how to draw threads between points
- Whether/how to draw axis
- How to group data

