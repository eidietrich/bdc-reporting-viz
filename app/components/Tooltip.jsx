import React from 'react';

/* Tooltip

Expects props
  x rel to container
  y rel to container
  contents html content
*/

function Tooltip(props){
  // console.log(props);
  const xOffset = 5;
  const yOffset = -10;
  const position = {
    top: props.y + yOffset,
    left: props.x + xOffset
  }


  return (
    <div
      className='viz-tooltip'
      style={position}
    >
      <em>{props.data.type}</em><br />
      <strong>{props.data.title}</strong>
    </div>
  );
}

export default Tooltip;