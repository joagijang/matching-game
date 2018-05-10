/**
 * @description Hide content
 * @param {object} content - The content needs to be hidden
 */
function visibilityHideContent(content) {
  content.style.visibility = 'hidden';
}

/**
 * @description Show content
 * @param {object} content - The content needs to be shown
 */
function visibilityShowContent(content) {
  content.style.visibility = 'visible';
}

/**
 * @description Image enlarge effect
 * @param {object} content - The content needs to be manipulated
 * @param {number} wTar - Target width
 * @param {number} hTar - Target height
 */
function enlarge(content, wTar, hTar) {
  let w = parseInt(content.style.width);
  let h = parseInt(content.style.height);
  if ((w >= wTar) || (h >= hTar)) {
    return true;
  } else {
    w += 2;
    h += 2;
    content.style.width = w + "px";
    content.style.height = h + "px";
    setTimeout(function() {
      enlarge(content, wTar, hTar)
    }, 1);
  }
}

/**
 * @description Image shrink effect
 * @param {object} content - The content needs to be manipulated
 */
function shrink(content) {
  //initialization case
  if (content.style.width === "") {
    let screenWidth = document.body.clientWidth;
    let wTar = 40;
    let hTar = 40;
    //width target values must align with the values in css
    if (screenWidth > (1000 - 33)) {
      wTar = 110;
      hTar = 110;
    } else if (screenWidth > (600 - 33)) {
      wTar = 80;
      hTar = 80;
    } else if (screenWidth > (465 - 33)) {
      wTar = 60;
      hTar = 60;
    }

    let w = wTar;
    let h = hTar;
    content.style.width = w + "px";
    content.style.height = h + "px";
  }
  //non-initialization cases
  let w = parseInt(content.style.width);
  let h = parseInt(content.style.height);
  if ((w <= 0) || (h <= 0)) {
    content.style.visibility = 'hidden';
    return true;
  } else {
    w -= 2;
    h -= 2;
    content.style.width = w + "px";
    content.style.height = h + "px";
    setTimeout(function() {
      shrink(content)
    }, 1);
  }
}

/**
 * @description Show content with enlarge effect
 * @param {object} content - The content needs to be manipulated
 */
function visibilityShowContentWithEffect(content) {
  content.style.visibility = 'visible';
  //img enlarge effect
  let screenWidth = document.body.clientWidth;
  let wTar = 40;
  let hTar = 40;
  //width target must align with the values in css
  if (screenWidth > (1000 - 33)) {
    wTar = 110;
    hTar = 110;
  } else if (screenWidth > (600 - 33)) {
    wTar = 80;
    hTar = 80;
  } else if (screenWidth > (465 - 33)) {
    wTar = 60;
    hTar = 60;
  }
  content.style.width = 0 + "px";
  content.style.height = 0 + "px";
  enlarge(content, wTar, hTar);
}

/**
 * @description Create an array containing 16 non-repetitive integer from 0-15
 * @returns {array} tempArray
 */
function createArray() {
  let tempArray = [];
  let tempFlag = 1;
  tempArray[0] = Math.random() * 16 | 0;
  for (let i = 1; i < 16; i++) {
    tempFlag = i;
    while (tempFlag) {
      tempArray[i] = Math.random() * 16 | 0;
      for (let j = 0; j < i; j++) {
        if (tempArray[i] === tempArray[j]) {
          tempFlag = i;
          break;
        } else {
          tempFlag -= 1;
        }
      }
    }
  }
  return tempArray;
}

/**
 * @description Assign an unique ID to each gameCell
 * @param {object} elements - The elements need to be assign
 * @param {array} array - The array to be assigned
 */
function assignContentToCells(elements, array) {
  for (let i = 0; i < array.length; i++) {
    elements[i].id = array[i];
    //assign img to each gameCell
    let tempSrc = 'img/' + (array[i] > 7 ? 15 - array[i] : array[i]) + '.svg';
    let tempChild = elements[i].firstElementChild;
    tempChild.setAttribute('src', tempSrc);
    visibilityHideContent(tempChild);
    elements[i].newPropertyName = 'isSolved';
    elements[i].newPropertyName = 'isOccupied';
    elements[i].isSolved = false;
    elements[i].isOccupied = false;
    elements[i].classList.remove('solved');
  }
}

///////////////////////
// application layer //
///////////////////////

/**
 * @description Hide all game cells
 * @param {object} cells - The card cells to be hidden
 */
function hideAllCells(cells) {
  for (i = 0; i < cells.length; i++) {
    visibilityHideContent(cells[i]);
  }
}

/**
 * @description Show all game cells
 * @param {object} cells - The card cells to be shown
 */
function showAllCells(cells) {
  for (i = 0; i < cells.length; i++) {
    visibilityShowContent(cells[i]);
  }
}

