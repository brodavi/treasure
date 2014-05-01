function random (start, end) {
  var result = Math.floor(Math.random() * (end - start + 1));
  return start + result;
}

function getColor (depth) {
  switch (depth) {
    case 1: return '#bbee55';
    case 2: return '#99bb44';
    case 3: return '#775533';
    case 4: return '#665544';
    case 5: return '#625140';
    case 6: return '#604938';
    case 7: return '#564534';
    case 8: return '#514029';
    case 9: return '#423120';
    case 10: return 'black';
    default: return 'red';
  }
}

var player = {
  treasure: {},
  gold: 0,
  digger: 'trowel',
  diggerStrength: 1,
  digs: 0,
  treasureCount: 0
};

function updateUI() {

  window.goldIndicator.innerText = player.gold;
  window.diggerIndicator.innerText = player.digger;
  window.diggerPowerIndicator.innerText = player.diggerStrength;

  // if (player.notification !== window.notification.innerText) {
  //   window.notification.innerText = player.notification;
  //   player.notification = '';
  // }

  window.digsIndicator.innerText = player.digs;
}

function handleClick (e) {
  var clickedElm = e.target.classList[0] === 'plot' ?
        e.target :
        e.target.parentNode;
  var depth = parseInt(clickedElm.getAttribute('data-depth'), 10);

  player.digs++;

  if (depth === 10) {
    alert('CONGRATULATIONS! YOU REACHED LEVEL 10 in '+ player.digs +' moves! Can you get there with fewer digs? Refresh the page to try again!');
  }


  if (depth < 10) {

    var x = parseInt(clickedElm.getAttribute('data-x'), 10);
    var y = parseInt(clickedElm.getAttribute('data-y'), 10);

    var treasure = plots[y][x].treasure[depth];
    var treasureValue = 0;

    if (treasure) {
      switch (treasure) {
      // Level 0 - 2
      case 'shovel':
        if (player.diggerStrength >= 3) {
          treasure = 'silver-dollar';
        } else {
          player.digger = 'shovel';
          player.diggerStrength = 3;
        }
        treasureValue = 5;
        break;
      case 'silver-dollar':
        treasureValue = 5;
        break;
      case 'quarter':
        treasureValue = 1;
        break;
      case 'arrowhead':
        treasureValue = 10;
        break;

      // Level 3 - 5
      case 'excavator':
        if (player.diggerStrength >= 5) {
          treasure = 'pearl-earring';
        } else {
          player.digger = 'excavator';
          player.diggerStrength = 5;
        }
        treasureValue = 20;
        break;
      case 'pearl-earring':
        treasureValue = 20;
        break;
      case 'dinosaur-bone':
        treasureValue = 30;
        break;
      case 'emerald':
        treasureValue = 50;
        break;

      // Level 6 - 8
      case 'dynamite':
        if (player.diggerStrength >= 7) {
          treasure = 'antique-pocket-watch';
        } else {
          player.digger = 'dynamite';
          player.diggerStrength = 7;
        }
        treasureValue = 100;
        break;
      case 'antique-pocket-watch':
        treasureValue = 150;
        break;
      case 'archeological-ruins':
        treasureValue = 200;
        break;
      case 'ghengis-khans-bones':
        treasureValue = 300;
        break;

      // Level 9, 10
      case 'laser-drill':
        if (player.diggerStrength >= 10) {
          treasure = 'evidence-of-aliens';
        } else {
          player.digger = 'laser-drill';
          player.diggerStrength = 10;
        }
        treasureValue = 1000;
        break;
      case 'evidence-of-aliens':
        treasureValue = 1500;
        break;
      case 'the-lost-city-of-atlantis':
        treasureValue = 2000;
        break;
      case 'the-one-ring':
        treasureValue = 3000;
        break;

      default:
        alert('no such treasure!');

      } // end switch

      // add to the player's gold
      player.gold += treasureValue;

      // down here in case of digger duplication
      var treasureHeader = document.createElement('h3');
      treasureHeader.innerText = treasure + " $" +treasureValue;
      window.notificationList.appendChild(treasureHeader);
      player.treasureCount++;

      if (player.treasureCount > 7) {
        var length = window.notificationList.children.length;
        window.notificationList.children[0].remove();
      }

      // don't get the treasure again
      plots[y][x].treasure[depth] = '';

    }// end if treasure

    var healthBar = clickedElm.childNodes[0];
    var healthText = clickedElm.childNodes[1];

    var health = parseInt(clickedElm.getAttribute('data-health'), 10) - player.diggerStrength;

    var healthPercent = health/10;

    if (health <= 0) {
      depth++;
      clickedElm.setAttribute('data-health', 10 * depth);
      healthText.innerText = 10 * depth;

      healthBar.setAttribute('style', 'width:' + 15);
      clickedElm.setAttribute('style', 'background-color:' + getColor(depth));
    } else {
      clickedElm.setAttribute('data-health', health);
      healthText.innerText = health;

      healthBar.setAttribute('style', 'width:' + (15 - (1/healthPercent)) + "px");
    }

    clickedElm.setAttribute('data-depth', depth);

    updateUI();
  }
}

