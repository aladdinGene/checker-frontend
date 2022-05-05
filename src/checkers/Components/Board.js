import React from 'react'
import Square from './Square'

export default class Board extends React.Component {
  constructor () {
    super()
    this.y_digits = [7, 6, 5, 4, 3, 2, 1, 0];
    this.x_digits = [0, 1, 2, 3, 4, 5, 6, 7];
  }
  
  render () {
    return (
      <div className='board'>
        {this.y_digits.map(y =>
          <div className='row' key={y}>
            {this.x_digits.map(x =>
              <Square
                highlighted={this.props.highlightedSquares.map(action => action[action.length - 1])
                  .some(([y2, x2]) => y2 === y && x2 === x)}
                showHighlight={this.props.highlights}
                highlightedSquares={this.props.highlightedSquares}
                y={y}
                x={x}
                state={this.props.state}
                parentCallback={validMove => this.props.parentCallback(y, x, validMove)}
                key={x}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}
