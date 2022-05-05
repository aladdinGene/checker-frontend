import React from 'react'
import './index.css'
// import { checkers, eq, boardString } from 'aima-checkers'
import { checkers, eq, crownRow, recursiveResult } from './Components/Path'
import { minimaxDecision, maximinDecision, alphaBetaSearch, betaAlphaSearch } from 'aima'
import Board from './Components/Board'
import CheckersGroup from './Components/CheckersGroup'
import Subtitles from './Components/Subtitles'
import AiSettings from './Components/AiSettings'
import NavBar from '../components/NavBar'

import {
  Stack
} from '@mui/material'

const config = {
  pruning: false,
  limits: {
    dumb: 1,
    intermediate: 3,
    smart: 4
  },
  highlights: true,
  pauseTime: 700 /* ms */
}

class App extends React.Component {
  constructor (props) {
    super(props)
    // initialize game state and ui configuration
    this.state = {
      state: checkers.initialState, // game state (cf. `checkers.js`)
      selectedChecker: [], // coordinates of the selected checker piece
      ai: { // whether the players are played by an ai and if so which one
        p: undefined,
        q: undefined
      },
      error: [], // user interaction errors to be shown as subtitles
      highlights: config.highlights, // whether possible actions are highlighted
      displayQueue: [], // contains action parts which still have to be displayed
      gameStarted: false,
      level: 1,
      firstPlayer: 'person',
      method: 'us'
    }
    // note that react state variables are accessed via `this.state` in general,
    // so the game state is accessed via `this.state.state`
  }

  render () {
    return (
      this.state.gameStarted ?
      <>
      <Stack
        minHeight='100vh'
        bgcolor='background.paper'
        justifyContent='space-between'
        alignItems='center'
      >
        <NavBar />
      <div className='app'>
        <Board
          highlightedSquares={
            checkers.actions(this.state.state)
              .filter(action => eq(action[0], this.state.selectedChecker))
              // .map(action => action[action.length - 1])
          }
          highlights={this.state.highlights}
          parentCallback={(y, x, validMove) => this.move(y, x, validMove)}
        />
        {['p', 'q'].map(player =>
          <CheckersGroup
            key={player}
            player={player}
            pieces={this.state.state[player]}
            selectedChecker={this.state.selectedChecker}
            highlightedCheckers={
              this.state.highlights &&
                this.state.state.player === player &&
                !this.state.ai[this.state.state.player]
                ? checkers.actions(this.state.state).map(action => action[0])
                : []
            }
            parentCallback={(y, x, royal) => this.highlight(y, x, royal, player)}
          />
        )}
        <Subtitles
          parentCallback={arg => {
            if ('highlights' in arg) {
              this.setState({ highlights: arg.highlights })
            } else if ('ai' in arg) {
              this.setState({ ai: { ...this.state.ai, [arg.ai[0]]: arg.ai[1] } })
              setTimeout(() => this.aiMove(), 0)
            }
          }}
          error={this.state.error}
          ai={this.state.ai}
          state={this.state.state}
          highlights={this.state.highlights}
          limits={config.limits}
          restart={() => {this.restart()}}
        />
      </div>
      </Stack>
      </> : <AiSettings setGameStart={(arg, method, level, player) => {
        this.setState({
          gameStarted : arg,
          level: Number(level),
          ai: {p:undefined,q:1},
          state: {...this.state.state, opponent: player==="person"?"q":"p", player: player==="person"?"p":"q", method: method},
          firstPlayer: player
        })
        setTimeout(() => {
          if(player === "person") this.step()
          else this.aiMove()
        }, 500)
      }}/>
    )
  }

  restart () {
    this.setState({
      ...this.state,
      state: {...checkers.initialState, opponent: this.state.firstPlayer==="person"?"q":"p", player: this.state.firstPlayer==="person"?"p":"q"}, // game state (cf. `checkers.js`)
      selectedChecker: [], // coordinates of the selected checker piece
      error: [], // user interaction errors to be shown as subtitles
      displayQueue: [], // contains action parts which still have to be displayed
    })
    setTimeout(() => {
      if(this.state.firstPlayer === "person") this.step()
      else this.aiMove()
    }, 500)
  }

