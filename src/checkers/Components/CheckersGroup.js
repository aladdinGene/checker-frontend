import React from 'react'
import Checker from './Checker'
import { eq } from 'aima-checkers'

export default class CheckersGroup extends React.Component {
  render () {
    return this.props.pieces.map(([y, x, royal]) => {
      return (
        <Checker
          player={this.props.player}
          selectedChecker={this.props.selectedChecker}
          highlighted={this.props.highlightedCheckers.some(pos => eq(pos, [y, x]))}
          parentCallback={() => this.props.parentCallback(y, x, royal)}
          y={y}
          x={x}
          royal={royal}
          key={y + ',' + x}
        />
      )
    }
    )
  }
}
