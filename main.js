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
  notification: ''
};

function updateUI() {

  window.goldIndicator.innerText = player.gold;
  window.diggerIndicator.innerText = player.digger;
  window.diggerPowerIndicator.innerText = player.diggerStrength;

  if (player.notification !== window.notification.innerText) {
    window.notification.innerText = player.notification;
    player.notification = '';
  }

  window.digsIndicator.innerText = player.digs;
}

function handleClick (e) {
  var depth = parseInt(e.target.getAttribute('data-depth'), 10);

  player.digs++;

  if (depth === 10) {
    alert('CONGRATULATIONS! YOU REACHED LEVEL 10 in '+ player.digs +' moves! Can you get there with fewer digs? Refresh the page to try again!');
  }


  if (depth < 10) {

    var x = parseInt(e.target.getAttribute('data-x'), 10);
    var y = parseInt(e.target.getAttribute('data-y'), 10);

    var treasure = plots[y][x].treasure[depth];

    if (treasure) {
      switch (treasure) {
      // Level 0 - 2
      case 'shovel':
        if (player.digger === 'shovel') {
          player.gold += 5;
          treasure = 'silver-dollar';
        } else {
          player.digger = 'shovel';
          player.diggerStrength = 3;
        }
        break;
      case 'silver-dollar':
        player.gold += 5;
        break;
      case 'quarter':
        player.gold += 1;
        break;
      case 'arrowhead':
        player.gold += 10;
        break;

      // Level 3 - 5
      case 'excavator':
        if (player.digger === 'excavator') {
          player.gold += 20;
          treasure = 'pearl-earring';
        } else {
          player.digger = 'excavator';
          player.diggerStrength = 5;
        }
        break;
      case 'pearl-earring':
        player.gold += 20;
        break;
      case 'dinosaur-bone':
        player.gold += 30;
        break;
      case 'emerald':
        player.gold += 50;
        break;

      // Level 6 - 8
      case 'dynamite':
        if (player.digger === 'dynamite') {
          player.gold += 100;
          treasure = 'antique-pocket-watch';
        } else {
          player.digger = 'dynamite';
          player.diggerStrength = 7;
        }
        break;
      case 'antique-pocket-watch':
        player.gold += 150;
        break;
      case 'archeological-ruins':
        player.gold += 200;
        break;
      case 'ghengis-khans-bones':
        player.gold += 300;
        break;

      // Level 9, 10
      case 'laser-drill':
        if (player.digger === 'laser-drill') {
          player.gold += 1000;
          treasure = 'evidence-of-aliens';
        } else {
          player.digger = 'laser-drill';
          player.diggerStrength = 10;
        }
        break;
      case 'evidence-of-aliens':
        player.gold += 1500;
        break;
      case 'the-lost-city-of-atlantis':
        player.gold += 2000;
        break;
      case 'the-one-ring':
        player.gold += 3000;
        break;

      default:
        alert('no such treasure!');

      } // end switch

      // down here in case of digger duplication
      player.notification = 'You\'ve got treasure! You found ' + treasure;

      // don't get the treasure again
      plots[y][x].treasure[depth] = '';

    }// end if treasure

    var healthBar = e.target.childNodes[0];
    var healthText = e.target.childNodes[1];

    var health = parseInt(e.target.getAttribute('data-health'), 10) - player.diggerStrength;

    var healthPercent = health/10;

    if (health <= 0) {
      depth++;
      e.target.setAttribute('data-health', 10 * depth);
      healthText.innerText = 10 * depth;

      healthBar.setAttribute('style', 'width:' + 15);
      e.target.setAttribute('style', 'background-color:' + getColor(depth));
    } else {
      e.target.setAttribute('data-health', health);
      healthText.innerText = health;

      healthBar.setAttribute('style', 'width:' + (15 - (1/healthPercent)) + "px");
    }

    e.target.setAttribute('data-depth', depth);

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
      plot.setAttribute('class', 'col-sm-1 plot');
      plot.setAttribute('data-depth', 0);
      plot.setAttribute('data-health', 3);
      plot.setAttribute('data-x', x);
      plot.setAttribute('data-y', y);
      row.appendChild(plot);
      plot.addEventListener('click', handleClick);
      var healthBar = document.createElement('div');
      healthBar.setAttribute('class', 'healthbar');
      plot.appendChild(healthBar);
      var healthText = document.createElement('div');
      healthText.setAttribute('class', 'healthtext');
      healthText.innerText = '3';
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