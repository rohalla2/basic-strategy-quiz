var questions;
var currentQuestionNum = 0;
var levelsArray = ['easy', 'medium', 'hard'];

$(document).ready(function() {
  $.getJSON('questions.json', function(response){
    var difficulties = getDifficulty();
    questions = shuffle(response);

    $.each(levelsArray, function(i, diff) {
      if (!difficulties.includes(diff)) {
        questions = _.reject(questions, function(q) {
          return q.difficulty === diff;
        });
      }
    });

    displayQuestion();
  })
});

function getDifficulty()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    if (hashes.length === 1 && (hashes[0] === "" || hashes[0].includes("start.html"))) {
      return levelsArray;
    }

    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        if (levelsArray.includes(hash[0])) {
          vars.push(hash[0]);
        }
    }
    return vars;
}

function displayQuestion(direction) {
  $('#answer-panel').contents().remove();
  if (direction === 1) {
    if (currentQuestionNum === questions.length - 1) {
      alert('All questions completed');
      return;
    }
    currentQuestionNum++;
  } else {
    if (currentQuestionNum !== 0) {
      currentQuestionNum--;
    }
  }

  $('#player-hand').html(questions[currentQuestionNum].playerHand);
  $('#counter').html((currentQuestionNum + 1) + '/' + questions.length );
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function parsePlayerAction(playerObj) {
  var html = " \
    <div class=\"row\"> \
      <div class=\"col-xs-6 header\">Dealer Shows:</div> \
      <div class=\"col-xs-6 header\">Your action:</div>";

  $.each(playerObj, function(key, value){
    if (key === 'doubleHit') {
      key = 'Double if allowed, otherwise Hit'
    } else if (key === 'doubleStay'){
      key = 'Double if allowed, otherwise Stay'
    };
    html += '<div class="col-xs-6">' + value.toString() + '</div><div class="col-xs-6">' + key + '</div>'
  });

  html += '</div>'

  return html;
}

function showAnswer() {
  $('#answer-panel').html(parsePlayerAction(questions[currentQuestionNum].playerAction));
};

$('#next-question').click(function() {
  displayQuestion(1);
});

$('#previous-question').click(function() {
  displayQuestion(-1);
});

$('#show-answer').click(function() {
  showAnswer();
});

$("body").keydown(function(e) {
  if(e.keyCode == 37) { // left
    displayQuestion(-1);
  } else if (e.keyCode == 40) { // down
    showAnswer();
  }
  else if(e.keyCode == 39) { // right
    displayQuestion(1);
  }
});
