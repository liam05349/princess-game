import { levels } from "./levels.js";
import { canvas, setGameState } from "./game.js";
import { playEffect, fireballSound } from './sound.js';

const chatBossImg = new Image();
chatBossImg.src = "./assets/chat.png";

const bagelBossImg = new Image();
bagelBossImg.src = "./assets/bagel.png";

const cageImg = new Image();
cageImg.src = "./assets/cage.png";

const dadBossImg = new Image();
let dadBossLoaded = false;
dadBossImg.onload = () => { dadBossLoaded = true; };
dadBossImg.src = "./assets/dad.png";

const fireballImg = new Image();
fireballImg.src = "./assets/fireball.png";

/** @type {any} */
export let bagel = null;
/** @type {any[]} */
export let bagelProjectiles = [];
export let bagelAttackCooldown = 0;
export let enemyActive = false;
export let stageProgress = "explore";

export function triggerBossFight() {
  stageProgress = "boss";
  enemyActive = true;
}

export function resetBossSystem() {
  bagel = null;
  bagelProjectiles = [];
  bagelAttackCooldown = 0;
  stageProgress = "explore";
  enemyActive = false;
}

export function initBossForLevel(index) {
  const levelData = levels[index];
  if (levelData.bagel) {
    bagel = { ...levelData.bagel };
    bagel.maxHealth = levelData.bagel.health || 4; 
    bagel.hitTimer = 0;
  } else {
    bagel = null;
  }
  bagelProjectiles = [];
  bagelAttackCooldown = 0;
  stageProgress = "boss";
  enemyActive = true; 
}

export function updateBossSystem(player, shootFartCallback) {
  if (!bagel) return;

  if (bagel.health <= 0) {
    bagelProjectiles = [];
    return;
  }

  if (enemyActive) {
    if (bagel.hitTimer > 0) {
      bagel.hitTimer--;
    }

    const dist = Math.abs((player.x + player.width / 2) - bagel.x);
    if (dist < 400) {
      if (bagelAttackCooldown <= 0) {
        throwBagelProjectile(player);
        bagelAttackCooldown = 60;
      } else {
        bagelAttackCooldown--;
      }
    } else {
      bagelAttackCooldown = 0;
    }

    updateBagelProjectiles();
  }
}

function throwBagelProjectile(player) {
  playEffect(fireballSound, 0.3);
  if (!bagel) return;
  const speed = 7;
  const direction = (player.x < bagel.x) ? -1 : 1;

  bagelProjectiles.push({
    x: bagel.x,
    y: bagel.y,
    width: 32, 
    height: 28,
    radius: 16,
    speedX: speed * direction,
    speedY: 0,
    isFireball: true 
  });
}

function updateBagelProjectiles() {
  bagelProjectiles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
  });

  bagelProjectiles = bagelProjectiles.filter(p =>
    p.y + p.radius > 0 &&
    p.y - p.radius < canvas.height
  );
}

export function checkBossCollisions(player, projectiles, showMessageCallback, startLevelCallback) {
  if (!bagel || !enemyActive) return projectiles;

  projectiles = projectiles.filter(p => {
    const hit =
      p.x < bagel.x + (bagel.radius || 30) &&
      p.x + p.width > bagel.x - (bagel.radius || 30) &&
      p.y < bagel.y + (bagel.radius || 30) &&
      p.y + p.height > bagel.y - (bagel.radius || 30);

    if (hit) {
      bagel.health--;
      bagel.hitTimer = 10;
      if (bagel.health <= 0) {
        enemyActive = false;
        if (player.currentLevelIndex === 1 ) { 
          console.log("Triggering cage_scene for Level 2");
          setGameState("cage_scene"); 
        } else {
          setGameState("won");
        }
      }
    }
    return !hit;
  });

  if (!player.isInvincible) {
    bagelProjectiles = bagelProjectiles.filter(p => {
      const hit =
        player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y;

      if (hit) {
        player.lives--;
        if (player.lives <= 0) {
          showMessageCallback("Game Over! Back to Level 1", 2000);
          startLevelCallback(0);
        } else {
          bagelProjectiles = []; 
          player.isInvincible = true;
          player.invincibleTimer = 90;
          showMessageCallback("Outch!", 1000);
        }
      }
      return !hit;
    });
  }

  return projectiles; 
}

export function drawBossSystem(ctx, currentLevelIndex, cameraOffsetX) {
  if (!bagel ) return;

  if (bagel.health > 0 && bagelProjectiles) {
  bagelProjectiles.forEach(p => {
    if (p.isFireball) {
      ctx.drawImage(fireballImg, p.x - cameraOffsetX - p.radius, p.y - p.radius, p.width, p.height);
    } else {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x - cameraOffsetX, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  });
}

  if (bagel.health <= 0) {
    if (currentLevelIndex === 1) {
      const cageX = 3000;
      const cageSize = 240;
      const cageY = 610 - cageSize; 

      ctx.drawImage(
        cageImg, 
        cageX - cameraOffsetX, 
        cageY, 
        cageSize, 
        cageSize  
      );
    }
  } else {
    if (!(bagel.hitTimer > 0 && bagel.hitTimer % 2 === 0)) {
      if (currentLevelIndex === 1 || bagel.type === "chat") {
        const chatRadius = (bagel.radius || 45);
        const drawSizeChat = chatRadius * 3.0; 
        ctx.drawImage(
          chatBossImg, 
          bagel.x - cameraOffsetX - drawSizeChat / 2, 
          bagel.y - drawSizeChat / 2, 
          drawSizeChat, 
          drawSizeChat
        );
      } 
      else if (bagel.type === "final" || currentLevelIndex === 2) {
        if (dadBossLoaded) {
          ctx.drawImage(
            dadBossImg,
            bagel.x - cameraOffsetX - 60,
            bagel.y - 40,
            120,
            120
          );
        } else {
          ctx.fillStyle = "#ffdbac"; 
          ctx.fillRect(bagel.x - cameraOffsetX - 30, bagel.y - 25, 60, 50);
        }
      } 
      else {
        const bagelRadius = (bagel.radius || 30);
        const drawSizeBagel = bagelRadius * 4; 
        ctx.drawImage(
          bagelBossImg, 
          bagel.x - cameraOffsetX - drawSizeBagel / 2, 
          bagel.y - drawSizeBagel / 2, 
          drawSizeBagel, 
          drawSizeBagel
        );
      }
    }

    const barWidth = 120;   
    const barHeight = 14;   
    const barX = bagel.x - cameraOffsetX - barWidth / 2;
    const currentRadius = bagel.radius || 30;
    
    let offsetFromTop = currentRadius + 30; 
    if (currentLevelIndex === 1 || bagel.type === "chat") {
      offsetFromTop = 90; 
    } else if (bagel.type === "final" || currentLevelIndex === 2) {
      offsetFromTop = 80; 
    } else {
      offsetFromTop = 70; 
    }
    
    const barY = bagel.y - offsetFromTop; 

    ctx.beginPath();
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const maxHp = bagel.maxHealth && bagel.maxHealth > 0 ? bagel.maxHealth : 4;
    const healthPercentage = Math.max(0, Math.min(1, bagel.health / maxHp));
    
    ctx.fillStyle = "#00ffcc"; 
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.font = "10px 'Press Start 2P', Arial"; 
    ctx.textAlign = "center";
    const bossName = bagel.name || "Boss"; 
    const hpText = `${bossName} HP: ${bagel.health}`;
    ctx.fillText(hpText, bagel.x - cameraOffsetX, barY - 10); 
    
    ctx.textAlign = "start";
  }
}