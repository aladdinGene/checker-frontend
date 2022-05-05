import { Game } from 'aima'

export const checkers = new Game({
  initialState: {
    // p: [
    //   [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
    //   [1, 1, false], [1, 3, false], [1, 5, false], [1, 7, false],
    //   [2, 0, false], [2, 2, false], [2, 4, false], [2, 6, false]
    // ],
    // q: [
    //   [5, 1, false], [5, 3, false], [5, 5, false], [5, 7, false],
    //   [6, 0, false], [6, 2, false], [6, 4, false], [6, 6, false],
    //   [7, 1, false], [7, 3, false], [7, 5, false], [7, 7, false]
    // ],
    // p: [
    //   [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
    //   [1, 1, false], [1, 3, false], [1, 5, false], [1, 7, false],
    //   [2, 0, false], [2, 2, false], [2, 4, false], [3, 7, true]
    // ],
    // q: [
    //   [3, 5, false], /* [6, 4, false], */ [6, 2, false], [5, 7, false],
    //   [6, 6, false], [5, 1, false],
    //   [7, 1, false], [7, 5, false], [7, 7, false]
    // ],
    // p: [
    //   [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
    //   [1, 1, false], [1, 3, false], [1, 5, false], [1, 7, false],
    //   [2, 0, false], [2, 2, false], [2, 4, false], [3, 7, false]
    // ],
    // q: [
    //   [4, 6, false], [6, 4, false], [6, 2, false], [5, 7, false],
    //   [6, 6, false], /*[5, 1, false],*/
    //   [7, 1, false], [7, 5, false], [7, 7, false]
    // ],
    // p: [
    //   // [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
    //   [3, 1, false], [1, 3, false], [1, 5, false], [1, 7, false],
    //   [1, 1, false], [2, 2, false], /* [3, 3, false], */ [2, 6, false]
    // ],
    // q: [
    //   [2, 4, false], [5, 3, false], [5, 5, false], [5, 7, false],
    //   [6, 0, false], [6, 2, false], [6, 4, false], [6, 6, false],
    //   [7, 1, false], [7, 3, false], [7, 5, false], [7, 7, false]
    // ],
    // p: [
    //   // [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
    //   [3, 1, false],/* [1, 3, false],*/ [1, 5, false], [1, 7, false],
    //   [1, 1, false],/* [2, 2, false], *//* [3, 3, false], */ [2, 4, false]
    // ],
    // q: [
    //   [2, 6, false], [5, 3, false], [5, 5, false], [5, 7, false],
    //   [6, 0, false], [6, 2, false], [6, 4, false], [6, 6, false],
    //   [7, 1, false], [7, 3, false], [7, 5, false], [7, 7, false]
    // ],
    p: [
      [0, 0, false], [0, 2, false], [0, 4, false], [0, 6, false],
      [1, 1, false], [1, 3, false], [1, 5, false], [1, 7, false],
      [3, 1, false], [2, 2, false], [2, 4, false], [2, 6, false]
    ],
    q: [
      [5, 1, false], [4, 2, false], [4, 4, false],
      [6, 0, false], [6, 2, false], [6, 4, false], [6, 6, false],
      [7, 1, false], [7, 3, false], [7, 7, false]
    ],
    player: 'p',
    opponent: 'q',
    method: 'us',
    crowning: true
  },
  player: state => state.player,
  actions: state => {
    // console.log(state[state.player], state.player)
    var aaa = enforceJumping(state[state.player].flatMap(pos => [
      ...movePaths(state, pos),
      ...jumpPaths(state, pos)
    ]), state)
  console.log(aaa)
  return aaa;
},
  result: (state, action) => {
    // console.log("Result")
    var aaa = recursiveResult(state, action, true)
    // console.log(aaa);
    return aaa;
  },
  terminalTest: state =>
    state.p.length === 0 ||
    state.q.length === 0 ||
    checkers.actions(state).length === 0,
  utility: state => state.p.length - state.q.length,
  heuristic: state => state.p.length - state.q.length
})

export const movePaths = (state, [y, x, royal]) =>{
  var aaa = directions(royal, state, true, [y, x])
    .map(direction => [[y, x, royal], end(state, [y, x, royal], direction)])
    .filter(([start, end]) => onBoard(end) && !occupied(state, end)
  )
  // console.log("movePaths", aaa)
  return aaa 
}

