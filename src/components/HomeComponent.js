import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import {
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Typography
} from '@mui/material'
import ArrowIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { ReactComponent as Logo } from '../svgIcons/knightLogo.svg'
import SettingsSubmenu from './SettingsSubmenu'
import TimeControlSubmenu from './TimeControlSubmenu'
import MadeByComponent from './MadeByComponent'
import { WarningRounded } from '@mui/icons-material'
import logo from '../assets/logo.png'

function HomeComponent ({
  toast,
  setTheme,
  theme,
  setUsername,
  username,
  online,
  sound,
  setSound
}) {
  const [roomName, setRoomName] = useState('')
  const [entered, setEntered] = useState(false)
  const [settingsMenu, setSettingsMenu] = useState(false)
  const [timeControlMenu, setTimeControlMenu] = useState(false)

  const hoverStyles = text => {
    return {
      flexGrow: 0,
      width: '100%',
      '&:hover': {
        '&::after': {
          content: text,
          marginLeft: '5px'
        }
      }
    }
  }
  const navigate = useNavigate()
  const handleSubmit = () => {
    if (roomName.length === 6) {
      navigate('room', {
        state: {
          roomName
        }
      })
    }
  }

  return (
    <Box
      height='100vh'
      overflow='hidden'
      sx={{
        transition: 'background-color 200ms ease-in-out'
      }}
      px={3}
      bgcolor='background.paper'
    >
      <Stack alignItems='center' justifyContent='space-between'>
        <Fade onEntered={() => setEntered(1)} in timeout={250}>
          <Stack
            alignItems='center'
            justifyContent='center'
            flexGrow={1}
            textAlign='center'
            py={1}
            mt={1}
          >
            <img src={logo} alt="logo" className='logoImg' />
          </Stack>
        </Fade>
        <Box position='relative'>
          <Slide
            direction='right'
            in={entered >= 1 && !settingsMenu && !timeControlMenu}
            onEntered={() => setEntered(2)}
            timeout={{ enter: 200, exit: 100 }}
          >
            <Stack pt={5} pb={4} spacing={1} alignItems='center'>
            <Button
                color='primary'
                type='submit'
                variant='outlined'
                sx={hoverStyles('"🖥️"')}
                // onClick={() => navigate('local-cpu-settings')}
                onClick={() => navigate('local-cpuplayer')}
              >
                Play with Computer
              </Button>
              {/* <Button
                color='primary'
                type='submit'
                variant='outlined'
                sx={hoverStyles('"🧑🏻‍🤝‍🧑🏽"')}
                onClick={() => navigate('local-multiplayer')}
              >
                Pass and Play
              </Button> */}
              <Divider />
              {online ? (
                <>
                  <Button
                    // onClick={() => setTimeControlMenu(true)}
                    color='primary'
                    type='submit'
                    variant='outlined'
                    sx={hoverStyles('"➕"')}
                  >
                    Create Room
                  </Button>
                  <TextField
                    onKeyDown={e =>
                      e.key === 'Enter' &&
                      roomName.length === 6 &&
                      handleSubmit()
                    }
                    color='secondary'
                    variant='outlined'
                    size='small'
                    label='Join Room'
                    value={roomName}
                    autoComplete='off'
                    onChange={e => {
                      if (
                        e.target.value.match(/^[0-9a-zA-Z]*$/) &&
                        e.target.value.length <= 6
                      ) {
                        setRoomName(e.target.value.toUpperCase())
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            color='secondary'
                            disabled={roomName.length !== 6}
                            // onClick={handleSubmit}
                            edge='end'
                            title='Join'
                          >
                            <ArrowIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  {/* <Button
                    onClick={() => navigate('matchmake')}
                    color='secondary'
                    type='submit'
                    variant='outlined'
                    sx={hoverStyles('"🔎"')}
                  >
                    Find Game
                  </Button> */}
                </>
              ) : (
                <Stack
                  alignItems={'center'}
                  borderRadius={1}
                  border={'1px solid'}
                  borderColor='text.secondary'
                  boxSizing={'border-box'}
                  p={2}
                  color={'text.secondary'}
                  textAlign='center'
                  maxWidth={'300px'}
                >
                  <WarningRounded />
                  <Typography fontSize={'0.9rem'} variant='overline'>
                    No network connection :(
                  </Typography>
                  <Typography variant='caption'>
                    Connect to the internet to play online
                  </Typography>
                </Stack>
              )}
              <Divider />

              <Button
                onClick={() => setSettingsMenu(true)}
                color='primary'
                type='submit'
                variant='outlined'
                sx={hoverStyles('"⚙️"')}
              >
                Settings
              </Button>
            </Stack>
          </Slide>
          <Slide
            unmountOnExit
            direction='left'
            in={entered >= 1 && settingsMenu}
            onEntered={() => setEntered(2)}
            timeout={{ enter: 200, exit: 100 }}
          >
            <Box width='100%' top='0' position='absolute'>
              <SettingsSubmenu
                setTheme={setTheme}
                toast={toast}
                setUsername={setUsername}
                theme={theme}
                username={username}
                sound={sound}
                setSound={setSound}
                setSettingsMenu={setSettingsMenu}
              />
            </Box>
          </Slide>
          <Slide
            unmountOnExit
            direction='left'
            in={entered >= 1 && timeControlMenu}
            onEntered={() => setEntered(2)}
            timeout={{ enter: 200, exit: 100 }}
          >
            <Box width='100%' top='0' position='absolute'>
              <TimeControlSubmenu setTimeControlMenu={setTimeControlMenu} />
            </Box>
          </Slide>
        </Box>
      </Stack>
    </Box>
  )
}

export default HomeComponent
