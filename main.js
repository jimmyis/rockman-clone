let engineState = {
  mainLoopId: null,
};

const DOM = {
  playScreen: document.getElementById("playscreen"),
  controlPanel: {
    gameLoopId: document.getElementById("gameloop-id"),
    runningTime: document.getElementById("running-time"),
    frameCounter: document.getElementById("frame-counter"),
    FPS: document.getElementById("fps")
  }
}

function constantFrameRunner(time) {
  const secondPerFrame = (time - engineState.runningTimeMS) || 0;
  const currentSecond = Math.floor(time / 1000);

  if ((currentSecond - engineState.runningTimeSecond) >= 1) {
    engineState.frameCount = parseInt(engineState.frameCount) + parseInt(engineState.FPS);
  }

  engineState.runningTimeMS = time;
  engineState.runningTimeSecond = currentSecond;

  if (engineState.isGameLoopStart) {
    renderDebugger(time);
    engineState.FPS = (1000 / secondPerFrame).toFixed(2);
    gameLoop(time)
  }

  engineState.mainLoopId = window.requestAnimationFrame(constantFrameRunner);
}

function renderDebugger() {
  DOM.controlPanel.FPS.innerText = engineState.FPS + " fps";
  DOM.controlPanel.frameCounter.innerText = engineState.frameCount + " frames";
  DOM.controlPanel.runningTime.innerText = engineState.runningTimeSecond + " s";
}

function update(time) {

}

function render() {
  DOM.playScreen.style.backgroundColor = "#55f81f";
}

function gameLoop(time) {
  update(time);
  render();
}

function startGameLoop() {
  if (!engineState.mainLoopId) {
    constantFrameRunner();
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

  engineState = {
    mainLoopId: null,
    gameLoopId: null,
    isGameLoopStart: false,
    runningTimeMS: 0,
    runningTimeSecond: 0,
    frameCount: 0,
    FPS: 0,
    previousTime: 0
  }

  renderDebugger();
}

function initGameRender() {
  DOM.gameRenderArea = document.createElement("canvas");
  DOM.gameRenderArea.id = "game-render-area";
  const { offsetHeight, offsetWidth } = DOM.playScreen
  DOM.gameRenderArea.width = offsetWidth;
  DOM.gameRenderArea.height = offsetHeight;
  
  engineState.renderCtx = DOM.gameRenderArea.getContext("2d");
  const ctx = engineState.renderCtx;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, DOM.gameRenderArea.width, DOM.gameRenderArea.height);

  if (!document.getElementById("game-render-area")) {
    DOM.playScreen.appendChild(DOM.gameRenderArea);
  }
}

(function main() {
  reset();
  initGameRender();
  constantFrameRunner();
})();
