import React from 'react'
import { checkers } from 'aima-checkers'
import HelpMessage from './HelpMessage'
import ErrorMessage from './ErrorMessage'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import {
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Typography
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default class Subtitles extends React.Component {
  constructor () {
    super()
    this.state = { help: false }
  }

  render () {
    const welcomeCallback = (pq, type) => type === 'help'
      ? this.setState({ help: true })
      : this.props.parentCallback({ ai: [pq, type] })
    const helpCallback = action => action === 'hide'
      ? this.setState({ help: false })
      : this.props.parentCallback({ highlights: !this.props.highlights })

    return (
      <div className={'subtitles' + (!this.state.help ? ' marginal' : '')}>
        {/* {this.state.help && (
          <HelpMessage
            highlights={this.props.highlights}
            limits={this.props.limits}
            parentCallback={action => helpCallback(action)}
          />)}
        {this.props.error.length > 0 && !this.state.help && (
          <ErrorMessage
            error={this.props.error}
            parentCallback={type => this.setState({ help: true })}
          />)} */}
        {this.props.ai.p === undefined && !this.state.help && (
          <WelcomeMessage
            p='p'
            parentCallback={type => welcomeCallback('p', type)}
            error={this.props.error}
          />)}
        {this.props.ai.p !== undefined && this.props.ai.q === undefined && !this.state.help && (
          <WelcomeMessage
            p='q'
            parentCallback={type => welcomeCallback('q', type)}
            error={this.props.error}
          />)}
        {checkers.terminalTest(this.props.state) && (
          <CongratulationMessage state={this.props.state} restart={this.props.restart} />)}
      </div>
    )
  }
}

class WelcomeMessage extends React.Component {
  render () {
    return (
      <div>
        {/* {this.props.error.length === 0 && (
          <div>
            <div>
              <p>
                {this.props.p === 'p' ? 'Brown starts.' : 'Beige is next.'}
              </p>
            </div>
            <div>
              <span onClick={() => this.props.parentCallback('help')}>
                Read the rules.
              </span>
            </div>
          </div>)}
        <div>
          <p>
            Select an AI for the brown side:
          </p>
        </div> */}
        {/* <div>
          <span onClick={() => this.props.parentCallback('random')}>
            Random Moves AI
          </span>
        </div>
        <div>
          <span onClick={() => this.props.parentCallback('dumb')}>
            Dumb AI
          </span>
        </div>
        <div>
          <span onClick={() => this.props.parentCallback('intermediate')}>
            Intermediate AI
          </span>
        </div>
        <div>
          <span onClick={() => this.props.parentCallback('smart')}>
            Smart AI
          </span>
        </div> */}
      </div>
    )
  }
}

const CongratulationMessage = (props) => {
  const hoverStyles = (text) => {
    return {
      flexGrow: 0,
      '&:hover': {
        '&::after': {
          content: text,
          marginLeft: '5px'
        }
      }
    }
  }
  const navigate = useNavigate()
  return (
    <Box className='end-wrap'>
      <p>
        {checkers.heuristic(props.state) > 0 ? 'Congratulations! You win!' : 'Computer wins!'}
      </p>
      <Stack direction="column" spacing={2}>
        <Button
          color='primary'
          type='submit'
          variant='outlined'
          width='200px'
          sx={hoverStyles('"🏠"')}
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button
          color='primary'
          type='submit'
          variant='outlined'
          width='200px'
          sx={hoverStyles('"🔄"')}
          onClick={props.restart}
        >
          Restart
        </Button>
      </Stack>
    </Box>
  )
}
