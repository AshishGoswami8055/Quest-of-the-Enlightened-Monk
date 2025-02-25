function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

let timer = 60;
let timerId;
let Min_1 = localStorage.getItem("Min_1");
let Min_2 = localStorage.getItem("Min_2");
let Min_3 = localStorage.getItem("Min_3");
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'You Won1...';
    setInterval(() => {
      // window.open("../../level_3.html");
      window.close("index.html");
    }, 3000);
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'You Loose!!! Restarting the game in 3 seconds....';
    setInterval(() => {
      console.log(Min_1,Min_2,Min_3);
      if (Min_1 === null && Min_2 === null && Min_3 === null) {
        window.open("../../index.html");
    } else if (Min_1 !== null && Min_2 === null && Min_3 === null) {
        window.open("../../level2.html");
    } else if (Min_1 !== null && Min_2 !== null && Min_3 === null) {
        window.open("../../level3.html");
    }
      window.close("index.html");
    }, 3000);
  }
}