/**
 * @description Reset game timer to zero
 */
function timerReset() {
  gameInfo.secConsumed = 0;
  clearInterval(timerTrigger);
  document.querySelector('.timeval').textContent = '0:00';
}

/**
 * @description Actions to be taken for every second
 */
function timerUpdate() {
  gameInfo.secConsumed++;
  let min = parseInt(gameInfo.secConsumed / 60);
  let sec = parseInt(gameInfo.secConsumed % 60);
  if (sec < 10) {
    sec = '0' + sec;
  }
  document.querySelector('.timeval').textContent = min + ':' + sec;
  starRatingUpdate(gameInfo); // update star rating
}

/**
 * @description Trigger timerUpdate() every 1 second
 */
function timerRestart() {
  timerTrigger = setInterval('timerUpdate()', 1000);
}

/**
 * @description Show effect and update relevant parameters when two cells match
 * @param {object} cellOne
 * @param {object} cellTwo
 */
function effectCorrect(cellOne, cellTwo) {
  cellOne.classList.add('solved');
  cellTwo.classList.add('solved');
  cellOne.classList.add('correct');
  cellTwo.classList.add('correct');
  cellOne.firstElementChild.classList.remove('rotation');
  cellTwo.firstElementChild.classList.remove('rotation');
  setTimeout(function() {
    cellOne.classList.remove('correct');
    cellTwo.classList.remove('correct');
  }, 1000);
}

/**
 * @description Show effect and update relevant parameters when two cells do NOT match
 * @param {object} cellOne
 * @param {object} cellTwo
 */
function effectWrong(cellOne, cellTwo) {
  const tempCellOne = cellOne;
  const tempCellTwo = cellTwo;
  tempCellOne.isOccupied = true;
  tempCellTwo.isOccupied = true;
  setTimeout(function() {
    tempCellOne.classList.add('wrong');
    tempCellTwo.classList.add('wrong');
    tempCellOne.firstElementChild.classList.remove('rotation');
    tempCellTwo.firstElementChild.classList.remove('rotation');
  }, 300);
  setTimeout(function() {
    while (!shrink(tempCellOne.firstElementChild) && !shrink(tempCellTwo.firstElementChild)) {} //in case of bugs from double clicks
    tempCellOne.classList.remove('wrong');
    tempCellTwo.classList.remove('wrong');
    tempCellOne.isOccupied = false;
    tempCellTwo.isOccupied = false;
  }, 1500);
}

/**
 * @description Remove unmatch effect and update relevant parameters
 * @param {object} cellOne
 * @param {object} cellTwo
 */
function removeEffectWrong(cellOne, cellTwo) {
  const tempCellOne = cellOne;
  const tempCellTwo = cellTwo;
  shrink(tempCellOne.firstElementChild);
  shrink(tempCellTwo.firstElementChild);
  tempCellOne.classList.remove('wrong');
  tempCellTwo.classList.remove('wrong');
  //make sure it won't be overwritten by other funtions
  setTimeout(function() {
    tempCellOne.classList.remove('wrong');
    tempCellTwo.classList.remove('wrong');
  }, 300);

}

/**
 * @description Refresh the game board by updating the card cells
 * @param {object} cells - card cells
 */
function refreshGameCells(cells) {
  assignContentToCells(cells, createArray());
  gameInfo.remainingCells = 8;
  gameInfo.numOfClicked = 0;
  document.querySelector('.clicknum').textContent = gameInfo.numOfClicked;
}

/**
 * @description Restart the game
 * @param {object} cells - card cells
 */
function restartGame(cells) {
  refreshGameCells(cells);
  timerReset();
  timerRestart();
  reportRemove();
  starRatingUpdate(gameInfo);
  removeEffectWrong(firstClickCell, secondClickCell);
  gameInfo.firstClick = -1;
  gameInfo.secondClick = -1;
}

/**
 * @description Update the star rating
 * @param {object} gameInfo - Game information stored
 */
