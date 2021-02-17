const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                            
const config = {
  maxFPS: 60, // frame per second limiter (Max at 60).
}

let constantTime = 0;

let engineState = {
  mainLoopId: null,
  runningTimeMS: 0,
};

let gameState = {
  objects: [],
}

const DOM = {
  playScreen: document.getElementById("playscreen"),
  controlPanel: {
    gameLoopId: document.getElementById("gameloop-id"),
    runningTime: document.getElementById("running-time"),
    frameCounter: document.getElementById("frame-counter"),
    FPS: document.getElementById("fps")
  }
}

function constantTimeRunner(time) {
  constantTime = Math.floor(time);
  const millisecondPerFrame = constantTime - engineState.realtime;
  engineState.realtime = constantTime;

  if (engineState.isGameLoopStart) {
    if (engineState.startTime === 0) {
      engineState.startTime = time;
      engineState.runningTimeMS = engineState.realtime - engineState.startTime;
    }
    engineState.frameCount = Math.floor(engineState.realtime / millisecondPerFrame);

    const loopFrame = engineState.frameCount !== engineState.currentFrame;

    renderDebugger(engineState.realtime);
    if (loopFrame) {
      engineState.currentFrame += 1;

      // Game Loop should be invoke each frame.
      gameLoop(time);
      constantTime = engineState.realtime / 1000;
    }
    engineState.FPS = (1000 / millisecondPerFrame).toFixed(2);
  }

  setTimeout(() => {
    if (!engineState.mainLoopId) {
      engineState.mainLoopId = requestAnimationFrame(constantTimeRunner);
    } else {
      requestAnimationFrame(constantTimeRunner);
    }
  }, 1000 / config.maxFPS );
}

function renderDebugger() {
  DOM.controlPanel.FPS.innerText = engineState.FPS + " fps";
  DOM.controlPanel.frameCounter.innerText = engineState.currentFrame + " frames";
  DOM.controlPanel.runningTime.innerText = (constantTime / 1000).toFixed(2) + " s";
}

function gameLoop(time) {
  gameUpdate(time);
  gameRender();
}

function gameUpdate(time) {
  return;
}

// Render (Draw) Game object.
function gameRender() {
  const ctx = engineState.renderCtx;
  ctx.clearRect(0, 0, DOM.gameRenderArea.width, DOM.gameRenderArea.height);
  gameState.objects[0].render();
  return;
}

function startGameLoop() {
  if (!engineState.mainLoopId) {
    engineState.mainLoopId = requestAnimationFrame(constantTimeRunner);
  }
  engineState.isGameLoopStart = true;
  initGameRender();
}

function stopGameLoop() {
  engineState.isGameLoopStart = false;
  engineState.FPS = 0;
}

function reset() {
  window.cancelAnimationFrame(engineState.mainLoopId);
  DOM.playScreen.style.backgroundColor = "black";
  if (document.getElementById("game-render-area")) {
    document.getElementById("game-render-area").remove();
  }

  engineState = {
    mainLoopId: null,
    gameLoopId: null,
    isGameLoopStart: false,
    runningTimeMS: 0,
    runningTimeSecond: 0,
    frameCount: 0,
    currentFrame: 0,
    FPS: 0,
    previousTime: 0
  }

  renderDebugger();
}

function initGameRender() {
  DOM.gameRenderArea = document.createElement("canvas");
  DOM.gameRenderArea.id = "game-render-area";
  const { offsetHeight, offsetWidth } = DOM.playScreen;
  DOM.gameRenderArea.width = offsetWidth;
  DOM.gameRenderArea.height = offsetHeight;
  
  engineState.renderCtx = DOM.gameRenderArea.getContext("2d");
  const ctx = engineState.renderCtx;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, DOM.gameRenderArea.width, DOM.gameRenderArea.height);

  if (!document.getElementById("game-render-area")) {
    DOM.playScreen.appendChild(DOM.gameRenderArea);
  }

  const player = new createGameObject("redbox", 20, 20, 50, 50, "red");
  gameState.objects.push(player);
}

function createGameObject(id, width, height, x, y, color) {
  this.id = id;
  this.w = width;
  this.h = height;
  this.x = x;
  this.y = y;
  this.state = {
    color
  };
  this.update = (state) => {
    // Position Update
    // this.state = state;
    if (state.x) { this.x += state.x };
    if (state.y) { this.y += state.y };
    if ((this.y + this.h) <= 200) {
      this.y += 2;
    }
  }
  this.render = () => {
    const ctx = engineState.renderCtx;
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  return this;
}

(function main() {
  initGameRender();
  reset();
  startGameLoop();
})();
