function init() {

  //  DOM VARIABLES
  const grid = document.querySelector('.grid')
  const squares = []

  // GAME VARIABLES
  const width = 18
  let playerIndex = 19
  const wallIndices = [0, 1]

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
        if (playerIndex % width < width - 1) {
          playerIndex++
        }
        break
      case 37:
        if (playerIndex % width > 0) {
          playerIndex--
        }
        break
      case 40:
        if (playerIndex + width < width * width) {
          playerIndex += width 
        }
        break
      case 38:
        if (playerIndex - width >= 0) {
          playerIndex -= width
        } 
        break
      default:
        console.log('player shouldnt move')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    console.log('current plauer index is' , playerIndex)
  }

  // add addtional (ie, inner) walls
  wallIndices.forEach((element) => squares[element].classList.add('wall'))


  // EVENT HANDLERS
  window.addEventListener('keydown', handleKeyDown)

}
window.addEventListener('DOMContentLoaded', init)