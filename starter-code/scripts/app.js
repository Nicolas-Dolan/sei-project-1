function init() {
  
  let gameActive = false

  const startBtn = document.querySelector('.start')
  const startScrn = document.querySelector('.startScrn')
  const game = document.querySelector('.game')

  startBtn.addEventListener('click', startGame)

  function startGame() {
  // GAME VARIABLES

    let playerIndex = 19
    let score = 0
    let round = 1
    const ghost1Index = 25
    gameActive = true
    console.log('Game active?', gameActive)

    //  DOM VARIABLES
    const width = 18
    const grid = document.querySelector('.grid')
    // const gridItems = document.querySelectorAll('.grid-item')
    const squares = []
    const wallIndices = []
    let bigCoinsIndices = [21, 78, 80, 82]
    const scoreViewer = document.querySelector('.score')
    const roundViewer = document.querySelector('.round')
    const resetBtn = document.querySelector('.reset')
    const endGameBtn = document.querySelector('.endGame')
    const gameOverScrn = document.querySelector('.gameOverScrn')
    const playAgainBtn = document.querySelector('.playAgain')
    const form = document.querySelector('#username')
    const textInput = document.querySelector('#textInput')
    const myStorage = window.localStorage
    const scores = document.querySelector('.scores')
    // console.log(scoreViewer)
  

    //FUNCTIONS

    game.style.display = 'flex'
    startScrn.style.display = 'none'

    scoreViewer.innerHTML = score
    roundViewer.innerHTML = round

    // loop as many times as width times the width to fill the grid
    Array(width * width).join('.').split('.').forEach(() => {
    // create 
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })

    // places player at the starting position when grid has finished building
    squares[playerIndex].classList.add('player')
    function handleKeyDown(e) {
      switch (e.keyCode) {
        case 39:
          if (playerIndex === 161) {
            playerIndex = 144
          } else if (playerIndex % width < width - 1 && !squares[playerIndex + 1].classList.contains('wall')) {
            playerIndex++
          }
          break
        case 37:
          if (playerIndex === 144) {
            playerIndex = 161
          } else if (playerIndex % width > 0 && !squares[playerIndex - 1].classList.contains('wall')) {
            playerIndex--
          }
          break
        case 40:
          if (playerIndex + width < width * width && !squares[playerIndex + width].classList.contains('wall')) {
            playerIndex += width
          }
          break
        case 38:
          if (playerIndex - width >= 0 && !squares[playerIndex - width].classList.contains('wall')) {
            playerIndex -= width
          } 
          break
        default:
          console.log('player shouldnt move')
      }
      squares.forEach(square => square.classList.remove('player'))
      squares[playerIndex].classList.add('player')
      playerMoved()
    // console.log('current player index is' , playerIndex)
    // console.log('score', score)
    }

    // The below functions all create the features on the board

    function addPerimeterWalls() {
      let i = 0
      for (i = 0; i < width * width; i++) {
        if (i >= 0 && i < width) {
          wallIndices.push(i)
        } else if (i >= width * width - width && i < width * width) {
          wallIndices.push(i)
        } else if (i % width === 0 || (i + 1) % width === 0) {
          wallIndices.push(i)
        }
      }
    }

    function drawHorizontalWalls(min, max) {
      let i = min
      for (i = min; i <= max; i++) {
        wallIndices.push(i)
      }
    }

    function drawBlock(min, max) {
      const n = Math.ceil((max + 1) / width) - Math.ceil((min + 1) / width) + 1
      let i = 0
      for (i = 0; i < n; i++) {
        drawHorizontalWalls(min + width * (i), max - width * (n - (i + 1)))
      }
    }

    addPerimeterWalls()
    drawBlock(92, 105)
    drawBlock(114, 132)
    drawBlock(26, 63)
    drawBlock(38, 60)
    drawBlock(47, 69)
    drawBlock(127, 130)
    drawBlock(163, 184)
    drawBlock(218, 238)
    drawBlock(272, 285)
    drawBlock(119, 137)
    drawBlock(134, 153)
    drawBlock(139, 142)
    drawBlock(175, 196)
    drawBlock(168, 186)
    drawBlock(173, 191)
    drawBlock(187, 190)
    drawBlock(206, 225)
    drawBlock(229, 249)
    drawBlock(222, 258)
    drawBlock(227, 263)
    drawBlock(259, 262)
    // wallIndices.remove(144)
    wallIndices.forEach((element, index, array) => {
      if (element === 144 || element === 161) {
        array.splice(index, 2)
      }
    })

    // console.log('wallIndices', wallIndices)

    // adds walls to grid
    wallIndices.forEach((element) => squares[element].classList.add('wall'))

    //adds big coins to grid
    function addBigCoins() {
      bigCoinsIndices.forEach((element) => {
        if (!squares[element].classList.contains('wall')) {
          squares[element].classList.add('bigCoin')
        }
      })
    }
    addBigCoins()
  

    //adds small coins to grid
    function addSmallCoins() {
      squares.forEach((element, index) => {
        if (!squares[index].classList.contains('wall') && !squares[index].classList.contains('player') && !squares[index].classList.contains('bigCoin')) {
          squares[index].classList.add('smallCoin')
        }
      }) 
    }
    // addSmallCoins()

    // adds index number to each grid item
    squares.forEach((element, index) => element.innerHTML = index)

    //the below functions contribute towards the game mechanics

    function gainPoints(amount) {
      score += amount
      scoreViewer.innerHTML = score
    }

    function eatSmallCoin() {
      if (squares[playerIndex].classList.contains('smallCoin')) {
        squares[playerIndex].classList.remove('smallCoin')
        gainPoints(10)
      }
    }

    function eatBigCoin() {
      if (squares[playerIndex].classList.contains('bigCoin')) {
        squares[playerIndex].classList.remove('bigCoin')
        gainPoints(50)
      }
    }

    function playerMoved() {
      eatSmallCoin()
      eatBigCoin()
      checkCoins()
      checkGhost()
    // console.log('number of coins remaining', checkCoins())
    }

    function checkCoins() {
      let counter = 0
      squares.map((element) => {
        if (element.classList.contains('smallCoin') || element.classList.contains('bigCoin')) {
          counter++
        // console.log('element', element, 'total', counter)
        }
        return counter
      })
      if (counter < 1) {
        nextRound()
        console.log('start next round')
      }
    // console.log('number of coins remaining', checkCoins())
    }

    function nextRound() {
      squares[playerIndex].classList.remove('player')
      playerIndex = 19
      squares[playerIndex].classList.add('player')
      bigCoinsIndices = [84, 86]
      removeGhosts()
      addGhosts()
      addBigCoins()
      addSmallCoins()
      round++
      roundViewer.innerHTML = round
      console.log('round', round)

    }

    function reset() {
      squares[playerIndex].classList.remove('player')
      playerIndex = 19
      squares[playerIndex].classList.add('player')
      bigCoinsIndices = [78, 80, 82]
      removeGhosts()
      addGhosts()
      addBigCoins()
      addSmallCoins()
      round = 1
      score = 0
      roundViewer.innerHTML = round
      scoreViewer.innerHTML = score
      console.log('round', round)
    }

    function gameOver() {
      game.style.display = 'none'
      gameOverScrn.style.display = 'flex'
      const scoreViewer2 = document.querySelector('body > div.gameOverScrn > p > span')
      scoreViewer2.innerHTML = score
      gameActive = false
      generateLeaderBd()
    }

    function playAgain() {
      gameOverScrn.style.display = 'none'
      game.style.display = 'flex'
      reset()
      gameActive = true
    }

    function usernameInput() {
      const username = textInput.value
      localStorage.setItem(username, score)
      console.log('Username', username, 'Score', score)
      console.log('Storage', myStorage)
      generateLeaderBd()
    }

    function generateLeaderBd() {
      const leaderboard = Object.entries(myStorage).map((element) => {
        return element = [element[0], parseInt(element[1])]
      }).sort((a,b) => b[1] - (a[1]))
      console.log('leaderboard', leaderboard)
      console.log('name', leaderboard[0][0], 'score', leaderboard[0][1])
      document.querySelector('.scores1 .name').innerHTML = leaderboard[0][0]
      document.querySelector('.scores1 .userScore').innerHTML = leaderboard[0][1]
      document.querySelector('.scores2 .name').innerHTML = leaderboard[1][0]
      document.querySelector('.scores2 .userScore').innerHTML = leaderboard[1][1]
      document.querySelector('.scores3 .name').innerHTML = leaderboard[2][0]
      document.querySelector('.scores3 .userScore').innerHTML = leaderboard[2][1]
      document.querySelector('.scores4 .name').innerHTML = leaderboard[3][0]
      document.querySelector('.scores4 .userScore').innerHTML = leaderboard[3][1]
      document.querySelector('.scores5 .name').innerHTML = leaderboard[4][0]
      document.querySelector('.scores5 .userScore').innerHTML = leaderboard[4][1]
    }

    function addGhosts() {
      squares[ghost1Index].classList.add('ghostAny')
      squares[ghost1Index].classList.add('ghost1')
    }
    addGhosts()

    function removeGhosts() {
      squares[ghost1Index].classList.remove('ghostAny')
      squares[ghost1Index].classList.remove('ghost1')
    }

    function checkGhost() {
      if (playerIndex === ghost1Index) {
        gameOver()
      }
    }

    function ghostMove(ghostIndex, ghost) {

      let lastDirection = ''
      let moveCounter = 0
      let wayClear = true

      function firstMove() {
        const random = Math.floor(Math.random() * (4 - 1 + 1)) + 1
        switch (random) {
          case 1:
            lastDirection = 'right'
            break
          case 2:
            lastDirection = 'left'
            break
          case 3:
            lastDirection = 'up'
            break
          case 4:
            lastDirection = 'down'
            break
        }
      }

      function chooseMove() {
        if (lastDirection === 'right') {
          moveRight()
          if (wayClear === false) {
            const random = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random === 1) {
              moveUp()
              if (wayClear === false) {
                moveDown()
              }
            } else if (random === 2) {
              moveDown()
              if (wayClear === false) {
                moveUp()
              }
            }
          }
          if (wayClear === false) {
            moveLeft()
          }
        } else if (lastDirection === 'left') {
          moveLeft()
          if (wayClear === false) {
            const random = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random === 1) {
              moveUp()
              if (wayClear === false) {
                moveDown()
              }
            } else if (random === 2) {
              moveDown()
              if (wayClear === false) {
                moveUp()
              }
            }
          }
          if (wayClear === false) {
            moveRight()
          }
        } else if (lastDirection === 'up') {
          moveUp()
          if (wayClear === false) {
            const random = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random === 1) {
              moveLeft()
              if (wayClear === false) {
                moveRight()
              }
            } else if (random === 2) {
              moveRight()
              if (wayClear === false) {
                moveLeft()
              }
            }
          }
          if (wayClear === false) {
            moveDown()
          }
        } else if (lastDirection === 'down') {
          moveDown()
          if (wayClear === false) {
            const random = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random === 1) {
              moveLeft()
              if (wayClear === false) {
                moveRight()
              }
            } else if (random === 2) {
              moveRight()
              if (wayClear === false) {
                moveLeft()
              }
            }
          }
          if (wayClear === false) {
            moveUp()
          }
        }
      }





      function moveRight() {
        if (ghostIndex === 161 && !squares[144].classList.contains('ghostAny')) {
          ghostIndex = 144
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex % width < width - 1 && !squares[ghostIndex + 1].classList.contains('wall') && !squares[ghostIndex + 1].classList.contains('ghostAny')) {
          ghostIndex++
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveLeft() {
        if (ghostIndex === 144 && !squares[161].classList.contains('ghostAny')) {
          ghostIndex = 161
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex % width > 0 && !squares[ghostIndex - 1].classList.contains('wall') && !squares[ghostIndex - 1].classList.contains('ghostAny')) {
          ghostIndex--
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveUp() {
        if (ghostIndex + width < width * width && !squares[ghostIndex + width].classList.contains('wall') && !squares[ghostIndex + width].classList.contains('ghostAny')) {
          ghostIndex += width
          lastDirection = 'up'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveDown() {
        if (ghostIndex - width >= 0 && !squares[ghostIndex - width].classList.contains('wall') && !squares[ghostIndex - width].classList.contains('ghostAny')) {
          ghostIndex -= width
          lastDirection = 'down'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }


      
      
      
       
      
      
      
        
    
      squares.forEach(square => square.classList.remove(ghost))
      squares.forEach(square => square.classList.remove('ghostAny'))
      squares[ghostIndex].classList.add(ghost)
      squares[ghostIndex].classList.add('ghostAny')
      ghostMoved()
    
    }
  
    function ghostMoved() {
      checkGhost()

    }



    // EVENT HANDLERS
    window.addEventListener('keydown', handleKeyDown)
    resetBtn.addEventListener('click', reset)
    endGameBtn.addEventListener('click', gameOver)
    playAgainBtn.addEventListener('click', playAgain)
    form.addEventListener('submit', e => {
      e.preventDefault()
      usernameInput()
      console.log('form submitted')
    })

  }

  

}
window.addEventListener('DOMContentLoaded', init)