export const directions = (royal, state, move, [y, x]) => {
  if(state.method === 'us') {
    if(move) return [[+1, -1], [+1, +1], ...royal ? [[-1, -1], [-1, +1]] : []]
    else return [[+2, -2], [+2, +2], ...royal ? [[-2, -2], [-2, +2]] : []]
  } else if( state.method === 'br') {
    if(royal) {
      let _directions = [],
          offset_y = 1,
          offset_x = 1,
          offsets = [],
          offset = Math.min(offset_x, offset_y),
          move_directions = [],
          jump_directions = [];
      offset_y = 7 - y;
      offset_x = 7 - x;
      offset = Math.min(offset_x, offset_y);
      offsets.push({offset, yStep: 1, xStep: 1})

      offset_y = 7 - y;
      offset_x = x;
      offset = Math.min(offset_x, offset_y);
      offsets.push({offset, yStep: 1, xStep: -1})
      
      offset_y = y;
      offset_x = x;
      offset = Math.min(offset_x, offset_y);
      offsets.push({offset, yStep: -1, xStep: -1})
      
      offset_y = y;
      offset_x = 7 - x;
      offset = Math.min(offset_x, offset_y);
      offsets.push({offset, yStep: -1, xStep: 1})
      // eslint-disable-next-line array-callback-return
      offsets.map((offsetPos) => {
        for(let i=1;i<=offsetPos.offset;i++) {
          if(occupiedBy(state, [y + i * offsetPos.yStep, x + i * offsetPos.xStep], state.player)) {
            // console.log(i, "Hi.")
            break;
          } else if(occupiedBy(state, [y + i * offsetPos.yStep, x + i * offsetPos.xStep], state.opponent)){
            // console.log(i, "Hi again.")
            if(!occupied(state, [y + (i + 1) * offsetPos.yStep,x + (i + 1) * offsetPos.xStep])) jump_directions.push([(i + 1) * offsetPos.yStep * direction(state.player), (i + 1) * offsetPos.xStep])
            break;
          }
          move_directions.push([i * offsetPos.yStep * direction(state.player), i * offsetPos.xStep])
        }
      })

      if(jump_directions.length > 0) _directions = _directions.concat(jump_directions)
      else _directions = _directions.concat(move_directions)
      
      console.log(move, _directions)
      return _directions;
    } else {
      if(move) return [[+1, -1], [+1, +1]]
      else return [[+2, -2], [+2, +2], [-2, -2], [-2, +2]]
    }
  }
}

export const end = (state, [y, x, royal], [forward, sideward], steps = 1) => {
var aaa = [
  y + forward * direction(state.player) * steps,
  x + sideward * steps,
  ...typeof royal === 'undefined'
    ? []
    : [crowned(state, [y, x, royal], end(state, [y, x], [forward, sideward], steps))]
]
// console.log("End", aaa)
return aaa;
}

export const crowned = (state, [y1, x1, royal], end) =>
  (royal || crownRow(state, end))
  && state.crowning/* ||
  regicide(state, [y1, x1, royal], end) */

export const crownRow = (state, [y, x]) => y === 3.5 + 3.5 * direction(state.player)

export const regicide = (state, start, end) => (dist(start, end) / 2 === 2 &&
    state[state.opponent].find(pos => eq(pos, intermediate(start, end)))[2])

export const eq = ([y1, x1], [y2, x2]) => y1 === y2 && x1 === x2

export const direction = player => player === 'p' ? +1 : -1

export const dist = ([y1, x1], [y2, x2]) => Math.abs(y2 - y1) + Math.abs(x2 - x1)

export const intermediate = ([y1, x1], [y2, x2]) => [(y1 + y2) / 2, (x1 + x2) / 2]

export const onBoard = ([y, x]) => y >= 0 && y <= 7 && x >= 0 && x <= 7

export const occupied = (state, pos) => ['p', 'q'].some(p => occupiedBy(state, pos, p))

