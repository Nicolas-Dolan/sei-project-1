function init() {

  //  DOM VARIABLES
  const grid = document.querySelector('.grid')
  const squares = []

  // GAME VARIABLES
  const width = 18
  let playerIndex = 19
  const wallIndices = []

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
        }
        break
      case 37:
        if (playerIndex % width > 0 && !squares[playerIndex - 1].classList.contains('wall')) {
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
    console.log('current player index is' , playerIndex)
  }

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

  function drawVerticalWalls(min, max) {
    let i = min
    for (i = min; i <= max; i += width) {
      wallIndices.push(i)
    }
  }

  function drawBlock(min, max, n) {
    let i = 0
    for (i = 0; i < n; i++) {
      drawHorizontalWalls(min + width * (i), max - width * (n - (i + 1)))
    }
  }


  addPerimeterWalls()
  drawHorizontalWalls(92, 105)
  drawVerticalWalls(114, 132)
  drawBlock(26, 63, 3)
  drawBlock(38, 60, 2)
  drawBlock(47, 69, 2)
  drawHorizontalWalls(127, 130)
  drawBlock(163, 184, 2)
  drawBlock(218, 238, 2)
  drawHorizontalWalls(272, 285)
  drawVerticalWalls(119, 137)
  drawBlock(134, 153, 2)
  drawHorizontalWalls(139, 142)
  drawBlock(175, 196, 2)
  drawBlock(168, 186, 2)
  drawBlock(173, 191, 2)
  drawBlock(187, 190, 1)
  drawBlock(206, 225, 2)
  drawBlock(229, 249, 2)
  drawBlock(222, 258, 3)
  drawBlock(227, 263, 3)
  drawBlock(259, 262, 1)

  console.log('wallIndices', wallIndices)

  // adds walls to grid
  wallIndices.forEach((element) => squares[element].classList.add('wall'))

  // adds index number to each grid item
  squares.forEach((element, index) => element.innerHTML = index)

  // EVENT HANDLERS
  window.addEventListener('keydown', handleKeyDown)

}
window.addEventListener('DOMContentLoaded', init)