var plots = [];

$(document).ready( function () {
  var board, row, plot, rand;


  updateUI();

  board = window.board;

  for (var y = 0; y < 10; y++) {
    row = document.createElement('div');
    row.setAttribute('class', 'row');
    board.appendChild(row);

    plots[y] = [];

    for (var x = 0; x < 10; x++) {
      plot = document.createElement('div');
      plot.setAttribute('class', 'plot col-sm-1');
      plot.setAttribute('onmousedown', 'return false');
      plot.setAttribute('data-depth', 0);
      plot.setAttribute('data-health', 3);
      plot.setAttribute('data-x', x);
      plot.setAttribute('data-y', y);
      row.appendChild(plot);
      plot.addEventListener('mousedown', handleClick);
      plot.addEventListener('touchstart', handleClick);
      var healthBar = document.createElement('div');
      healthBar.setAttribute('class', 'healthbar');
      healthBar.setAttribute('onmousedown', 'return false');
      healthBar.addEventListener('mousedown', handleClick);
      healthBar.addEventListener('touchstart', handleClick);
      plot.appendChild(healthBar);
      var healthText = document.createElement('div');
      healthText.setAttribute('class', 'healthtext');
      healthText.setAttribute('onmousedown', 'return false');
      healthText.innerText = '3';
      healthText.addEventListener('mousedown', handleClick);
      healthText.addEventListener('touchstart', handleClick);
      plot.appendChild(healthText);

      plots[y][x] = {};
      plots[y][x].treasure = [null,null,null,null,null,null,null,null,null,null];

      for (var z = 0; z < 10; z++) {
        rand = Math.random();
        if (z < 3) {
          if (rand < 0.5) {
            continue; // aww too bad
          } else if (rand <= 0.6) {
            plots[y][x].treasure[random(0,2)] = 'quarter';
          } else if (rand < 0.8) {
            plots[y][x].treasure[random(0,2)] = 'shovel';
          } else if (rand < 0.9) {
            plots[y][x].treasure[random(0,2)] = 'silver-dollar';
          } else if (rand < 9.5) {
            plots[y][x].treasure[random(0,2)] = 'arrowhead';
          }
        } else if (z < 6) {
          if (rand < 0.5) {
            continue; // aww too bad
          } else if (rand <= 0.6) {
            plots[y][x].treasure[random(3,5)] = 'dinosaur-bone';
          } else if (rand < 0.8) {
            plots[y][x].treasure[random(3,5)] = 'pearl-earring';
          } else if (rand < 0.9) {
            plots[y][x].treasure[random(3,5)] = 'excavator';
          } else if (rand < 9.5) {
            plots[y][x].treasure[random(3,5)] = 'emerald';
          }
        } else if (z < 9) {
          if (rand < 0.5) {
            continue; // aww too bad
          } else if (rand <= 0.6) {
            plots[y][x].treasure[random(6,8)] = 'antique-pocket-watch';
          } else if (rand < 0.8) {
            plots[y][x].treasure[random(6,8)] = 'archeological-ruins';
          } else if (rand < 0.9) {
            plots[y][x].treasure[random(6,8)] = 'dynamite';
          } else if (rand < 9.5) {
            plots[y][x].treasure[random(6,8)] = 'ghengis-khans-bones';
          }
        } else if (z <= 10) {
          if (rand < 0.5) {
            continue; // aww too bad
          } else if (rand <= 0.6) {
            plots[y][x].treasure[random(9,10)] = 'evidence-of-aliens';
          } else if (rand < 0.8) {
            plots[y][x].treasure[random(9,10)] = 'laser-drill';
          } else if (rand < 0.9) {
            plots[y][x].treasure[random(9,10)] = 'the-lost-city-of-atlantis';
          } else if (rand < 9.5) {
            plots[y][x].treasure[random(9,10)] = 'the-one-ring';
          }
        }
      }        
    }
  }
});