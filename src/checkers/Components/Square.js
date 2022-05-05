import React from 'react'

export default class Square extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef([this.props.y, this.props.x].join('-'));
  }
  colour (highlighted, showHighlight) {
    return (this.props.y + this.props.x) % 2 === 1
      ? 'light-tile'
      : highlighted && showHighlight
        ? 'dark-tile active'
        : 'dark-tile'
  }
  allowDrop(e) {
    e.preventDefault();
  }

  dropPiece(e) {
    const dropData = e.dataTransfer.getData('text')
    console.log(JSON.parse(dropData))
    // e.target.appendChild(document.getElementById(dropData))
  }

  render () {
    return (
      <div
        ref={this.myRef}
        className={this.colour(this.props.highlighted, this.props.showHighlight)}
        onDragOver={this.allowDrop}
        draggable="false"
        onDrop={this.dropPiece}
        onClick={() => this.props.parentCallback(
          this.props.highlighted?!(
            this.props.highlightedSquares.some(
              action => action.some(
                ([y2, x2], index) => y2 === this.props.y && x2 === this.props.x && index !== 0 && index !== (action.length - 1)
              )
            )
          ):false)}
      />
    )
  }
}
