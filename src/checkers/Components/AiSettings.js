import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material'
import ArrowIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { WarningRounded } from '@mui/icons-material'
import brazil from '../../assets/brazil.png'
import us from '../../assets/us.png'
import logo from '../../assets/logo.png'
import NavBar from '../../components/NavBar'

function AiSettings (props) {
  const [level, setLevel] = useState('1')
  const [method, setMethod] = useState('us')
  const [player, setPlayer] = useState('person')
  const levelChange = (event) => {
    setLevel(event.target.value);
  };
  const methodChange = (event) => {
    setMethod(event)
  }
  const playerChange = (event) => {
    setPlayer(event.target.value)
  }

  return (
    <Box bgcolor='background.paper' minHeight='100vh'>
      <Stack height='100%' alignItems='center' justifyContent='space-between'>
        <NavBar />
        <Box position='relative'>
          <Stack
            alignItems='center'
            justifyContent='center'
            flexGrow={1}
            textAlign='center'
            py={2}
            mx={2}
          >
            <img src={logo} alt="logo" className='logoImg' />
          </Stack>
          <Stack pt={5} pb={4} spacing={2} alignItems='center' direction="row">
            <FormControl style={{color:'#FFF'}}>
              <FormLabel>Choose Method</FormLabel>
              <Stack pt={1} spacing={2} alignItems='center' direction="row">
                <Button
                  color='primary'
                  type='submit'
                  variant='outlined'
                  onClick={() => methodChange('us')}
                >
                  <Radio
                    checked={method === 'us'}
                    value="us"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'A' }}
                  />
                  American Checkers
                  <img src={us} alt="us" className='flag-icon' />
                </Button>

                <Button
                  color='primary'
                  type='submit'
                  variant='outlined'
                  onClick={() => methodChange('br')}
                >
                  <Radio
                    checked={method === 'br'}
                    value="br"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'B' }}
                  />
                  Brazilian Checkers
                  <img src={brazil} alt="brazil" className='flag-icon' />
                </Button>
              </Stack>
            </FormControl>
          </Stack>
          <Stack>
            <FormControl style={{color:'#FFF'}}>
              <FormLabel id="demo-row-radio-buttons-group-label">Choose Computer Level</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={levelChange}
              >
                <FormControlLabel value="weak" control={<Radio checked={level === '1'} value='1' />} label="Weak" />
                <FormControlLabel value="beginner" control={<Radio checked={level === '2'} value='2' />} label="Beginner" />
                <FormControlLabel value="hard" control={<Radio checked={level === '4'} value='4' />} label="Hard" />
                <FormControlLabel value="expert" control={<Radio checked={level === '5'} value='5' />} label="Expert" />
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack mt={3}>
            <FormControl style={{color:'#FFF'}}>
              <FormLabel id="demo-row-radio-buttons-group-label">Choose First Player</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={playerChange}
              >
                <FormControlLabel value="weak" control={<Radio checked={player === 'person'} value='person' />} label="Person" />
                <FormControlLabel value="beginner" control={<Radio checked={player === 'computer'} value='computer' />} label="Computer" />
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack mt={5}>
              <Button
                color='primary'
                type='submit'
                variant='outlined'
                onClick={() => {props.setGameStart(true, method, level, player)}}
              >
                Start Game
              </Button>
            </Stack>
          </Box>
      </Stack>
    </Box>
  )
}

export default AiSettings
