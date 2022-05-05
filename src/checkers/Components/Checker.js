import React from 'react'
import crown from '../../assets/crown.png'
export default class Checker extends React.Component {
  checkerStyle (y, x) {
    return {
      // top: 'calc(50vh - 50vmin + 1.25vmin + ' + 12.5 * (7 - y) + 'vmin + 100px)',
      top: 'calc(' + 12.5 * (7 - y) + 'vmin - ' + 25 * (7 - y) + 'px + 1.25vmin)',
      // left: 'calc(50vw - 50vmin + 1.25vmin + ' + 12.5 * x + 'vmin - ' + 50 / 8 * x + 'px)'
      left: 'calc(50vw - 48.75vmin + 100px + ' + 12.5 * x + 'vmin - ' + 25 * x + 'px)',
    }
  }

  dragStart (e, y, x) {
    e.dataTransfer.setData('text/plain', JSON.stringify({y, x}));
  }

  render () {
    return (
      <div
        onClick={() => this.props.parentCallback()}
        className={
          (this.props.player === 'p' ? 'checker-dark' : 'checker-light') +
          (this.props.highlighted ? ' highlighted' : '') +
          (this.props.royal ? ' royal' : '')
        }
        style={this.checkerStyle(this.props.y, this.props.x)}
        draggable
        onDragStart={(e) =>this.dragStart(e, this.props.y, this.props.x)}
      >
        {this.props.royal && (
          <img src={crown} alt='crown' />
        )}
      </div>
    )
  }
}
