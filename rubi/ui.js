import { levels } from "./levels.js";
import {
  showPauseOverlay,
  hidePauseOverlay,
  showWonOverlay,
  hideWonOverlay
} from "./overlays.js";


export let gameState = "menu";

let currentLevelIndex = 0;

export function getCurrentLevelIndex() {
  return currentLevelIndex;
}

export function setCurrentLevelIndex(index) {
  currentLevelIndex = index;
}

export function setGameState(state) {
  gameState = state;
}

export function drawLives(ctx, lives) {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Lives: ${lives}`, 20, 70);
}

export function drawScore(ctx, score) {
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

export function handleMenuInput(e, startLevelCallback) {
  if (gameState === "menu") {
    if (e.key === " ") {
      currentLevelIndex = 0; // Level 1 starten
      setGameState("playing");
      startLevelCallback(currentLevelIndex);
      return true;
    }
    if (["1", "2", "3"].includes(e.key)) {
      currentLevelIndex = parseInt(e.key) - 1;
      setGameState("playing");
      startLevelCallback(currentLevelIndex);
      return true;
    }
  }

  if (e.key === "Escape") {
    if (gameState === "playing" || gameState === "won") setGameState("paused");
    else if (gameState === "paused") setGameState("playing");
    return true;
  }

  if (gameState === "won" && e.key === " ") {
    if (currentLevelIndex < levels.length - 1) {
      currentLevelIndex++;
      setGameState("playing");
      startLevelCallback(currentLevelIndex);
    } else {
      // Alle Levels geschafft → zurück ins Menü
      setGameState("menu");
    }
    return true;
  }

  return false; // Event nicht behandelt
}

// Hilfsfunktion: zentrierter Text mit optionaler Farbe und Font
function drawCenteredText(ctx, canvas, text, fontSize, y, color = "#000", font = "Arial") {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${font}`;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, (canvas.width - textWidth) / 2, y);
}

// Für blinkenden Text (Start-Hinweis)
let blinkTimer = 0;
let blinkVisible = true;
export function updateBlink(deltaTime) {
  blinkTimer += deltaTime;
  if (blinkTimer > 500) { // alle 500ms Blinken umschalten
    blinkVisible = !blinkVisible;
    blinkTimer = 0;
  }
}

export function drawUI(ctx, canvas, levelIndex, score, lives) {
  switch (gameState) {
    case "menu":
      // Hintergrund
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCenteredText(ctx, canvas, "The Churro Princess", 60, 100, "#000", "Arial Black");
      drawCenteredText(ctx, canvas, `Level: ${levelIndex + 1}`, 28, 160);
      drawCenteredText(ctx, canvas, "Arrow keys or A/D: Move", 30, 220);
      drawCenteredText(ctx, canvas, "Spacebar or W/↑: Jump", 30, 260);
      drawCenteredText(ctx, canvas, "F: Fart Attack 💨", 30, 300);

      if (blinkVisible) {
        drawCenteredText(ctx, canvas, "Press [space bar] to continue", 32, 360, "#333");
        drawCenteredText(ctx, canvas, "Or select level with [1], [2], [3]", 24, 400, "#555");
      }
      break;

      case "paused":
        showPauseOverlay(levelIndex, lives);
        return true; 

      

        case "won":
          showWonOverlay(levelIndex);
          return false; 
        
          case "playing":
            hidePauseOverlay();
            hideWonOverlay();
            break;
          

    default:
      // Default: keine UI, Spiel läuft
      break;
  }
}
