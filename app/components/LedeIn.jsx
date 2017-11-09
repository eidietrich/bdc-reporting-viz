import React, { Component } from 'react';
import Marker from './Marker.jsx';

class LeadIn extends React.Component {
  render(){
    const style = this.props.markStyle;
    return (<div className="text-container">
      <div className="article-framing">
        <div className="byline"><a href='https://twitter.com/eidietrich'>
          By Eric Dietrich
        </a></div>
        <div className="pub-date">, November 2017</div>
      </div>
      <p>What does the news coverage produced by a single reporter at a small daily newspaper look like over the course of a couple years? Something like this.</p>
      <p>The stories displayed below happen to be my own work, specifically pieces published between July 2015 and June 2017 during my stint covering city hall for the <a href="https://www.bozemandailychronicle.com/">Bozeman Daily Chronicle</a>. Shown are daily <span className="storyTag" style={{'backgroundColor': style.news.color}}> news stories</span>, web-only <span className="storyTag" style={{'backgroundColor': style.blog.color}}>blog posts</span>, more in-depth <span className="storyTag" style={{'backgroundColor': style.midform.color}}>midform articles</span> and longform <span className="storyTag" style={{'backgroundColor': style.feature.color}}>Sunday features</span>.
      </p>
    </div>);
  }
}

export default LeadIn;

function MarkerSpanWrap(props){
 const inlineSvg = <svg
  width={10}
  height={props.style.radius}
  style={{
    display: 'inline', marginLeft: 1, marginRight: 1,
  }}>
    <Marker
      data={{
        x: 10,
        y: 10,
        markerWidth: 20,
        radius: props.style.radius,
        color: props.style.color
      }}
      markerClass='marker no-focus'
      shadow={true}
    />
  </svg>
  return <span>({inlineSvg})</span>
}