  move (y, x, validMove) {
    if (validMove) {
      // when the user makes a manual move on one side, disable the ai for that side
      const ai = this.state.ai
      if (this.state.ai.p === undefined) ai.p = false
      else if (this.state.ai.q === undefined) ai.q = false
      this.setState({ ai: ai })
      // perform move from highlighted checker to selected square
      let subDisplayQueue = checkers.actions(this.state.state).filter(action =>
        eq(action[0], this.state.selectedChecker) &&
        eq(action[action.length - 1], [y, x])
      )[0]
      let temp_displayQueue = [], crowning = true
      if(!subDisplayQueue[0][2] && !crownRow(this.state.state, subDisplayQueue[subDisplayQueue.length - 1])) {
        temp_displayQueue = [subDisplayQueue.map(point => [point[0], point[1], false])]
        crowning = false
      } else {
        subDisplayQueue[subDisplayQueue.length - 1][2] = true
        temp_displayQueue.push(subDisplayQueue)
      }
      this.setState({
        state: {...this.state.state, displayQueue: temp_displayQueue, crowning: crowning},
        displayQueue: temp_displayQueue
      })
      setTimeout(() => this.step(), 0)
    } else this.setState({ error: ['invalid move', this.state, y, x] })
  }

  highlight (y, x, royal, player) {
    if (
      player === this.state.state.player &&
      checkers.actions(this.state.state).some(action => eq(action[0], [y, x]))
    ) {
      this.setState({
        selectedChecker: [y, x, royal],
        error: []
      })
    } else {
      this.setState({ error: ['invalid checker', this.state, y, x, player] })
    }
  }

  step () {
    console.log("Step")
    if (!checkers.terminalTest(this.state.state) && this.state.displayQueue.length > 0) {
      const action = this.state.displayQueue[0]
      if (this.state.displayQueue.length > 1 || action.length > 2) {
        setTimeout(() => this.step(), config.pauseTime)
      } else {
        setTimeout(() => this.aiMove(), config.pauseTime)
      }
      console.log(moveToString(this.state.state.player, action))
      // console.log(checkers.result(this.state.state, action.slice(0, 2)))
      this.setState({
        state: {
          ...recursiveResult(this.state.state, action.slice(0, 2), true),
          player: action.length <= 2 && this.state.displayQueue.length <= 1
            ? this.state.state.opponent
            : this.state.state.player,
          opponent: action.length <= 2 && this.state.displayQueue.length <= 1
            ? this.state.state.player
            : this.state.state.opponent,
          method: this.state.state.method,
          crowning: this.state.state.crowning
        },
        displayQueue: [
          ...action.length > 2 ? [action.slice(1)] : [],
          ...this.state.displayQueue.slice(1)
        ],
        error: [],
        selectedChecker: []
      })
      // console.log(boardString(this.state.state))
    }
  }

  aiMove () {
    console.log("aiMove")
    const search = {
      p: config.pruning ? alphaBetaSearch : minimaxDecision,
      q: config.pruning ? betaAlphaSearch : maximinDecision
    }
    // console.log(this.state.state)
    const randAction = actions => actions[Math.floor(Math.random() * actions.length)]
    const move = player => {
      if(!checkers.terminalTest(this.state.state)){
        let subDisplayQueue = [this.state.ai[player] === 'random'
                              // random move
                              ? randAction(checkers.actions(this.state.state))[0]
                              // minimax / maximin move
                              : search[player](checkers, this.state.state, this.state.level).action][0]
                      console.log(subDisplayQueue)
        let temp_displayQueue = [], crowning = true
        if(!subDisplayQueue[0][2] && !crownRow(this.state.state, subDisplayQueue[subDisplayQueue.length - 1])) {
          temp_displayQueue = [subDisplayQueue.map(point => [point[0], point[1], false])]
          crowning = false
        } else {
          subDisplayQueue[subDisplayQueue.length - 1][2] = true
          temp_displayQueue.push(subDisplayQueue)
        }
        this.setState({
          displayQueue: temp_displayQueue,
          state: {...this.state.state, crowning}
        })
        setTimeout(() => this.step(), config.pauseTime + config.animationTime)
      }
    }
    if (this.state.ai.p && this.state.state.player === 'p') {
      move('p')
    } else if (this.state.ai.q && this.state.state.player === 'q') {
      move('q')
    }
  }
}

const moveToString = (player, action) =>
  (player === 'p' ? 'brown: ' : 'beige: ') +
  action.map(([y, x]) => y + ', ' + x).join(' -> ')

export default App
