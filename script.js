var canvas = document.getElementById('canv')
var ctx = canvas.getContext('2d')
canvas.width = 600
canvas.height = 600

var lastTime = 0,
  speed = 400, width = 60, barriers = [[600, false, 200]], // for blocks
  py = 300, wdE = 20, speedE = 300, hgE = 20, // for unit-player
  space = false, // key event
  point = 0, pause = true, hPoint = 0

function start () { // restart after dying
  hPoint = Math.max(hPoint, point)
  speed = 400; barriers = [[600, false, 200]]; lastTime = 0
  py = 300; wdE = 20; speedE = 300; hgE = 20
  space = false
  point = 0
  pause = true
}
document.addEventListener('keydown', (event) => { // key pressing
  if (event.key === 'Enter') {
    pause = !pause
  }
  if (event.key === ' ') {
    space = true
    pause = false
  }
}, false)
document.getElementById('canv').addEventListener('click', (event) => { space = true }, false)
var requestAnimFrame = (function () { // instead of timer
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
})()
function main () {
  if (pause) {
    speed = 0
    speedE = 0
  } else {
    speed = 400
  }
  var now = Date.now()
  var dt = (now - lastTime) / 1000.0
  update(dt)
  render()
  isBreak()
  lastTime = now
  requestAnimFrame(main)
};
function update (dt) {
  py = dt < 1 ? py += (speedE * dt) : py
  if (space) {
    space = false
    speedE = -450
    hgE = 40
  }
  if (speedE < 500) {
    speedE += 25
  }
  if (hgE > wdE) {
    hgE--
  }
  for (var i = 0; i < barriers.length; ++i) {
    barriers[i][0] -= (speed * dt)
    if (barriers[i][0] < 300 && barriers[i][1] === false) {
      point++
      barriers[i][1] = true
    }
    if (barriers[i][0] < -width) {
      barriers.shift()
      var h = Math.random() * (350 - 50) + 50
      barriers.push([600, false, h])
    }
  }
}
function isBreak () { // is player failed
  if (py <= 0 || py >= 600 - wdE) {
    start()
  }
  for (var i = 0; i < barriers.length; ++i) {
    if (barriers[i][0] >= 300 - width && barriers[i][0] <= 300 + wdE) {
      if (py <= barriers[i][2] || py >= barriers[i][2] + 200 - hgE) {
        start()
      }
    }
  }
}
function render () {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < barriers.length; ++i) {
    ctx.fillStyle = 'black'
    ctx.fillRect(barriers[i][0], 0, width, canvas.height)
    ctx.fillStyle = 'white'
    ctx.fillRect(barriers[i][0] - 5, barriers[i][2], width + 10, 200)
  }
  ctx.fillStyle = 'black'
  ctx.fillRect(300, py, wdE, hgE)
  ctx.fillStyle = 'black'
  ctx.font = '20px Verdana'
  ctx.fillText('Enter - pause', 30, 575)
  ctx.fillText('Space - jump', 30, 595)
  ctx.fillText('high: ' + hPoint, 40, 85)
  ctx.font = '30px Verdana'
  ctx.fillText('Score: ' + point, 40, 60)
}

main()// start
