//hide content
function visibilityHideContent(content) {
  content.style.visibility = 'hidden';
}

//show content
function visibilityShowContent(content) {
  content.style.visibility = 'visible';
}

//img enlarge effect
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

//img shrink effort
function shrink(content) {
  //initialization case
  if (content.style.width === "") {
    let screenWidth = document.body.clientWidth;
    if (screenWidth > 1000) {
      let wTar = 120;
      let hTar = 120;
    } else if (screenWidth <= 600) {
      let wTar = 60;
      let hTar = 60;
    } else {
      let wTar = 80;
      let hTar = 80;
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



//show content
function visibilityShowContentWithEffect(content) {
  content.style.visibility = 'visible';
  //img enlarge effect
  let wTar = parseInt(content.width);
  let hTar = parseInt(content.height);
  let screenWidth = document.body.clientWidth;
  if (screenWidth > 1000) {
    wTar = 120;
    hTar = 120;
  } else if (screenWidth <= 600) {
    wTar = 60;
    hTar = 60;
  } else {
    wTar = 80;
    hTar = 80;
  }
  content.style.width = 0 + "px";
  content.style.height = 0 + "px";
  enlarge(content, wTar, hTar);
}

//Create an array containing 16 non-repetitive integer from 0-15
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



//assign an unique ID to each gameCell
function assignContentToCells(elements, array) {
  for (let i = 0; i < array.length; i++) {
    elements[i].id = array[i];
    //assign img to each gameCell
    tempSrc = 'img/' + (array[i] > 7 ? 15 - array[i] : array[i]) + '.svg';
    tempChild = elements[i].firstElementChild;
    tempChild.setAttribute('src', tempSrc);
    visibilityHideContent(tempChild);
    elements[i].newPropertyName = 'isSolved';
    elements[i].newPropertyName = 'isOccupied';
    elements[i].isSolved = false;
    elements[i].isOccupied = false;
    elements[i].classList.remove('solved');
  }
}



//application layer
//hide all game cells
function hideAllCells(cells) {
  for (i = 0; i < cells.length; i++) {
    visibilityHideContent(cells[i]);
  }
}

//show all game cells
function showAllCells(cells) {
  for (i = 0; i < cells.length; i++) {
    visibilityShowContent(cells[i]);
  }
}

//effect of correct answer
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

//effort of wrong answer
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

//refresh game board
function refreshGame(cells) {
  assignContentToCells(cells, createArray());
  game.remainingCells = 8;
  game.numOfClicked = 0;
  document.querySelector('.clicknum').textContent = game.numOfClicked;
}

//show report
function reportShow(game) {
  document.querySelector('.reportContent').innerText = 'All cells solved with ' + game.numOfClicked + ' clicks!';
  document.querySelector('#reportCanvas').style.zIndex = 9998;
  document.querySelector('#reportPop').style.zIndex = 9999;
}

//remove report
function reportRemove() {
  document.querySelector('#reportCanvas').style.zIndex = -1;
  document.querySelector('#reportPop').style.zIndex = -2;
}

///////////////////////////////////////////
////---------- Event Start----------///////
///////////////////////////////////////////
let game = {
  numOfClicked: 0,
  firstClick: -1, // -1: first click, 0~15: cell ID of first click
  secondClick: -1, // -1: initial value, 0~15: cell ID of second click
  remainingCells: 8 // totally 8 pairs of cells need to be solved
};
const gameCells = document.querySelectorAll('.cell');
refreshGame(gameCells);
reportRemove();

let firstClickCell = gameCells[0];
let secondClickCell = gameCells[0];

// react on valid 'click' event
for (let i = 0; i < gameCells.length; i++) {
  gameCells[i].addEventListener('click', function() {
    if (!gameCells[i].isSolved && !gameCells[i].isOccupied) { // do not react on solved or effecting cells
      // first click
      if (game.firstClick < 0) {
        // if not the initial click, hide the last two wrong clicks
        if ((game.numOfClicked != 0) && (!firstClickCell.isSolved)) {
          // reset last effect
          removeEffectWrong(firstClickCell, secondClickCell);
        }
        firstClickCell = gameCells[i];
        game.firstClick = gameCells[i].id;
        visibilityShowContentWithEffect(gameCells[i].firstElementChild);
        gameCells[i].firstElementChild.classList.add('rotation');
        game.numOfClicked++;
      }
      // second click
      else if (gameCells[i].id != game.firstClick) {
        secondClickCell = gameCells[i];
        game.secondClick = gameCells[i].id;
        visibilityShowContentWithEffect(gameCells[i].firstElementChild);
        gameCells[i].firstElementChild.classList.add('rotation');
        // Correct answer
        if (15 === (parseInt(game.firstClick) + parseInt(game.secondClick))) {
          firstClickCell.isSolved = true;
          secondClickCell.isSolved = true;
          game.remainingCells--;
          // Effect of correct answer
          effectCorrect(firstClickCell, secondClickCell);
        }
        // Wrong answer
        else {
          // Effect of wrong answer
          effectWrong(firstClickCell, secondClickCell);
        }
        game.numOfClicked++;
        game.firstClick = -1; //reset firstClick
        game.secondClick = -1;
        if (game.remainingCells <= 0) {
          // show report
          setTimeout(function() {
            reportShow(game);
          }, 1000);
        }
      }
    } else {}
    document.querySelector('.clicknum').textContent = game.numOfClicked;
  });
}