export const occupiedBy = (state, posA, player) => state[player].some(posB => eq(posA, posB))
const test = (state, start, end) => {
  var stepResult_val = stepResult(state, [start, end], false)
  // console.log(stepResult_val, end)
  var aaa = [...jumpPaths(/* state = */ stepResult_val, /* start = */ end)
.map(jumpPath => [start, ...jumpPath])];
if(aaa.length) console.log("Again Jump", aaa);
return aaa;
}
export const jumpPaths = (state, start) => {
  var aaa = jumps(state, start)
    .map(([start, end]) => [
      [start, end],
      ...!crownRow(state, end) || (state.method === 'br') || start[2] /* royal */ /* || regicide(state, start, end) */
        ? test(state, start, end)
        : []
    ])
    // .map(temp_paths => temp_paths.filter(temp_path => temp_paths.some(pos => (pos.length !== temp_path.length) &&
    //     (pos[pos.length - 1] === temp_path[pos.length - 1]) &&
    //     (pos[0] === temp_path[0])
    // )))
    // .map(path => (path.length>0)?path[path.length - 1]:[])
    if(aaa.length) 
    console.log("JumpPaths", aaa)
  return aaa;
  }


export const jumps = (state, [y, x, royal]) => {
  var aaa = directions(royal, state, false, [y, x])
    .map(direction => [[y, x, royal], end(state, [y, x], direction, 1)])
    .filter(([start, end]) =>
      onBoard(end) &&
      !occupied(state, end) &&
      occupiedBy(state, intermediate(start, end), state.opponent))
    .map(([start, end]) => [start, [...end, crowned(state, start, end)]])
    // if(aaa.length) console.log("jumps", aaa)
  return aaa;
}

export const stepResult = (state, [start, end], nextPlayer) => {
  // console.log([...state[state.player].filter(pos => !eq(pos, start)), end])
var aaa = {
  [state.player]: [...state[state.player].filter(pos => !eq(pos, start)), end],
  [state.opponent]: state[state.opponent].filter(pos => !(jumpAction(state, [start, end]) && isCaptured(pos, [start, end]))),
  player: nextPlayer ? state.opponent : state.player,
  opponent: nextPlayer ? state.player : state.opponent,
  method: state.method,
  crowning: state.crowning
}
return aaa;
}

export const casualty = (pos, action) =>
  dist(...action) / 2 === 2 && eq(pos, intermediate(...action))

export const jumpAction = (state, action) => {
  // console.log(action)
  const start = action[0],
        end = action[1]
  const offset = Math.abs(end[0] - start[0])
  const xStep = (end[1] - start[1]) / offset,
        yStep = (end[0] - start[0]) / offset;
  // console.log(offset, xStep, yStep)
  for(let i=1;i<offset;i++) {
    if(occupied(state, [start[0] + yStep * i, start[1] + xStep * i])) {
      // console.log('This is jump action')
      return true;
    }
  }
  return false;
}

export const isCaptured = (pos, [start, end]) => {
  const aaa = (Math.sign(end[0] - pos[0]) === Math.sign(pos[0] - start[0])) &&
              (Math.sign(end[1] - pos[1]) === Math.sign(pos[1] - start[1])) &&
              (Math.abs(end[0] - pos[0]) === Math.abs(end[1] - pos[1])) &&
              (Math.abs(start[0] - pos[0]) === Math.abs(start[1] - pos[1]))
  if(aaa) return true;
  else return false;
}

export const enforceJumping = (actions, state) => {
  var aaa;
  console.log(actions)
  const hasJump = actions.some((action) => jumpAction(state, action))
  aaa = actions.filter((action) =>
    !hasJump ||
    jumpAction(state, action)
  )
  // console.log(aaa)
  return aaa;
}

export const recursiveResult = (state, action, nextPlayer = false) =>
  action.length >= 2
    ? stepResult(
      recursiveResult(state, action.slice(0, action.length - 1)),
      [action[action.length - 2], action[action.length - 1]],
      nextPlayer
    )
    : state

export const boardString = state => board(state).map(row => row.join('')).reverse().join('\n')

export const board = state =>
  [0, 1, 2, 3, 4, 5, 6, 7].map(y =>
    [0, 1, 2, 3, 4, 5, 6, 7].map(x =>
      state.p.some(pos => eq(pos, [y, x]))
        ? state.p.find(pos => eq(pos, [y, x]))[2]
          ? 'X'
          : 'x'
        : state.q.some(pos => eq(pos, [y, x]))
          ? state.q.find(pos => eq(pos, [y, x]))[2]
            ? 'O'
            : 'o'
          : ' '
    )
  )
