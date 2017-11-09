import React, { Component } from 'react';
import Marker from './Marker.jsx';

//TODO: Add scroll to viz functionality here

function StoryHook(props){
  const handleClick = props.selectStoryByKey;
  return (
    <span
      className="link-hook story"
      onClick={()=> handleClick(props.storyKey)}
    >
      {props.children}
    </span>
  )
}

function CategoryHook(props){
  const handleClick = props.selectCategoryByKey;
  return (
    <span
      className="link-hook category"
      onClick={()=> handleClick(props.categoryKey)}
    >
      {props.children}
    </span>
  )
}

class Analysis extends React.Component {
  render(){
    const style = this.props.markStyle;
    return (<div className="text-container">
      <h2>And what I make of it</h2>
      <h3>Value in volume</h3>

      <p>First, note the volume here — 561 stories, or on average slightly more than one piece a workday. And I wasn't by any means the paper's most prolific writer during this period either, a distinction that would go to either veteran education reporter <a href="https://www.bozemandailychronicle.com/search/?sd=desc&l=25&b=%22gail%20schontzler%22">Gail Schontzler</a> or police and courts reporter <a href="https://www.bozemandailychronicle.com/search/?sd=desc&l=25&b=%22whitney%20bermes%22">Whitney Bermes</a>.</p>

      <p>Most of what's shown here isn't particularly memorable, at least in isolation. A lot of these stories are reports out of the city commission meetings I covered every week, or pieces covering the town's latest new business or development proposal — the sort of stuff that's the bread-and-butter of local news, the sort of coverage newspapers have been doing day in and day out for so long most of us take it for granted.</p>

      <p>I don't need to rehash <a href="https://www.cjr.org/local_news/american-news-deserts-donuts-local.php">the problems facing journalism</a> as the companies that employ most community-based reporters struggle to adapt to the digital world. But part of my point here is illustrating what we're in danger of losing if we don't find ways to keep our local journalism tradition alive.</p>

      <p>Beat reporters at daily newspapers capture a huge amount of basic information about our society, stuff that would otherwise be consigned to obscure government records or allowed to escape the public's view entirely. Individual stories may fade into obscurity a week or two after publication, but their cumulative impact is tremendous — as the saying goes, the <a href="https://en.wikipedia.org/wiki/Phil_Graham">first rough draft of history</a>."</p>

      <h3>Connecting the dots</h3>

      <p>Newspaper-style writing has traditionally relied on the assumption that most of its audience is daily readers, people in the habit of browsing each day's paper over their morning coffee.</p>

      <p>As such, traditional newspaper articles tend to take an incremental approach to issues, leading with new developments like a commission vote or a fresh court filing. That assumes readers know the back story to the issues being covered — and can be baffling to occasional readers when they encounter a topic for the first-time.</p>

      <p>Take this headline for instance: <StoryHook storyKey='58' selectStoryByKey={this.props.selectStoryByKey}>"Holloran submits revised design for 5-story Black-Olive project."</StoryHook> If you know Andy Holloran is a Bozeman developer with a contentious proposal seen as a bellwether for the direction of the city's downtown, the editorial judgement in featuring the story makes sense. If you don't, you'd be forgiven for wondering why the newspaper seems to think you should care.</p>

      <p>Furthermore, the way modern web publishing works means its less and less likely any particular reader, even an attentive one, sees every story a news outlet puts out about a particular issue. Instead of plowing through a daily paper, online readers tend to see occasional articles from a wide variety of outlets as they browse sites like Facebook. Big stories — or outrage-inducing ones — tend to find their way to sizable audiences. But there's a good chance you never see the sober, nuance-focused follow-ups. </p>

      <p>That means local papers like the Chronicle have a harder and harder task showing anyone but their most engaged readers the full breadth of stories that develop over time. With Black-Olive ::LINK, for example, I wrote <CategoryHook categoryKey='black-olive' selectCategoryByKey={this.props.selectCategoryByKey}>20 stories</CategoryHook>, among them <StoryHook storyKey='60' selectStoryByKey={this.props.selectStoryByKey}>a look at neighbors worried about overflow parking</StoryHook>, a <StoryHook storyKey='59' selectStoryByKey={this.props.selectStoryByKey}>profile of Mr. Holloran</StoryHook>and <StoryHook storyKey='85' selectStoryByKey={this.props.selectStoryByKey}>a feature</StoryHook> trying to make sense over the the debate around the proposal.</p>

      <p>If you only caught one or two pieces over the course of the public conversation (say the ones your irate Facebook friend shared because they found them upsetting), you missed much of the story.</p>

      <h3>Rethinking digital news</h3>

      <p>The <a href="https://www.bozemandailychronicle.com/">Chronicle's home page</a>, like the website for nearly every newspaper in the country, is focused on presenting visitors with the news of the day — the same material, more or less, that you get buying a physical paper off the news stand. The same goes for its social media channels — with #throwbackthursday exceptions, the stuff it shares to Facebook or Twitter is freshly written.</p>

      <p>The Chronicle website does give access to older stories — tens of thousands of them, dating as far back as the 1990s — but you can really only get to them by running a search, either through Google or the somewhat clunky on-site interface. As I see it, that's a missed opportunity.</p>

      <p>Put another way, newspaper websites are almost universally tailored to the 'What's new today?' use case. Which is fine for in-the-know residents wanting to keep up with what's going on in their town. But it isn't really optimal for less-engaged readers who might be more interested in the background on a current issue than the latest update, or new arrivals looking for a primer on elected officials or ongoing civic debates.</p>

      <p>To some extent reporters and editors can address that in the way we write and structure articles (e.g. using Sunday features like my <CategoryHook categoryKey='how-will-we-grow' selectCategoryByKey={this.props.selectCategoryByKey}>'How will we grow?' series on Bozeman's growth</CategoryHook> to add context beyond daily stories). But there's also a more fundamental user experience issue for media outlets to consider — how to present archival material in ways that make it easier for readers to see the patterns of their community's recent history.</p>

      <p>The interactive above, based on data pulled from a Chronicle RSS feed, is a stab in that direction.</p>

      <hr />

      <p className="footnote">Data pulled from a Chronicle RSS feed. Code on <a href="https://github.com/eidietrich">Github</a>. Reach me at <a href="https://twitter.com/eidietrich">@eidietrich</a> or eric.dietrich@gmail.com.
      </p>

    </div>);
  }
}

export default Analysis;

function MarkerSpanWrap(props){
 const inlineSvg = <svg
  width={10}
  height={15}
  style={{display: 'inline', marginLeft: 1, marginRight: 1}}>
    <Marker
      data={{
        x: 10,
        y: 10,
        markerWidth: 20,
        radius: 10,
        color: props.style.color
      }}
      markerClass='marker no-focus'
      shadow={true}
    />
  </svg>
  return <span>({inlineSvg})</span>
}