function starRatingUpdate(gameInfo) {
  let tempStarTwo = document.querySelectorAll('.starTwo');
  let tempStarThree = document.querySelectorAll('.starThree');
  if ((gameInfo.secConsumed <= 30) && (gameInfo.numOfClicked <= 28)) {
    gameInfo.gameRating = 3;
  } else if ((gameInfo.secConsumed <= 50) && (gameInfo.numOfClicked <= 36)) {
    gameInfo.gameRating = 2;
  } else {
    gameInfo.gameRating = 1;
  }
  switch (gameInfo.gameRating) {
    case 1:
      tempStarTwo[0].setAttribute('src', 'img/starHollow.svg');
      tempStarTwo[1].setAttribute('src', 'img/starHollow.svg');
      tempStarThree[0].setAttribute('src', 'img/starHollow.svg');
      tempStarThree[1].setAttribute('src', 'img/starHollow.svg');
      break;
    case 2:
      tempStarTwo[0].setAttribute('src', 'img/starSolid.svg');
      tempStarTwo[1].setAttribute('src', 'img/starSolid.svg');
      tempStarThree[0].setAttribute('src', 'img/starHollow.svg');
      tempStarThree[1].setAttribute('src', 'img/starHollow.svg');
      break;
    case 3:
      tempStarTwo[0].setAttribute('src', 'img/starSolid.svg');
      tempStarTwo[1].setAttribute('src', 'img/starSolid.svg');
      tempStarThree[0].setAttribute('src', 'img/starSolid.svg');
      tempStarThree[1].setAttribute('src', 'img/starSolid.svg');
      break;
    default:
      tempStarTwo[0].setAttribute('src', 'img/starHollow.svg');
      tempStarTwo[1].setAttribute('src', 'img/starHollow.svg');
      tempStarThree[0].setAttribute('src', 'img/starHollow.svg');
      tempStarThree[1].setAttribute('src', 'img/starHollow.svg');
  }
}

/**
 * @description Show game report
 * @param {object} gameInfo - Game information stored
 */
function reportShow(gameInfo) {
  document.querySelector('.reportContent').innerText = 'All cells solved with ' +
    gameInfo.numOfClicked + ' clicks in ' +
    document.querySelector('.timeval').textContent + ' !';
  document.querySelector('#reportCanvas').style.zIndex = 9998;
  document.querySelector('#reportPop').style.zIndex = 9999;
  starRatingUpdate(gameInfo);
}

/**
 * @description Remove game report
 */
function reportRemove() {
  document.querySelector('#reportCanvas').style.zIndex = -1;
  document.querySelector('#reportPop').style.zIndex = -2;
}

///////////////////////////////////////////
/////--------- Event Start ----------//////
///////////////////////////////////////////
let gameInfo = {
  numOfClicked: 0,
  firstClick: -1, // -1: first click, 0~15: cell ID of first click
  secondClick: -1, // -1: initial value, 0~15: cell ID of second click
  remainingCells: 8, // totally 8 pairs of cells need to be solved
  secConsumed: 0, // time consumed in seconds
  gameRating: 1 // finish score, 1~3 stars
};
let timerTrigger = setInterval('timerUpdate()', 1000);
const gameCells = document.querySelectorAll('.cell');
let firstClickCell = gameCells[0];
let secondClickCell = gameCells[0];

restartGame(gameCells);
reportRemove();

// react on valid 'click' event
for (let i = 0; i < gameCells.length; i++) {
  gameCells[i].addEventListener('click', function() {
    if (!gameCells[i].isSolved && !gameCells[i].isOccupied) { // do not react on solved or effecting cells
      // first click
      if (gameInfo.firstClick < 0) {
        // if not the initial click, hide the last two wrong clicks
        if ((gameInfo.numOfClicked != 0) && (!firstClickCell.isSolved)) {
          // reset last effect
          removeEffectWrong(firstClickCell, secondClickCell);
        }
        firstClickCell = gameCells[i];
        gameInfo.firstClick = gameCells[i].id;
        visibilityShowContentWithEffect(gameCells[i].firstElementChild);
        gameCells[i].firstElementChild.classList.add('rotation');
        gameInfo.numOfClicked++;
      }
      // second click
      else if (gameCells[i].id != gameInfo.firstClick) {
        secondClickCell = gameCells[i];
        gameInfo.secondClick = gameCells[i].id;
        visibilityShowContentWithEffect(gameCells[i].firstElementChild);
        gameCells[i].firstElementChild.classList.add('rotation');
        // Correct answer
        if (15 === (parseInt(gameInfo.firstClick) + parseInt(gameInfo.secondClick))) {
          firstClickCell.isSolved = true;
          secondClickCell.isSolved = true;
          gameInfo.remainingCells--;
          // Effect of correct answer
          effectCorrect(firstClickCell, secondClickCell);
        }
        // Wrong answer
        else {
          // Effect of wrong answer
          effectWrong(firstClickCell, secondClickCell);
        }
        gameInfo.numOfClicked++;
        gameInfo.firstClick = -1; //reset firstClick
        gameInfo.secondClick = -1;
        starRatingUpdate(gameInfo); //update star rating
        // Game Completion
        if (gameInfo.remainingCells <= 0) {
          // stop timer
          clearInterval(timerTrigger);
          // show report
          setTimeout(function() {
            reportShow(gameInfo);
          }, 1000);
        }
      }
    }
    document.querySelector('.clicknum').textContent = gameInfo.numOfClicked;
  });
}
