function init() {

  // GAME VARIABLES

  let playerIndex = 19
  let score = 0

  //  DOM VARIABLES

  const width = 18
  const grid = document.querySelector('.grid')
  const gridItems = document.querySelectorAll('.grid-item')
  const squares = []
  const wallIndices = []
  const bigCoinsIndices = [34, 107, 88]
  // console.log(squares)
  

  //FUNCTIONS


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
        if (playerIndex % width < width - 1 && !squares[playerIndex + 1].classList.contains('wall')) {
          playerIndex++
          playerMoved()
        }
        break
      case 37:
        if (playerIndex % width > 0 && !squares[playerIndex - 1].classList.contains('wall')) {
          playerIndex--
          playerMoved()
        }
        break
      case 40:
        if (playerIndex + width < width * width && !squares[playerIndex + width].classList.contains('wall')) {
          playerIndex += width
          playerMoved()
        }
        break
      case 38:
        if (playerIndex - width >= 0 && !squares[playerIndex - width].classList.contains('wall')) {
          playerIndex -= width
          playerMoved()
        } 
        break
      default:
        console.log('player shouldnt move')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    console.log('current player index is' , playerIndex)
    console.log('score', score)
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

  // console.log('wallIndices', wallIndices)

  // adds walls to grid
  wallIndices.forEach((element) => squares[element].classList.add('wall'))

  //adds big coins to grid
  bigCoinsIndices.forEach((element) => {
    if (!squares[element].classList.contains('wall')) {
      squares[element].classList.add('bigCoin')
    }
  })

  //adds small coins to grid
  function addSmallCoins() {
    squares.forEach((element, index) => {
      if (!squares[index].classList.contains('wall') && !squares[index].classList.contains('player') && !squares[index].classList.contains('bigCoin')) {
        squares[index].classList.add('smallCoin')
      }
    }) 
  }
  addSmallCoins()

  // adds index number to each grid item
  squares.forEach((element, index) => element.innerHTML = index)

  //the below functions contribute towards the game mechanics

  function gainPoints(amount) {
    score += amount
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
  }



  // EVENT HANDLERS
  window.addEventListener('keydown', handleKeyDown)

}
window.addEventListener('DOMContentLoaded', init)