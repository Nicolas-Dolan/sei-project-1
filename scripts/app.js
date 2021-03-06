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
    let ghost1Index = [115]
    let ghost2Index = [116]
    let ghost3Index = [117]
    let ghost4Index = [118]
    const pathfinder1Index = [115]
    const pathfinder2Index = [116]
    const pathfinder3Index = [117]
    const pathfinder4Index = [118]
    let shortestPath = []
    // let shortestPath1 = []
    let lmPlusMc = []
    let shortest = ['default', 100]
    let timerId = ''
    const timerIdArray = []
    let moveable = true
    let firstChase
    let secondChase
    let finalChase
    let firstReprieve
    let secondReprieve
    const cycleMoveArray = []
    let ghostsFlee = false
    let fleeEndSoon = false
    let fleeTime
    const fleeTimeArray = []
    let ghostEatCount = 0
    let confused = false
    let hobbled = false
    let tracked = false

    gameActive = true
    console.log('Game active?', gameActive)

    //  DOM VARIABLES
    const width = 18
    const grid = document.querySelector('.grid')
    // const gridItems = document.querySelectorAll('.grid-item')
    const squares = []
    const wallIndices = []
    let bigCoinsIndices = [85, 256]
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
    const ghost1pic = document.querySelector('.ghost1')
    const healthyStat = document.querySelector('.healthy')
    const hobbledStat = document.querySelector('.hobbled')
    const confusedStat = document.querySelector('.confused')
    const trackedStat = document.querySelector('.tracked')
    
    // console.log(ghost1pic)
  

    //FUNCTIONS

    buildGame()

    function buildGame() {
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
      squares[133].classList.add('gate')
      squares[136].classList.add('gate')
      squares[115].classList.add('prison')
      squares[116].classList.add('prison')
      squares[117].classList.add('prison')
      squares[118].classList.add('prison')
      squares[96].classList.add('keep')
      squares[97].classList.add('keep')
      squares[98].classList.add('keep')
      squares[99].classList.add('keep')
      squares[100].classList.add('keep')
      squares[101].classList.add('keep')
      squares[114].classList.add('keep')
      squares[119].classList.add('keep')
      squares[132].classList.add('keep')
      squares[134].classList.add('keep')
      squares[135].classList.add('keep')
      squares[137].classList.add('keep')
      squares[96].classList.add('topleft')
      squares[101].classList.add('topright')
      squares[132].classList.add('bottomleft')
      squares[137].classList.add('bottomright')
      const plank1 = document.createElement('div')
      plank1.classList.add('plank')
      squares[133].appendChild(plank1)
      const plank2 = document.createElement('div')
      plank2.classList.add('plank')
      squares[136].appendChild(plank2)
      // const arch1 = document.createElement('div')
      // arch1.classList.add('archLeft')
      // squares[133].appendChild(arch1)
      // const arch2 = document.createElement('div')
      // arch2.classList.add('archRight')
      // squares[133].appendChild(arch2)

      addPerimeterWalls()
      drawBlock(92, 105)
      drawBlock(114, 132)
      drawBlock(26, 63)
      drawBlock(38, 57)
      drawBlock(41, 60)
      drawBlock(47, 66)
      drawBlock(50, 69)
      drawBlock(127, 130)
      drawBlock(164, 184)
      drawBlock(218, 238)
      drawBlock(272, 276)
      drawBlock(119, 137)
      drawBlock(134, 153)
      drawBlock(139, 142)
      drawBlock(175, 195)
      drawBlock(168, 204)
      drawBlock(173, 209)
      drawBlock(187, 190)
      drawBlock(224, 225)
      drawBlock(229, 249)
      drawBlock(240, 258)
      drawBlock(245, 263)
      drawBlock(260, 279)
      drawBlock(281, 285)
      // wallIndices.remove(144)
      wallIndices.forEach((element, index, array) => {
        if (element === 144 || element === 161) {
          array.splice(index, 2)
        }
      })
      

      // console.log('wallIndices', wallIndices)

      // adds walls to grid
      wallIndices.forEach((element) => squares[element].classList.add('wall'))

      addBigCoins()
      addSmallCoins()

      // adds index number to each grid item
      // squares.forEach((element, index) => element.innerHTML = index)

      addWallEdges()

      addGhosts()
    }

    

    function handleKeyDown(e) {
      let delay = 200
      if (hobbled) {
        delay = 500
      }
      function moveTimer() {
        moveable = false
        setTimeout(function() {
          moveable = true 
        }, delay)
      }
      if (!confused) {
        switch (e.keyCode) {
          case 39:
            if (moveable && playerIndex === 161) {
              playerIndex = 144
              playerMoved()
              moveTimer()
            } else if (moveable && playerIndex % width < width - 1 && !squares[playerIndex + 1].classList.contains('wall')) {
              playerIndex++
              playerMoved()
              moveTimer()
            }
            break
          case 37:
            if (moveable && playerIndex === 144) {
              playerIndex = 161
              playerMoved()
              moveTimer()
            } else if (moveable && playerIndex % width > 0 && !squares[playerIndex - 1].classList.contains('wall')) {
              playerIndex--
              playerMoved()
              moveTimer()
            }
            break
          case 40:
            if (moveable && playerIndex + width < width * width && !squares[playerIndex + width].classList.contains('wall')) {
              playerIndex += width
              playerMoved()
              moveTimer()
            }
            break
          case 38:
            if (moveable && playerIndex - width >= 0 && !squares[playerIndex - width].classList.contains('wall') && !squares[playerIndex - width].classList.contains('gate')) {
              playerIndex -= width
              playerMoved()
              moveTimer()
            } 
            break
          default:
            console.log('player shouldnt move')
        }
      } else if (confused) {
        switch (e.keyCode) {
          case 37:
            if (moveable && playerIndex === 161) {
              playerIndex = 144
              playerMoved()
              moveTimer()
            } else if (moveable && playerIndex % width < width - 1 && !squares[playerIndex + 1].classList.contains('wall')) {
              playerIndex++
              playerMoved()
              moveTimer()
            }
            break
          case 39:
            if (moveable && playerIndex === 144) {
              playerIndex = 161
              moveTimer()
              playerMoved()
            } else if (moveable && playerIndex % width > 0 && !squares[playerIndex - 1].classList.contains('wall')) {
              playerIndex--
              playerMoved()
              moveTimer()
            }
            break
          case 38:
            if (moveable && playerIndex + width < width * width && !squares[playerIndex + width].classList.contains('wall')) {
              playerIndex += width
              playerMoved()
              moveTimer()
            }
            break
          case 40:
            if (moveable && playerIndex - width >= 0 && !squares[playerIndex - width].classList.contains('wall') && !squares[playerIndex - width].classList.contains('gate')) {
              playerIndex -= width
              playerMoved()
              moveTimer()
            } 
            break
          default:
            console.log('player shouldnt move')
        }
      }
      
      squares.forEach(square => square.classList.remove('player'))
      squares.forEach(square => square.classList.remove('sword'))
      if (ghostsFlee){
        squares[playerIndex].classList.add('sword')
      }
      squares[playerIndex].classList.add('player')
      // playerMoved()
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

    function addWallEdges() {
      squares.forEach((element, index) => {
        if (squares[index] < (width * width - 1) && squares[index].classList.contains('wall') && !squares[index + 1].classList.contains('wall')) {
          squares[index].classList.add('rightEdge')
        }
      }) 
      // console.log('squares 39', squares)
    }

    

    function addBigCoins() {
      bigCoinsIndices.forEach((element) => {
        if (!squares[element].classList.contains('wall')) {
          squares[element].classList.add('bigCoin')
        }
      })
    }
    
  
    function addSmallCoins() {
      squares.forEach((element, index) => {
        if (!squares[index].classList.contains('wall') && !squares[index].classList.contains('player') && !squares[index].classList.contains('bigCoin') && !squares[index].classList.contains('prison') && !squares[index].classList.contains('gate')) {
          squares[index].classList.add('smallCoin')
        }
      }) 
    }
    

    function generateTreasure() {
      const treasureArray = []
      squares.forEach((element, index) => {
        if (!squares[index].classList.contains('wall') && !squares[index].classList.contains('player') && !squares[index].classList.contains('bigCoin') && !squares[index].classList.contains('prison') && !squares[index].classList.contains('gate') && !squares[index].classList.contains('treasure')) {
          treasureArray.push(index)
          // console.log('treasure index pushed', index)
        }
      }) 
      // console.log('treasure array', treasureArray)
      const randomTI = Math.floor(Math.random() * (treasureArray.length - 1 + 1)) + 1
      squares[treasureArray[randomTI]].classList.add('treasure')
      console.log('treasure generated at index', randomTI)
    }

    function generatePotion() {
      const potionArray = []
      squares.forEach((element, index) => {
        if (!squares[index].classList.contains('wall') && !squares[index].classList.contains('player') && !squares[index].classList.contains('bigCoin') && !squares[index].classList.contains('prison') && !squares[index].classList.contains('gate') && !squares[index].classList.contains('treasure') && !squares[index].classList.contains('potion')) {
          potionArray.push(index)
          // console.log('treasure index pushed', index)
        }
      }) 
      // console.log('treasure array', treasureArray)
      const randomPI = Math.floor(Math.random() * (potionArray.length - 1 + 1)) + 1
      squares[potionArray[randomPI]].classList.add('potion')
      console.log('potion generated at index', randomPI)
    }
    



    

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
        canEatGhosts()
      }
    }

    function eatTreasure() {
      if (squares[playerIndex].classList.contains('treasure')) {
        squares[playerIndex].classList.remove('treasure')
        gainPoints(1000)
      }
    }

    function eatPotion() {
      if (squares[playerIndex].classList.contains('potion')) {
        squares[playerIndex].classList.remove('potion')
        gainPoints(50)
        potionHeal()
      }
    }

    function potionHeal(){
      tracked = false
      confused = false
      hobbled = false
      healthyStat.style.display = 'flex'
      hobbledStat.style.display = 'none'
      confusedStat.style.display = 'none'
      trackedStat.style.display = 'none'
      squares.forEach((square) => {
        square.classList.remove('hunting')
      })
    }

    function playerMoved() {
      eatSmallCoin()
      eatBigCoin()
      eatTreasure()
      eatPotion()
      checkCoins()
      checkGhost()
      const randomN1 = Math.floor(Math.random() * (250 - 1 + 1)) + 1
      if (randomN1 === 50) {
        generateTreasure()
      }
      if (tracked || confused || hobbled) {
        const randomN2 = Math.floor(Math.random() * (40 - 1 + 1)) + 1
        if (randomN2 === 10) {
          generatePotion()
        }
      }
      
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

    function resetPlayer() {
      squares[playerIndex].classList.remove('player')
      playerIndex = 19
      squares[playerIndex].classList.add('player')
    }

    function nextRound() {
      resetPlayer()
      bigCoinsIndices = [85, 256]
      round++
      roundViewer.innerHTML = round
      console.log('round', round)
      removeGhosts()
      addGhosts()
      addBigCoins()
      addSmallCoins()
    }

    function reset() {
      resetPlayer()
      bigCoinsIndices = [85, 256]
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
      removeGhosts()
      squares[playerIndex].classList.remove('player')
      gameActive = false
      game.style.display = 'none'
      gameOverScrn.style.display = 'flex'
      const scoreViewer2 = document.querySelector('body > div.gameOverScrn >div.gameOverWrapper > p > span')
      scoreViewer2.innerHTML = score
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

    //the below functions create and control the ghosts

    function addGhosts() {
      ghost1Index = [115]
      squares[ghost1Index[0]].classList.add('ghostAny')
      squares[ghost1Index[0]].classList.add('ghost1')
      ghost2Index = [116]
      squares[ghost2Index[0]].classList.add('ghostAny')
      squares[ghost2Index[0]].classList.add('ghost2')
      ghost3Index = [117]
      squares[ghost3Index[0]].classList.add('ghostAny')
      squares[ghost3Index[0]].classList.add('ghost3')
      ghost4Index = [118]
      squares[ghost4Index[0]].classList.add('ghostAny')
      squares[ghost4Index[0]].classList.add('ghost4')
      cycleMoveType()
    }
    

    function removeGhosts() {
      timerIdArray.forEach(element => clearInterval(element))
      clearTimeout(firstChase)
      clearTimeout(secondChase)
      clearTimeout(finalChase)
      clearTimeout(firstReprieve)
      clearTimeout(secondReprieve)
      cycleMoveArray.forEach(element => clearTimeout(element))
      fleeTimeArray.forEach(element => clearTimeout(element))
      squares.forEach(square => square.classList.remove('ghost1'))
      squares.forEach(square => square.classList.remove('ghost2'))
      squares.forEach(square => square.classList.remove('ghost3'))
      squares.forEach(square => square.classList.remove('ghost4'))
      squares.forEach(square => square.classList.remove('ghostAny'))
      squares.forEach((square) => {
        square.classList.remove('scaredghost')
      })
      squares.forEach((square) => {
        square.classList.remove('ghostWhite')
      })
      squares.forEach((square) => {
        square.classList.remove('statusGiven')
      })
      squares.forEach((square) => {
        square.classList.remove('treasure')
      })
      squares.forEach((square) => {
        square.classList.remove('potion')
      })
      squares.forEach((square) => {
        square.classList.remove('hunting')
      })
      squares.forEach((square) => {
        square.classList.remove('sword')
      })
      ghostsFlee = false
      fleeEndSoon = false
      hobbled = false
      confused = false
      tracked = false
      ghostEatCount = 0
      healthyStat.style.display = 'flex'
      hobbledStat.style.display = 'none'
      confusedStat.style.display = 'none'
      trackedStat.style.display = 'none'
    }

    function checkGhost() {
      if (squares[playerIndex].classList.contains('ghost3') && ghostsFlee === false) {
        gameOver()
      } else if (squares[playerIndex].classList.contains('ghostAny') && ghostsFlee === true) {
        eatGhost()
      } else if (squares[playerIndex].classList.contains('ghost4') && ghostsFlee === false && hobbled === false) {
        hobbled = true
        healthyStat.style.display = 'none'
        hobbledStat.style.display = 'flex'
        statusGiven()
        console.log('hobbled =', hobbled)
      } else if (squares[playerIndex].classList.contains('ghost4') && ghostsFlee === false && hobbled === true) {
        losePoints(100)
        statusGiven()
      } else if (squares[playerIndex].classList.contains('ghost2') && ghostsFlee === false && confused === false) {
        confused = true
        healthyStat.style.display = 'none'
        confusedStat.style.display = 'flex'
        console.log('confused =', confused)
        statusGiven()
      } else if (squares[playerIndex].classList.contains('ghost2') && ghostsFlee === false && confused === true) {
        losePoints(100)
        statusGiven()
      } else if (squares[playerIndex].classList.contains('ghost1') && ghostsFlee === false && tracked === false) {
        trackPlayer()
        statusGiven()
        console.log('tracked =', tracked)
        healthyStat.style.display = 'none'
        trackedStat.style.display = 'flex'
      } else if (squares[playerIndex].classList.contains('ghost1') && ghostsFlee === false && tracked === true) {
        losePoints(100)
        statusGiven()
      }
    }

    function trackPlayer() {
      tracked = true
      chasePlayer(ghost3Index, 'ghost3', pathfinder3Index, playerIndex)

    }

    function losePoints(amount) {
      score -= amount
      scoreViewer.innerHTML = score
    }

    function statusGiven() {
      squares.forEach((square) => {
        square.classList.remove('scaredghost')
      })
      squares.forEach((square) => {
        square.classList.remove('ghostWhite')
      })
      squares.forEach((square) => {
        square.classList.remove('statusGiven')
      })
      squares.forEach((square) => {
        square.classList.remove('hunting')
      })
      if (squares[playerIndex].classList.contains('ghost1')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost1')
        squares[playerIndex].classList.remove('ghostAny')
        ghost1Index = [115]
        squares[ghost1Index[0]].classList.add('ghostAny')
        squares[ghost1Index[0]].classList.add('ghost1')
        squares[ghost1Index[0]].classList.add('statusGiven')
        cycleMoveType()
      }
      if (squares[playerIndex].classList.contains('ghost2')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost2')
        squares[playerIndex].classList.remove('ghostAny')
        ghost2Index = [116]
        squares[ghost2Index[0]].classList.add('ghostAny')
        squares[ghost2Index[0]].classList.add('ghost2')
        squares[ghost2Index[0]].classList.add('statusGiven')
        cycleMoveType()
      }
      if (squares[playerIndex].classList.contains('ghost4')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost4')
        squares[playerIndex].classList.remove('ghostAny')
        ghost4Index = [118]
        squares[ghost4Index[0]].classList.add('ghostAny')
        squares[ghost4Index[0]].classList.add('ghost4')
        squares[ghost4Index[0]].classList.add('statusGiven')
        cycleMoveType()
      }
    }
    

    function ghostMoveAll() {
      timerIdArray.forEach(element => clearInterval(element))
      ghostMove(ghost1Index, 'ghost1')
      ghostMove(ghost2Index, 'ghost2')
      ghostMove(ghost4Index, 'ghost4')

      if (tracked) {
        chasePlayer(ghost3Index, 'ghost3', pathfinder3Index, playerIndex)
        console.log('Ogre is chasing') 
      } else ghostMove(ghost3Index, 'ghost3')
    }

    function ghostChase1() {
      timerIdArray.forEach(element => clearInterval(element))

      if (hobbled) {
        chasePlayer(ghost2Index, 'ghost2', pathfinder2Index, playerIndex)
        console.log('Blue is chasing') 
      } else ghostMove(ghost2Index, 'ghost2')

      if (hobbled) {
        ghostMove(ghost4Index, 'ghost4')
      } else chasePlayer(ghost4Index, 'ghost4', pathfinder4Index, playerIndex)
      // console.log('Red is chasing')

      if (tracked) {
        chasePlayer(ghost3Index, 'ghost3', pathfinder3Index, playerIndex)
        console.log('Ogre is chasing') 
      } else ghostMove(ghost3Index, 'ghost3')

      if (tracked) {
        ghostMove(ghost1Index, 'ghost1') 
      } else chasePlayer(ghost1Index, 'ghost1', pathfinder1Index, playerIndex)
      // console.log('Green is chasing')
    }

    function ghostChase2() {
      timerIdArray.forEach(element => clearInterval(element))
      ghostMove(ghost2Index, 'ghost2')
      chasePlayer(ghost4Index, 'ghost4', pathfinder4Index, playerIndex)
      console.log('Red is chasing') 

      if (tracked) {
        ghostMove(ghost1Index, 'ghost1')
      } else chasePlayer(ghost1Index, 'ghost1', pathfinder1Index, playerIndex)
      // console.log('Green is chasing')

      if (tracked) {
        chasePlayer(ghost3Index, 'ghost3', pathfinder3Index, playerIndex)
        console.log('Ogre is chasing')
      } else ghostMove(ghost3Index, 'ghost3')
    }

    

    function cycleMoveType() {
      ghostMoveAll()
      firstChase = setTimeout(function(){ 
        ghostChase1()
        // console.log('Pink is chasing') 
        firstReprieve = setTimeout(function(){ 
          ghostMoveAll()
          console.log('First reprieve') 
          secondChase = setTimeout(function(){ 
            ghostChase2()
            // console.log('Pink and Red are chasing')
            secondReprieve = setTimeout(function(){ 
              ghostMoveAll()
              console.log('Second reprieve') 
              finalChase = setTimeout(function(){ 
                ghostChase2()
                // console.log('Pink and Red are chasing again') 
              }, (15000 / round))
              cycleMoveArray.push(finalChase)
            }, 20000)  
            cycleMoveArray.push(secondReprieve)
          }, (15000 / round))
          cycleMoveArray.push(secondChase)
        }, 25000)
        cycleMoveArray.push(firstReprieve)
      }, (3000 / round))
      cycleMoveArray.push(firstChase)
    }

    function canEatGhosts() {
      timerIdArray.forEach(element => clearInterval(element))
      cycleMoveArray.forEach(element => clearTimeout(element))
      fleeTimeArray.forEach(element => clearTimeout(element))
      // clearTimeout(firstChase)
      // clearTimeout(secondChase)
      // clearTimeout(finalChase)
      // clearTimeout(firstReprieve)
      // clearTimeout(secondReprieve)
      ghostsFlee = true
      fleeEndSoon = false
      allGhostsFlee()
      console.log('ghosts flee=', ghostsFlee)
      fleeTime = setTimeout(function(){
        fleeEndSoon = true
        console.log('flee end soon=', fleeEndSoon)
      }, (5000 - (round * 50)))
      fleeTimeArray.push(fleeTime)
      fleeTime = setTimeout(function(){
        fleeEndSoon = false
        ghostsFlee = false
        ghostEatCount = 0
        timerIdArray.forEach(element => clearInterval(element))
        squares.forEach((square) => {
          square.classList.remove('scaredghost')
        })
        squares.forEach((square) => {
          square.classList.remove('ghostWhite')
        })
        squares.forEach((square) => {
          square.classList.remove('statusGiven')
        })
        squares.forEach((square) => {
          square.classList.remove('hunting')
        })
        squares.forEach(square => square.classList.remove('sword'))
        cycleMoveType()
        console.log('ghosts flee=', ghostsFlee, 'flee end soon=', fleeEndSoon)
      }, (7000 - (round * 50)))
      fleeTimeArray.push(fleeTime)
    }


    function eatGhost() {
      if (squares[playerIndex].classList.contains('ghost1')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost1')
        squares[playerIndex].classList.remove('ghostAny')
        ghost1Index = [115]
        squares[ghost1Index[0]].classList.add('ghostAny')
        squares[ghost1Index[0]].classList.add('ghost1')
        allGhostsFlee()
        gainPoints(200)
        ghostEatCount++
        if (ghostEatCount === 2) {
          gainPoints(200)
        } else if (ghostEatCount === 3) {
          gainPoints(600)
        } else if (ghostEatCount === 4) {
          gainPoints(1400)
        }
      }
      if (squares[playerIndex].classList.contains('ghost2')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost2')
        squares[playerIndex].classList.remove('ghostAny')
        gainPoints(200)
        ghost2Index = [116]
        squares[ghost2Index[0]].classList.add('ghostAny')
        squares[ghost2Index[0]].classList.add('ghost2')
        allGhostsFlee()
        ghostEatCount++
        if (ghostEatCount === 2) {
          gainPoints(200)
        } else if (ghostEatCount === 3) {
          gainPoints(600)
        } else if (ghostEatCount === 4) {
          gainPoints(1400)
        }
      }
      if (squares[playerIndex].classList.contains('ghost3')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost3')
        squares[playerIndex].classList.remove('ghostAny')
        gainPoints(200)
        ghost3Index = [117]
        squares[ghost3Index[0]].classList.add('ghostAny')
        squares[ghost3Index[0]].classList.add('ghost3')
        allGhostsFlee()
        ghostEatCount++
        if (ghostEatCount === 2) {
          gainPoints(200)
        } else if (ghostEatCount === 3) {
          gainPoints(600)
        } else if (ghostEatCount === 4) {
          gainPoints(1400)
        }
      }
      if (squares[playerIndex].classList.contains('ghost4')) {
        timerIdArray.forEach(element => clearInterval(element))
        squares[playerIndex].classList.remove('ghost4')
        squares[playerIndex].classList.remove('ghostAny')
        gainPoints(200)
        ghost4Index = [118]
        squares[ghost4Index[0]].classList.add('ghostAny')
        squares[ghost4Index[0]].classList.add('ghost4')
        allGhostsFlee()
        ghostEatCount++
        if (ghostEatCount === 2) {
          gainPoints(200)
        } else if (ghostEatCount === 3) {
          gainPoints(600)
        } else if (ghostEatCount === 4) {
          gainPoints(1400)
        }
      }
    }

    function allGhostsFlee() {
      timerIdArray.forEach(element => clearInterval(element))
      fleePlayer(ghost1Index, 'ghost1')
      fleePlayer(ghost2Index, 'ghost2')
      fleePlayer(ghost3Index, 'ghost3')
      fleePlayer(ghost4Index, 'ghost4')
      
    }

    function fleePlayer(ghostIndex, ghost) {
      let lastDirection = ''
      let moveCounter = 0
      let wayClear = true
      
      
      const random1 = Math.floor(Math.random() * (4 - 1 + 1)) + 1
      switch (random1) {
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

      if (ghostsFlee) {
        timerId = setInterval(playerRelPos, 500)

        timerIdArray.push(timerId)
      }
      
      function playerRelPos() {
        const ownRow = Math.ceil((ghostIndex[0] + 1) / width)
        const ownColumn = width - (((width * width) - (ghostIndex[0] + 1)) % width)
        const playerRow = Math.ceil((playerIndex + 1) / width)
        const playerColumn = width - (((width * width) - (playerIndex + 1)) % width)
        const close = 7
        

        if (ownRow - playerRow <= close &&  ownRow - playerRow >= -close && ownColumn - playerColumn <= close && ownColumn - playerColumn >= -close) {
          if (ownRow < playerRow && ownColumn < playerColumn) {
            const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random2 === 1) {
              moveUp()
              if (wayClear === false) {
                moveLeft()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            } else if (random2 === 2) {
              moveLeft()
              if (wayClear === false) {
                moveUp()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            }
    
          } else if (ownRow > playerRow && ownColumn > playerColumn) {
            const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random2 === 1) {
              moveRight()
              if (wayClear === false) {
                moveDown()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            } else if (random2 === 2) {
              moveDown()
              if (wayClear === false) {
                moveRight()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            }
    
          } else if (ownRow > playerRow && ownColumn < playerColumn) {
            const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random2 === 1) {
              moveDown()
              if (wayClear === false) {
                moveLeft()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            } else if (random2 === 2) {
              moveLeft()
              if (wayClear === false) {
                moveDown()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            }
    
          } else if (ownRow < playerRow && ownColumn > playerColumn) {
            const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
            if (random2 === 1) {
              moveUp()
              if (wayClear === false) {
                moveRight()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            } else if (random2 === 2) {
              moveRight()
              if (wayClear === false) {
                moveUp()
                if (wayClear === false) {
                  randomMove() 
                }
              } 
            }
          } else if (ownRow < playerRow) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              } else if (random2 === 2) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              }
            }
          } else if (ownRow > playerRow) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              } else if (random2 === 2) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              } 
            }
          } else if (ownColumn < playerColumn) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              }
            }
          } else if (ownColumn > playerColumn) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    randomMove() 
                  }
                } 
              }
            }
          }
    
        //   squares.forEach((square) => {
        //     if (square.classList.contains(ghost) && square.classList.contains('ghostAny')) {
        //       square.classList.remove('ghostAny')
        //     }
        //   })
        //   squares.forEach(square => square.classList.remove(ghost))
        //   squares[ghostIndex[0]].classList.add(ghost)
        //   squares[ghostIndex[0]].classList.add('ghostAny')
        //   ghostMoved()
        } else chooseMove()


        function chooseMove() {
          const random = Math.floor(Math.random() * (3 - 1 + 1)) + 1
          if (lastDirection === 'right') {
            if (random === 1) {
              moveRight()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } else if (random2 === 2) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } 
              }
            } else if (random === 2) {
              moveUp()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } else if (random2 === 2) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } 
              }
            } if (random === 3) {
              moveDown()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } else if (random2 === 2) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveLeft()
                    }
                  }
                } 
              }
            }
          } else if (lastDirection === 'left') {
            if (random === 1) {
              moveLeft()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } else if (random2 === 2) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } 
              }
            } else if (random === 2) {
              moveUp()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } else if (random2 === 2) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } 
              }
            } if (random === 3) {
              moveDown()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } else if (random2 === 2) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveRight()
                    }
                  }
                } 
              }
            }
          } else if (lastDirection === 'up') {
            if (random === 1) {
              moveUp()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } else if (random2 === 2) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } 
              }
            } else if (random === 2) {
              moveRight()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } else if (random2 === 2) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } 
              }
            } if (random === 3) {
              moveLeft()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } else if (random2 === 2) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                    if (wayClear === false) {
                      moveDown()
                    }
                  }
                } 
              }
            }
          } else if (lastDirection === 'down') {
            if (random === 1) {
              moveDown()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } else if (random2 === 2) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } 
              }
            } else if (random === 2) {
              moveRight()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } else if (random2 === 2) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } 
              }
            } if (random === 3) {
              moveLeft()
              if (wayClear === false) {
                const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
                if (random2 === 1) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } else if (random2 === 2) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                    if (wayClear === false) {
                      moveUp()
                    }
                  }
                } 
              }
            }
          }
          // squares.forEach((square) => {
          //   if (square.classList.contains(ghost) && square.classList.contains('ghostAny')) {
          //     square.classList.remove('ghostAny')
          //   }
          // })
          // squares.forEach(square => square.classList.remove(ghost))
          // squares[ghostIndex[0]].classList.add(ghost)
          // squares[ghostIndex[0]].classList.add('ghostAny')
          // ghostMoved()
        }

        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('ghostAny')) {
            square.classList.remove('ghostAny')
          }
        })
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('scaredghost')) {
            square.classList.remove('scaredghost')
          }
        })
        
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('ghostWhite')) {
            square.classList.remove('ghostWhite')
          }
        })
        
        squares.forEach(square => square.classList.remove(ghost))
        squares[ghostIndex[0]].classList.add(ghost)
        squares[ghostIndex[0]].classList.add('ghostAny')
        squares[ghostIndex[0]].classList.add('scaredghost')
        if (fleeEndSoon) {
          squares[ghostIndex[0]].classList.add('ghostWhite')
        }
        ghostMoved()
       
  
        
      }

      function moveRight() {
        if (ghostIndex[0] === 161 && !squares[144].classList.contains('ghostAny')) {
          ghostIndex[0] = 144
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex[0] % width < width - 1 && !squares[ghostIndex[0] + 1].classList.contains('wall') && !squares[ghostIndex[0] + 1].classList.contains('ghostAny')) {
          ghostIndex[0]++
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }
  
      function moveLeft() {
        if (ghostIndex[0] === 144 && !squares[161].classList.contains('ghostAny')) {
          ghostIndex[0] = 161
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex[0] % width > 0 && !squares[ghostIndex[0] - 1].classList.contains('wall') && !squares[ghostIndex[0] - 1].classList.contains('ghostAny')) {
          ghostIndex[0]--
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }
  
      function moveDown() {
        if (ghostIndex[0] + width < width * width && !squares[ghostIndex[0] + width].classList.contains('wall') && !squares[ghostIndex[0] + width].classList.contains('ghostAny')) {
          ghostIndex[0] += width
          lastDirection = 'down'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }
  
      function moveUp() {
        if (ghostIndex[0] - width >= 0 && !squares[ghostIndex[0] - width].classList.contains('wall') && !squares[ghostIndex[0] - width].classList.contains('ghostAny') && !squares[ghostIndex[0] - width].classList.contains('gate')) {
          ghostIndex[0] -= width
          lastDirection = 'up'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function randomMove() {
        const random1 = Math.floor(Math.random() * (4 - 1 + 1)) + 1
        switch (random1) {
          case 1:
            moveUp()
            break
          case 2:
            moveDown()
            break
          case 3:
            moveRight()
            break
          case 4:
            moveLeft()
            break
        }
      }
      
    }
    
    
    
  
    
  
    function ghostMoved() {
      checkGhost()
      // ghostsScared()
      // if (ghostsFlee === true) {
      //   fleePlayer()
      // }
    }

    function ghostMove(ghostIndex, ghost) {

      let lastDirection = ''
      let moveCounter = 0
      let wayClear = true
      
      
      const random1 = Math.floor(Math.random() * (4 - 1 + 1)) + 1
      switch (random1) {
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
      
      timerId = setInterval(chooseMove, 500)

      timerIdArray.push(timerId)

      function chooseMove() {
        const random = Math.floor(Math.random() * (3 - 1 + 1)) + 1
        if (lastDirection === 'right') {
          if (random === 1) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveRight()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'left') {
          if (random === 1) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveLeft()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'up') {
          if (random === 1) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveUp()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'down') {
          if (random === 1) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveDown()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          }
        }
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('ghostAny')) {
            square.classList.remove('ghostAny')
          }
        })
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('statusGiven')) {
            square.classList.remove('statusGiven')
          }
        })
        squares.forEach(square => square.classList.remove(ghost))
        squares[ghostIndex[0]].classList.add(ghost)
        squares[ghostIndex[0]].classList.add('ghostAny')
        if (tracked && ghost === 'ghost1') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (confused && ghost === 'ghost2') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (hobbled && ghost === 'ghost4') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (tracked && ghost === 'ghost3') {
          squares[ghostIndex[0]].classList.add('hunting')
        }
        ghostMoved()
      }

      function moveRight() {
        if (ghostIndex[0] === 161 && !squares[144].classList.contains('ghostAny')) {
          ghostIndex[0] = 144
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex[0] % width < width - 1 && !squares[ghostIndex[0] + 1].classList.contains('wall') && !squares[ghostIndex[0] + 1].classList.contains('ghostAny')) {
          ghostIndex[0]++
          lastDirection = 'right'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveLeft() {
        if (ghostIndex[0] === 144 && !squares[161].classList.contains('ghostAny')) {
          ghostIndex[0] = 161
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else if (ghostIndex[0] % width > 0 && !squares[ghostIndex[0] - 1].classList.contains('wall') && !squares[ghostIndex[0] - 1].classList.contains('ghostAny')) {
          ghostIndex[0]--
          lastDirection = 'left'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveDown() {
        if (ghostIndex[0] + width < width * width && !squares[ghostIndex[0] + width].classList.contains('wall') && !squares[ghostIndex[0] + width].classList.contains('ghostAny')) {
          ghostIndex[0] += width
          lastDirection = 'down'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }

      function moveUp() {
        if (ghostIndex[0] - width >= 0 && !squares[ghostIndex[0] - width].classList.contains('wall') && !squares[ghostIndex[0] - width].classList.contains('ghostAny') && !squares[ghostIndex[0] - width].classList.contains('gate')) {
          ghostIndex[0] -= width
          lastDirection = 'up'
          moveCounter++
          ghostMoved()
          wayClear = true
        } else wayClear = false
      }
    
    }

    

    

    function chasePlayer(ghostIndex, ghost, pathfinderIndex, destinationIndex) {
      let timerDelay = 500

      if (tracked && ghost === 'ghost3') {
        timerDelay = 350
      }

      timerId = setInterval(pursuePlayer, timerDelay)

      timerIdArray.push(timerId)

      function pursuePlayer() {
        shortestPath = ['reset', 100]
        pathfinderIndex[0] = ghostIndex[0]
        destinationIndex = playerIndex
        lmPlusMc = []
        shortest = ['reset', 100]
        // shortest = []
        // destinationIndex = playerIndex
        findShortestPath(pathfinderIndex, destinationIndex, ghostIndex)
        if (shortest[0] === 'right') {
          moveRightC()
        } else if (shortest[0] === 'left') {
          moveLeftC()
        } else if (shortest[0] === 'up') {
          moveUpC()
        } else if (shortest[0] === 'down') {
          moveDownC()
        }
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('ghostAny')) {
            square.classList.remove('ghostAny')
          }
        })
        squares.forEach((square) => {
          if (square.classList.contains(ghost) && square.classList.contains('statusGiven')) {
            square.classList.remove('statusGiven')
          }
        })
        squares.forEach(square => square.classList.remove(ghost))
        squares[ghostIndex[0]].classList.add(ghost)
        squares[ghostIndex[0]].classList.add('ghostAny')
        if (tracked && ghost === 'ghost1') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (confused && ghost === 'ghost2') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (hobbled && ghost === 'ghost4') {
          squares[ghostIndex[0]].classList.add('statusGiven')
        }
        if (tracked && ghost === 'ghost3') {
          squares[ghostIndex[0]].classList.add('hunting')
        }
        ghostMoved()
        pathfinderIndex[0] = ghostIndex[0]
        // console.log('ghostindex =', ghostIndex)
        // console.log('pathfinderIndex', pathfinderIndex)
        // console.log('playerindex =', playerIndex)
      }
      

      function moveRightC() {
        if (ghostIndex[0] === 161 && !squares[144].classList.contains('ghostAny')) {
          ghostIndex[0] = 144
          ghostMoved()
        } else if (ghostIndex[0] % width < width - 1 && !squares[ghostIndex[0] + 1].classList.contains('wall') && !squares[ghostIndex[0] + 1].classList.contains('ghostAny')) {
          ghostIndex[0]++
          ghostMoved()
        }
      }

      function moveLeftC() {
        if (ghostIndex[0] === 144 && !squares[161].classList.contains('ghostAny')) {
          ghostIndex[0] = 161
          ghostMoved()
        } else if (ghostIndex[0] % width > 0 && !squares[ghostIndex[0] - 1].classList.contains('wall') && !squares[ghostIndex[0] - 1].classList.contains('ghostAny')) {
          ghostIndex[0]--
          ghostMoved()
        }
      }

      function moveDownC() {
        if (ghostIndex[0] + width < width * width && !squares[ghostIndex[0] + width].classList.contains('wall') && !squares[ghostIndex[0] + width].classList.contains('ghostAny')) {
          ghostIndex[0] += width
          ghostMoved()
        } 
      }

      function moveUpC() {
        if (ghostIndex[0] - width >= 0 && !squares[ghostIndex[0] - width].classList.contains('wall') && !squares[ghostIndex[0] - width].classList.contains('ghostAny') && !squares[ghostIndex[0] - width].classList.contains('gate')) {
          ghostIndex[0] -= width
          ghostMoved()
        }
      }
    }
    
    // findShortestPath(pathfinder1Index, playerIndex, ghost3Index)


    function findShortestPath(pathfinderIndex, destinationIndex, ghostIndex) {
      // shortest = []
      let i = 0
      for (i = 0; i < 60; i++) {
        pathfinderIndex[0] = ghostIndex[0]
        destinationIndex = playerIndex
        // console.log('ghostindex =', ghostIndex)
        lmPlusMc = []
        pathfinderMove(pathfinderIndex, destinationIndex, ghostIndex)
        pathfinderIndex[0] = ghostIndex[0]
        // pathfinderIndex[0] = ghostIndex[0]
        // if (shortestPath[0][1] < shortestPath[1][1]) {
        //   shortestPath.pop()
        // } else shortestPath.shift()
      }
      // console.log('shortest path array =', shortestPath)
      // let shortest = ['default', 100]
      shortestPath.map((element) => {
        if (element[1] < shortest[1]) {
          shortest = element
        }
      })
      // pathfinderIndex[0] = ghostIndex[0]
      // console.log('pathfinderindex first=', pathfinderIndex)
      // console.log('shortest path =', shortest)
      return shortest
    }
    
    // pathfinderMove(pathfinder1Index, playerIndex)

    function pathfinderMove(pathfinderIndex, destinationIndex, ghostIndex) {
      // let pathfinderIndex = pathfinderIndex

      let lastDirection = ''
      const moveCounter = [0]
      let wayClear = true
        
      const random1 = Math.floor(Math.random() * (4 - 1 + 1)) + 1
      switch (random1) {
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
      pathfinderIndex[0] = ghostIndex[0]
      destinationIndex = playerIndex
      let i = 0
      for (i = 0; i < 60; i++) {
        
        chooseMove()
        // console.log('pathfinder1index =', pathfinder1Index)
        // console.log('movecounter =', moveCounter)
        if (i === 0) {
          lmPlusMc.push(lastDirection)
        }
        if (pathfinderIndex[0] === destinationIndex) {
          lmPlusMc.push(moveCounter[0])
          // console.log('lmplusmc =', lmPlusMc)
          shortestPath.push(lmPlusMc)
          // if (i !== 0 && shortestPath[0][1] <= shortestPath[1][1]) {
          //   shortestPath.pop()
          // } else if (i !== 0 && shortestPath[0][1] > shortestPath[1][1]) {
          //   shortestPath.shift()
          // }
          // lmPlusMc = []
        }
      }
      // console.log('shortestpath =', shortestPath)
      
  
      function chooseMove() {
        const random = Math.floor(Math.random() * (3 - 1 + 1)) + 1
        if (lastDirection === 'right') {
          if (random === 1) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveRight()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveLeft()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'left') {
          if (random === 1) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } else if (random2 === 2) {
                moveLeft()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveRight()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'up') {
          if (random === 1) {
            moveUp()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveUp()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveUp()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveUp()
                  if (wayClear === false) {
                    moveDown()
                  }
                }
              } 
            }
          }
        } else if (lastDirection === 'down') {
          if (random === 1) {
            moveDown()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          } else if (random === 2) {
            moveRight()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveLeft()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveDown()
                if (wayClear === false) {
                  moveLeft()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          } if (random === 3) {
            moveLeft()
            if (wayClear === false) {
              const random2 = Math.floor(Math.random() * (2 - 1 + 1)) + 1
              if (random2 === 1) {
                moveDown()
                if (wayClear === false) {
                  moveRight()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } else if (random2 === 2) {
                moveRight()
                if (wayClear === false) {
                  moveDown()
                  if (wayClear === false) {
                    moveUp()
                  }
                }
              } 
            }
          }
        }
      }
  
      function moveRight() {
        if (pathfinderIndex[0] === 161 && !squares[144].classList.contains('ghostAny')) {
          pathfinderIndex[0] = 144
          lastDirection = 'right'
          moveCounter[0]++
          wayClear = true
        } else if (pathfinderIndex[0] % width < width - 1 && !squares[pathfinderIndex[0] + 1].classList.contains('wall') && !squares[pathfinderIndex[0] + 1].classList.contains('ghostAny')) {
          pathfinderIndex[0]++
          lastDirection = 'right'
          moveCounter[0]++
          wayClear = true
        } else wayClear = false
      }
  
      function moveLeft() {
        if (pathfinderIndex[0] === 144 && !squares[161].classList.contains('ghostAny')) {
          pathfinderIndex[0] = 161
          lastDirection = 'left'
          moveCounter[0]++
          wayClear = true
        } else if (pathfinderIndex[0] % width > 0 && !squares[pathfinderIndex[0] - 1].classList.contains('wall') && !squares[pathfinderIndex[0] - 1].classList.contains('ghostAny')) {
          pathfinderIndex[0]--
          lastDirection = 'left'
          moveCounter[0]++
          wayClear = true
        } else wayClear = false
      }
  
      function moveDown() {
        if (pathfinderIndex[0] + width < width * width && !squares[pathfinderIndex[0] + width].classList.contains('wall') && !squares[pathfinderIndex[0] + width].classList.contains('ghostAny')) {
          pathfinderIndex[0] += width
          lastDirection = 'down'
          moveCounter[0]++
          wayClear = true
        } else wayClear = false
      }
  
      function moveUp() {
        if (pathfinderIndex[0] - width >= 0 && !squares[pathfinderIndex[0] - width].classList.contains('wall') && !squares[pathfinderIndex[0] - width].classList.contains('ghostAny')  && !squares[pathfinderIndex[0] - width].classList.contains('gate')) {
          pathfinderIndex[0] -= width
          lastDirection = 'up'
          moveCounter[0]++
          wayClear = true
        } else wayClear = false
      }
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