import { levels } from "./levels.js";
import { gameState, setGameState, handleMenuInput, drawUI } from './ui.js';
export { setGameState } from './ui.js';
import { drawStoryDialog, currentDialogStep, incrementDialogStep, resetDialogStep } from "./dialogs.js";
import {
    handleInventoryClick,
    toggleInventory,
    initInventory,
    addItemToInventory,
    drawTopLeftUI,
    updateInventoryDOM,
    isInventoryVisible
} from "./inventory.js";

import {
    initBossForLevel,
    updateBossSystem,
    checkBossCollisions,
    drawBossSystem,
    resetBossSystem,
    triggerBossFight,
    stageProgress,
    enemyActive
} from "./boss.js";
import { 
    playEffect, 
    bgMusic, 
    birthdaySound, 
    playerHitSound, 
    fireballSound, 
    collectSound, 
    fartSound,
    teleportSound, 
    yippeeSound,
    forcePlayMusic, 
    currentTrack
} from './sound.js';

var collectedItemImages = [];

function updateInventoryImages() {
    collectedItemImages.forEach((item, index) => {
        const slot = document.getElementById(`slot-${index}`);
        if (!slot || !item.image) return;

        slot.innerHTML = "";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.title = item.name;
        img.style.width = "34px";
        img.style.height = "34px";
        img.style.objectFit = "contain";
        slot.appendChild(img);
    });
}

function keepCageSceneLevelTwoOnly() {
    if (currentLevelIndex === 1) return;

    document
        .querySelectorAll([
            '[id*="cage" i]',
            '[class*="cage" i]',
            '[id*="dialog" i]',
            '[class*="dialog" i]',
            '[id*="dialogue" i]',
            '[class*="dialogue" i]',
            '[id*="speech" i]',
            '[class*="speech" i]',
            '[id*="bubble" i]',
            '[class*="bubble" i]',
            '[id*="lightning" i]',
            '[class*="lightning" i]',
            '[id*="flash" i]',
            '[class*="flash" i]',
            '[id*="blitz" i]',
            '[class*="blitz" i]'
        ].join(", "))
        .forEach(element => {
            if (element.id === "won-overlay" || element.closest("#won-overlay")) return;
            if (element.id === "pause-overlay" || element.closest("#pause-overlay")) return;
            if (element.id === "lifeLostMessage") return;

            element.classList.add("hidden");
            element.style.display = "none";
        });
}

setGameState("menu");
forcePlayMusic('menu');


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
export const canvasWidth = canvas.width;
const settingsBtn = document.getElementById("settingsBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const pauseOverlay = document.getElementById("pause-overlay");

settingsBtn.innerHTML = '<img src="./assets/settings.png" alt="Settings" style="width: 100%; height: 100%; object-fit: contain; display: block;">';
settingsBtn.style.width = "46px";
settingsBtn.style.height = "46px";
settingsBtn.style.padding = "6px";

// --- BILDER LADEN ---
const level1Bg = new Image();
let level1BgLoaded = false;
level1Bg.onload = () => { level1BgLoaded = true; };
level1Bg.src = "./assets/level 1 hintergrund.png";

const level2Bg = new Image();
let level2BgLoaded = false;
level2Bg.onload = () => { level2BgLoaded = true; };
level2Bg.src = "./assets/level 2 hintergrund.png";

const level3Bg = new Image();
let level3BgLoaded = false;
level3Bg.onload = () => { level3BgLoaded = true; };
level3Bg.src = "./assets/level 3 hintergrund.png";

const npcPlantImg = new Image();
let npcPlantLoaded = false;
npcPlantImg.onload = () => { npcPlantLoaded = true; };
npcPlantImg.src = "./assets/pflanze_lv1.png";

const npcHamsterImg = new Image();
let npcHamsterLoaded = false;
npcHamsterImg.onload = () => { npcHamsterLoaded = true; };
npcHamsterImg.src = "./assets/hamster.png";

const worldCherryImg = new Image();
worldCherryImg.src = "./assets/cherry.png";

const npcGhostImg = new Image();
let npcGhostLoaded = false;
npcGhostImg.onload = () => { npcGhostLoaded = true; };
npcGhostImg.src = "./assets/ghost.png";

const portalImg = new Image();
let portalImgLoaded = false;
portalImg.onload = () => { portalImgLoaded = true; };
portalImg.src = "./assets/portal.png";


// --- CHARAKTER SPRITESHEET LADEN ---
const playerRunSprite = new Image();
playerRunSprite.src = "./assets/rubi_run.png";

const fartImg = new Image();
let fartImgLoaded = false;
fartImg.onload = () => { fartImgLoaded = true; };
fartImg.src = "./assets/fart.png";

const levelThreePortalImg = new Image();
let levelThreePortalImgLoaded = false;
const levelThreePortalImgPaths = [
    "./assets/portal.png",
    "./assets/portal.png"
];
let levelThreePortalImgPathIndex = 0;
levelThreePortalImg.onload = () => {
    levelThreePortalImgLoaded = true;
};
levelThreePortalImg.onerror = () => {
    levelThreePortalImgPathIndex++;
    if (levelThreePortalImgPathIndex < levelThreePortalImgPaths.length) {
        levelThreePortalImg.src = levelThreePortalImgPaths[levelThreePortalImgPathIndex];
    }
};
levelThreePortalImg.src = levelThreePortalImgPaths[levelThreePortalImgPathIndex];

const floorImg = new Image();
let floorImgLoaded = false;
floorImg.onload = () => {
    floorImgLoaded = true;
};
floorImg.src = "./assets/floor_j.png";

const moonFloorImg = new Image();
let moonFloorImgLoaded = false;
const moonFloorImgPaths = [
    "./assets/floor_m.png",
    "./assets/floor_m.jpg"
];
let moonFloorImgPathIndex = 0;
moonFloorImg.onload = () => {
    moonFloorImgLoaded = true;
};
moonFloorImg.onerror = () => {
    moonFloorImgPathIndex++;
    if (moonFloorImgPathIndex < moonFloorImgPaths.length) {
        moonFloorImg.src = moonFloorImgPaths[moonFloorImgPathIndex];
    }
};
moonFloorImg.src = moonFloorImgPaths[moonFloorImgPathIndex];

export let cameraOffsetX = 0;
export let currentLevelIndex = 0;

// 3 lila Kästen untereinander platziert (X: 150, Breite: 600 für perfekten Platz)
const quizButtons = [
    { id: 1, text: "I love her honestly.", x: 150, y: 220, w: 600, h: 50 },
    { id: 2, text: "I will build her a Mouse-Shrine.", x: 150, y: 290, w: 600, h: 50 },
    { id: 3, text: "Boobs or tits?", x: 150, y: 360, w: 600, h: 50 }
];

const enterPortalButton = { text: "PASS PORTAL", x: 300, y: 320, w: 300, h: 50 };

let hoveredButtonId = null;
let isEnterPortalHovered = false;

// Global definierte Zustände für das Quiz-System
let quizActive = false;
let quizPhase = "question"; // "question", "success", "finale_pic", "finale_letter"

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (quizActive) {
        if (quizPhase === "question") {
            quizButtons.forEach(btn => {
                if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                    if (btn.id === 2) {
                        showMessage("¡No! Try again!", 2000);
                    }
                    if (btn.id === 1) {
                        quizPhase = "success";
                    }
                    if (btn.id === 3) {
                        player.lives = 0;
                        showMessage("¡ERRÓNEO! You are playing with fire!", 2000);
                    }
                }
            });
        }
        else if (quizPhase === "success") {
            const btn = enterPortalButton;
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                playEffect(teleportSound, 0.2);
                teleportFlashTimer = 120;
                setTimeout(() => {
                    quizPhase = "finale_pic";
                }, 1200);
            }
        }
        else if (quizPhase === "finale_pic") {
            const btn = { x: 300, y: 480, w: 300, h: 50 };
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                forcePlayMusic('menu');
                quizPhase = "finale_letter";
            }
        }
        else if (quizPhase === "finale_letter") {
    const btn = { x: 300, y: 520, w: 300, h: 45 };
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
        
        forcePlayMusic('menu');

        document.body.classList.remove("game-running");
        quizActive = false;
        quizPhase = "question";
        gameContainer.style.display = "none";
        settingsBtn.style.display = "none";
        menu.style.display = "block";
        quoteBox.style.display = "block";

        if (typeof randomQuote === "function") {
            clearInterval(window.quoteInterval);
            window.quoteInterval = setInterval(randomQuote, 4000);
        }
        setGameState("menu");
    }
}
        return;
    }

    handleInventoryClick(event, canvas);
    updateInventoryDOM();
});

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (quizActive) {
        hoveredButtonId = null;
        isEnterPortalHovered = false;
        let anyHovered = false;

        if (quizPhase === "question") {
            quizButtons.forEach(btn => {
                if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                    hoveredButtonId = btn.id;
                    anyHovered = true;
                }
            });
        }
        else if (quizPhase === "success") {
            const btn = enterPortalButton;
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                isEnterPortalHovered = true;
                anyHovered = true;
            }
        }
        else if (quizPhase === "finale_pic") {
            const btn = { x: 300, y: 460, w: 300, h: 50 };
            if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
                anyHovered = true;
            }
        }

        canvas.style.cursor = anyHovered ? "pointer" : "default";
        return;
    }

    if (mouseX >= 15 && mouseX <= 190 && mouseY >= 105 && mouseY <= 150) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }
});

class Player {
    constructor() {
        this.width = 100;   // Breite im Spiel
        this.height = 400; // Extreme Höhe (gewünschte Streckung)

        this.speed = 5;
        this.gravity = 0.5;
        this.jumpForce = -12;

        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.currentFrame = 0;
        this.frameCount = 4;
        this.animTimer = 0;
        this.animSpeed = 6;
        this.direction = 1;

        this.reset();
    }

    reset() {
        this.x = 50;
        this.y = 550 - this.height
        this.dx = 0;
        this.dy = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.jumpCount = 0;
        this.lives = 3;
        this.isInvincible = false;
        this.invincibleTimer = 0;

        this.currentFrame = 0;
        this.animTimer = 0;
        this.direction = 1;
    }

    jump() {
        if (this.jumpCount < 2) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.jumpCount++;
        }
    }

    move(keys) {
        this.dx = 0;
        if (keys["ArrowLeft"] || keys["a"]) this.dx = -this.speed;
        if (keys["ArrowRight"] || keys["d"]) this.dx = this.speed;

        this.x += this.dx;
        this.velocityY += this.gravity;
        this.y += this.velocityY;
    }
}

const player = new Player();

let levelData, platforms = [], cherries = [];
export let score = 0;
let keys = {};
let projectiles = [];
let showInteractionPrompt = false;
let hamster = null;
let hamsterMessage = "";
let teleportFlashTimer = 0;

const levelThreePortal = {
    x: 4180,
    y: 290,
    width: 350,
    height: 300,
    interactionRadius: 135
};
let levelThreePortalUnlocked = false;
let showPortalPrompt = false;
let levelOneBossCompleted = false;

function isPlayerNearPortal() {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const portalCenterX = levelThreePortal.x + levelThreePortal.width / 2;
    const portalCenterY = levelThreePortal.y + levelThreePortal.height / 2;
    const dx = playerCenterX - portalCenterX;
    const dy = playerCenterY - portalCenterY;

    return Math.sqrt(dx * dx + dy * dy) <= levelThreePortal.interactionRadius;
}

function openQuizFromPortal() {
    const quizOpeners = [
        window.openQuiz,
        window.startQuiz,
        window.showQuiz,
        window.openFinalQuiz,
        window.startFinalQuiz
    ];
    const opener = quizOpeners.find(fn => typeof fn === "function");

    if (opener) {
        opener();
        return;
    }

    document.dispatchEvent(new CustomEvent("openQuiz"));
    window.dispatchEvent(new CustomEvent("openQuiz"));

    const quizButton = document.getElementById("quizBtn")
        || document.getElementById("startQuizBtn")
        || document.getElementById("openQuizBtn")
        || document.querySelector("[data-open-quiz]")
        || document.querySelector(".quiz-btn");

    if (quizButton) {
        quizButton.click();
        return;
    }

    const quizElement = document.getElementById("quiz-overlay")
        || document.getElementById("quizOverlay")
        || document.getElementById("quiz-container")
        || document.getElementById("quizContainer")
        || document.getElementById("quiz")
        || document.querySelector(".quiz-overlay")
        || document.querySelector(".quiz-container")
        || document.querySelector(".quiz");

    if (quizElement) {
        quizElement.classList.remove("hidden");
        quizElement.style.display = "block";
    } else {
        showMessage("Quiz not found", 2500);
    }
}

function interactWithLevelCharacter() {
    if (!hamster || hamster.interacted) return false;

    const dx = (player.x + player.width / 2) - (hamster.x + hamster.width / 2);
    const dy = (player.y + player.height / 2) - (hamster.y + hamster.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    const interactionRadius = currentLevelIndex === 2
        ? Math.max(hamster.interactionRadius, 140)
        : hamster.interactionRadius;

    if (dist > interactionRadius) return false;

    hamster.interacted = true;
    player.lives++;
    const itemToCollect = hamster.item;
    addItemToInventory(itemToCollect);
    if (itemToCollect?.image) {
        collectedItemImages.push(itemToCollect);
        updateInventoryImages();
    }
    hamsterMessage = hamster.message;
    showInteractionPrompt = false;

    return true;
}

function drawLevelThreePortal() {
    if (currentLevelIndex !== 2) return;

    if (levelThreePortalImgLoaded) {
        ctx.drawImage(
            levelThreePortalImg,
            levelThreePortal.x - cameraOffsetX,
            levelThreePortal.y,
            levelThreePortal.width,
            levelThreePortal.height
        );
    } else {
        ctx.fillStyle = "#7b2cff";
        ctx.fillRect(
            levelThreePortal.x - cameraOffsetX,
            levelThreePortal.y,
            levelThreePortal.width,
            levelThreePortal.height
        );
    }

    if (showPortalPrompt) {
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "[E]",
            levelThreePortal.x - cameraOffsetX + levelThreePortal.width / 2,
            levelThreePortal.y - 14
        );
        ctx.textAlign = "start";
    }
}

export function startLevel(index) {
    if (typeof levels === "undefined" || !levels || !levels[index]) {
        setGameState("playing");
        levelData = {
            platforms: [{ x: 0, y: 550, width: 900, height: 50 }],
            cherries: []
        };
    } else {
        levelData = levels[index];
    }
    if (index === 0) {
        initInventory();
    } else {
        updateInventoryDOM();
    }

    currentLevelIndex = index;
    levelThreePortalUnlocked = false;
    showPortalPrompt = false;
    levelOneBossCompleted = false;
    platforms = (levelData.platforms || []).map(platform => {
        const isFloatingPlatform = platform.y < 520 && platform.height <= 25;

        if (!isFloatingPlatform) {
            return platform;
        }

        return {
            ...platform,
            y: platform.y - 8,
            height: 36
        };
    });
    cherries = (levelData.cherries || []).map(c => ({ ...c }));

    initBossForLevel(index);

    projectiles = [];
    hamsterMessage = "";

    player.reset();

    if (index === 0) {
        player.lives = 3;
    }

    if (levelData.hamster) {
        hamster = {
            x: levelData.hamster.x,
            y: levelData.hamster.y,
            width: levelData.hamster.width,
            height: levelData.hamster.height,
            interactionRadius: levelData.hamster.interactionRadius,
            message: levelData.hamster.message,
            item: levelData.hamster.item,
            interacted: false
        };
    } else {
        hamster = null;
    }

    setGameState("playing");
}

document.addEventListener("keydown", (e) => {
    // 1. Cheat-Taste P zum Testen
    if (e.key.toLowerCase() === "p" && currentLevelIndex === 2) {
        enemyActive = false;
        showMessage("Boss defeated! Walk right to the Portal!", 2000);
        return;
    }

    // INTERAKTION MIT DEM PORTAL (NUR IN LEVEL 3)
    if (e.key.toLowerCase() === "e" && currentLevelIndex === 2 && isPlayerNearPortal()) {
        quizActive = true;       // Schaltet den lila Quiz-Bildschirm ein!
        quizPhase = "question";  // Startet bei der ersten Frage
        return;
    }

    if (handleMenuInput(e, startLevel)) return;

    if (gameState === "cage_scene" && e.key === " ") {
        if (Math.abs(player.x - 3000) < 150) {
            incrementDialogStep();
            if (currentDialogStep >= 2) {
                resetDialogStep();
                playEffect(teleportSound, 0.2);
                teleportFlashTimer = 120;
                setTimeout(() => {
                    setGameState("won");
                }, 1200);
            }
            return;
        }
    }

    if (gameState === "playing" || gameState === "won" || gameState === "cage_scene") {
        keys[e.key] = true;
        if ([" ", "ArrowUp", "w"].includes(e.key.toLowerCase())) {
            if (Math.abs(player.x - 3000) >= 150) {
                player.jump();
            }
        }
        if (e.key.toLowerCase() === "f") {
            shootFart();
        }
    }

    if (gameState === "won" && currentLevelIndex === 2) {
        quizActive = true;
        if (quizPhase === "question") {
            if (e.key === "1") showMessage("¡No! Try again!", 2000);
            if (e.key === "2") {
                quizPhase = "success";
                showMessage(" ¡Está bien! The portal is opening...", 2000);
            }
            if (e.key === "3") {
                player.lives = 0;
                showMessage(" ¡ERRÓNEO! You are playing with fire!", 2000);
            }
        }
        else if (quizPhase === "success" && e.key === " ") {
            teleportFlashTimer = 120;
            setTimeout(() => {
                quizPhase = "finale_pic";
            }, 1200);
        }
        return;
    }

    if (gameState === "won" && e.key === " " && currentLevelIndex < 2) {
        startLevel(currentLevelIndex + 1);
    }

    // INTERAKTION MIT PFLANZE/HAMSTER (NUR IN LEVEL 1 & 2)
    if (gameState === "playing" && e.key.toLowerCase() === "e" && currentLevelIndex <= 2) {
        if (!hamster || hamster.interacted) return;
        const playerFeetX = player.x + player.width / 2;
        const playerFeetY = player.y + player.height;

        const hamsterCenterX = hamster.x + hamster.width / 2;
        const hamsterCenterY = hamster.y + hamster.height / 2;

        const dx = playerFeetX - hamsterCenterX;
        const dy = playerFeetY - hamsterCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= hamster.interactionRadius) {
            hamster.interacted = true;
            if (currentLevelIndex === 1) {
            playEffect(yippeeSound, 0.2);
            }
            player.lives++;
            addItemToInventory(hamster.item);

            const slot = document.getElementById(`slot-${currentLevelIndex}`);
            if (slot && hamster.item.image) {
                slot.innerHTML = "";
                const img = document.createElement("img");
                img.src = hamster.item.image;
                img.alt = hamster.item.name;
                img.style.width = "50px";
                img.style.height = "50px";
                img.style.objectFit = "contain";
                slot.appendChild(img);
            }
            hamsterMessage = hamster.message;
            showInteractionPrompt = false;
        }
    }

    if (gameState === "playing" && e.key.toLowerCase() === "i") {
        toggleInventory();
        updateInventoryDOM();

        const invBox = document.getElementById("inventoryBox");
        if (isInventoryVisible()) {
            invBox.classList.remove("hidden");
        } else {
            invBox.classList.add("hidden");
        }
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function showMessage(text, duration = 1500) {
    const msgBox = document.getElementById("lifeLostMessage");
    msgBox.textContent = text;
    msgBox.style.display = "block";
    msgBox.classList.add("show");

    clearTimeout(msgBox._hideTimeout);
    msgBox._hideTimeout = setTimeout(() => {
        msgBox.classList.remove("show");
        msgBox.style.display = "none";
    }, duration);
}

function handlePlayerFall() {
    if (player.y > canvas.height + 20) {
        player.lives--;
        playEffect(playerHitSound, 0.4);
        if (player.lives <= 0) {
            showMessage("Game Over! Back to Level 1 😵", 3000);
            currentLevelIndex = 0;
            score = 0;
            resetBossSystem();
            startLevel(currentLevelIndex);
        } else {
            let safePlatform = platforms[0];
            let minDistance = Math.abs(player.x - platforms[0].x);

            for (let plat of platforms) {
                let dist = Math.abs(player.x - (plat.x + plat.width / 2));
                if (dist < minDistance) {
                    minDistance = dist;
                    safePlatform = plat;
                }
            }
            player.x = safePlatform.x + safePlatform.width / 2 - player.width / 2;
            player.y = safePlatform.y - player.height;
            player.velocityY = 0;
            player.jumpCount = 0;
            showMessage("Nuuuu...", 1000);
        }
    }
}

function movePlayer() {
    if (gameState === "won") return;

    player.move(keys);
    player.onGround = false;

    for (let plat of platforms) {
        if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height <= plat.y + player.velocityY &&
            player.y + player.height + player.velocityY >= plat.y
        ) {
            player.y = plat.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
            player.jumpCount = 0;
        }
    }

    if (player.x < 0) player.x = 0;

    cameraOffsetX = Math.max(0, player.x - canvasWidth / 2);

    if (player.isInvincible) {
        player.invincibleTimer--;
        if (player.invincibleTimer <= 0) {
            player.isInvincible = false;
        }
    }

    if (player.dx !== 0 && player.onGround) {
        player.animTimer++;
        if (player.animTimer >= player.animSpeed) {
            player.currentFrame = (player.currentFrame + 1) % player.frameCount;
            player.animTimer = 0;
        }

        if (player.dx > 0) player.direction = 1;
        if (player.dx < 0) player.direction = -1;
    } else {
        player.currentFrame = 0;
    }
}

function shootFart() {
    playEffect(fartSound, 0.3);
    projectiles.push({
        x: player.x + player.width,
        y: player.y + 360,
        width: 20,
        height: 10,
        speed: 8,
        color: "#a5d6a7"
    });
}

function updateProjectiles() {
    projectiles.forEach(p => p.x += p.speed);
    projectiles = projectiles.filter(p => p.x < canvas.width + cameraOffsetX);
}

function checkCherryCollision() {
    cherries = cherries.filter(c => {
        const hit =
            player.x < c.x + c.radius &&
            player.x + player.width > c.x - c.radius &&
            player.y < c.y + c.radius &&
            player.y + player.height > c.y - c.radius;
        if (hit) {
            score++;
            playEffect(collectSound, 0.2);
        }
        return !hit;
    });
}

function drawBackground() {
    let activeBg = null;
    let isLoaded = false;

    if (currentLevelIndex === 0) { activeBg = level1Bg; isLoaded = level1BgLoaded; }
    else if (currentLevelIndex === 1) { activeBg = level2Bg; isLoaded = level2BgLoaded; }
    else if (currentLevelIndex === 2) { activeBg = level3Bg; isLoaded = level3BgLoaded; }

    if (isLoaded && activeBg) {
        const bgHeight = canvas.height;
        const bgWidth = activeBg.width * (bgHeight / activeBg.height);
        let bgX = -((cameraOffsetX * 0.35) % bgWidth);

        while (bgX < canvas.width) {
            ctx.drawImage(activeBg, bgX, 0, bgWidth, canvas.height);
            bgX += bgWidth;
        }
    } else {
        ctx.fillStyle = currentLevelIndex === 2 ? "#0b132b" : "#aadedf";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawPlayer() {
    if (player.isInvincible && player.invincibleTimer % 4 < 2) {
        return;
    }

    if (playerRunSprite.complete && playerRunSprite.width > 0) {
        player.spriteWidth = playerRunSprite.width / player.frameCount;
        player.spriteHeight = playerRunSprite.height;
    } else {
        player.spriteWidth = 128;
        player.spriteHeight = 128;
    }

    ctx.save();

    const sourceX = player.currentFrame * player.spriteWidth;
    const sourceY = 0;
    const screenX = player.x - cameraOffsetX;
    const screenY = player.y;

    if (player.direction === -1) {
        ctx.translate(screenX + player.width / 2, screenY + player.height / 2);
        ctx.scale(-1, 1);
        ctx.translate(-(screenX + player.width / 2), -(screenY + player.height / 2));
    }

    const FOOT_OFFSET = 167;

    ctx.drawImage(
        playerRunSprite,
        sourceX,
        sourceY,
        player.spriteWidth,
        player.spriteHeight,
        screenX,
        screenY + FOOT_OFFSET,
        player.width,
        player.height
    );

    ctx.restore();
}

function drawPlatforms() {
    platforms.forEach(p => {
        const platformImg = currentLevelIndex === 2 ? moonFloorImg : floorImg;
        const platformImgLoaded = currentLevelIndex === 2 ? moonFloorImgLoaded : floorImgLoaded;

        if (platformImgLoaded) {
            const tileHeight = p.height;
            const tileWidth = platformImg.width * (tileHeight / platformImg.height);
            let x = p.x - cameraOffsetX;
            const endX = x + p.width;

            while (x < endX) {
                const drawWidth = Math.min(tileWidth, endX - x);
                ctx.drawImage(
                    platformImg,
                    0,
                    0,
                    platformImg.width * (drawWidth / tileWidth),
                    platformImg.height,
                    x,
                    p.y,
                    drawWidth,
                    tileHeight
                );
                x += tileWidth;
            }
        } else {
            ctx.fillStyle = "#795548";
            ctx.fillRect(p.x - cameraOffsetX, p.y, p.width, p.height);
        }
    });
}

function drawCherries() {
    cherries.forEach(c => {
        const size = c.radius * 5.0;
        ctx.drawImage(
            worldCherryImg,
            c.x - cameraOffsetX - size / 2,
            c.y - size / 2,
            size,
            size
        );
    });
}

function drawProjectiles() {
    projectiles.forEach(p => {
        if (fartImgLoaded) {
            ctx.drawImage(
                fartImg,
                p.x - cameraOffsetX,
                p.y,
                50,
                50
            );
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - cameraOffsetX, p.y, p.width, p.height);
        }
    });
}

function drawHamster() {
    if (!hamster) return;

    if (currentLevelIndex === 0 && npcPlantLoaded) {
        ctx.drawImage(npcPlantImg, hamster.x - cameraOffsetX, hamster.y, hamster.width, hamster.height);
    } else if (currentLevelIndex === 1 && npcHamsterLoaded) {
        ctx.drawImage(npcHamsterImg, hamster.x - cameraOffsetX, hamster.y, hamster.width, hamster.height);
    }
    else if (currentLevelIndex === 2 && npcGhostLoaded) {
        const ghostVisualY = hamster.y - 60;

        ctx.save();
        ctx.globalAlpha = 0.6;

        ctx.drawImage(
            npcGhostImg,
            hamster.x - cameraOffsetX,
            ghostVisualY,
            95,
            95
        );

        ctx.restore();
    }
    else {
        ctx.font = "38px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const centerX = hamster.x - cameraOffsetX + hamster.width / 2;
        const centerY = hamster.y + hamster.height / 2;
        ctx.fillText("🙋‍♀️", centerX, centerY);
        ctx.textAlign = "start";
    }
}

function handleHamsterProximity() {
    if (!hamster) {
        showInteractionPrompt = false;
        return;
    }

    const playerFeetX = player.x + player.width / 2;
    const playerFeetY = player.y + player.height;

    const hamsterCenterX = hamster.x + hamster.width / 2;
    const hamsterCenterY = hamster.y + hamster.height / 2;

    const dx = playerFeetX - hamsterCenterX;
    const dy = playerFeetY - hamsterCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= hamster.interactionRadius && !hamster.interacted) {
        showInteractionPrompt = true;
    } else {
        showInteractionPrompt = false;
    }
}

function drawHamsterMessage() {
    if (hamsterMessage && hamster) {
        ctx.font = "10px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textX = hamster.x + hamster.width / 2 - cameraOffsetX;

        let offsetY = 45; 
        if (currentLevelIndex === 2) {
            offsetY = 105;  // Höherer Abstand für Geist
        }

        const textY = hamster.y - offsetY;

        let lines = [];
        if (currentLevelIndex === 2) {
            lines = [
                "My physical body is trapped back on Earth,",
                "but my soul will always find a way to you."
            ];
        } else {
            lines = [hamsterMessage];
        }

        let maxTextWidth = 0;
        lines.forEach(line => {
            const w = ctx.measureText(line).width;
            if (w > maxTextWidth) maxTextWidth = w;
        });

        const boxWidth = maxTextWidth + 30;
        const lineHeight = 16;
        const boxHeight = (lines.length * lineHeight) + 20;

        ctx.fillStyle = "rgba(38, 18, 112, 0.9)";
        ctx.beginPath();
        ctx.roundRect(textX - boxWidth / 2, textY - boxHeight / 2, boxWidth, boxHeight, 8);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "rgba(38, 18, 112, 0.9)";
        ctx.moveTo(textX - 8, textY + boxHeight / 2);
        ctx.lineTo(textX + 8, textY + boxHeight / 2);
        ctx.lineTo(textX, textY + boxHeight / 2 + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        lines.forEach((line, index) => {
            const lineY = textY - (boxHeight / 2) + 18 + (index * lineHeight);
            ctx.fillText(line, textX, lineY);
        });

        ctx.textAlign = "start";
    }
}

function drawInteractionPrompt() {
    if (showInteractionPrompt && hamster) {
        ctx.font = "14px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textX = hamster.x + hamster.width / 2 - cameraOffsetX;
        const textY = hamster.y - 25;

        ctx.fillStyle = "white";
        ctx.fillText("[E]", textX, textY);
        ctx.textAlign = "start";
    }
}

function updateGame() {
 keepCageSceneLevelTwoOnly();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === "menu") {
        if (currentTrack !== birthdaySound) {
        }
        drawUI(ctx, canvas, currentLevelIndex, score, player.lives);
        requestAnimationFrame(updateGame);
        return;
    }

    if (gameState === "playing" || gameState === "paused" || gameState === "won" || gameState === "cage_scene") {
        platforms.forEach(plat => {
            if (plat.isMoving) {
                if (!plat.speedX) plat.speedX = 2;
                plat.x += plat.speedX;
                if (plat.x > plat.startX + plat.rangeX || plat.x < plat.startX) {
                    plat.speedX *= -1;
                }
            }
        });
        drawBackground();
        drawPlatforms();
        drawHamster();
        drawPlayer();
        drawCherries();
        drawProjectiles();

        if (gameState === "playing" || gameState === "cage_scene") {
            handlePlayerFall();

            let onPlatform = null;
            for (let plat of platforms) {
                if (
                    player.x + player.width > plat.x &&
                    player.x < plat.x + plat.width &&
                    player.y + player.height <= plat.y + player.velocityY &&
                    player.y + player.height + player.velocityY >= plat.y
                ) {
                    onPlatform = plat;
                }
            }

            movePlayer();
            handleHamsterProximity();
            showPortalPrompt = currentLevelIndex === 2
                && isPlayerNearPortal();

            if (onPlatform && onPlatform.isMoving) {
                player.x += onPlatform.speedX;
            }

            updateProjectiles();
            checkCherryCollision();

            if (!levelOneBossCompleted) {
                updateBossSystem(player, shootFart);
                projectiles = checkBossCollisions(player, projectiles, showMessage, startLevel);
            }
            if (
                currentLevelIndex === 0
                && stageProgress === "boss"
                && (gameState === "won" || !enemyActive)
            ) {
                levelOneBossCompleted = true;
                keepCageSceneLevelTwoOnly();
                resetBossSystem();
                setGameState("won");
            }
            // NEUER CODE FÜR LEVEL 2 (Index 1)
            if (currentLevelIndex === 1 && stageProgress === "boss" && !enemyActive) {
                // Nur den Status auf "cage_scene" setzen, wenn wir nicht schon drin sind.
                // KEIN "won", KEIN "playing", KEIN Portal-Code!
                if (gameState !== "cage_scene") {
                    setGameState("cage_scene");
                }
            }

            if (currentLevelIndex === 2 && stageProgress === "boss" && !enemyActive && !levelThreePortalUnlocked) {
                levelThreePortalUnlocked = true;
                showPortalPrompt = false;
                setGameState("playing");
                const wonOverlayEl = document.getElementById("won-overlay");
                if (wonOverlayEl) wonOverlayEl.classList.add("hidden");
                showMessage("A portal appeared!", 2000);
            }
        }

        if (!levelOneBossCompleted) {
        drawBossSystem(ctx, currentLevelIndex, cameraOffsetX);
        }
        if (currentLevelIndex === 2 && !enemyActive) {
            const portalWorldX = 160; // Position im Level nach dem Boss
            const portalWorldY = 400;  // Auf der Plattform platziert
            const portalWidth = 400;
            const portalHeight = 600;

            if (portalImgLoaded) {
                ctx.drawImage(portalImg, portalWorldX - cameraOffsetX, portalWorldY - portalHeight, portalWidth, portalHeight);
            } else {
                ctx.fillStyle = "#00ffcc";
                ctx.fillRect(portalWorldX - cameraOffsetX, portalWorldY - portalHeight, portalWidth, portalHeight);
            }

            const playerCenterX = player.x + player.width / 2;
            if (Math.abs(playerCenterX - (portalWorldX + portalWidth / 2)) < 100 && !quizActive) {
                ctx.font = "14px 'Press Start 2P', Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.fillText("[E] ENTER PORTAL", player.x + player.width / 2 - cameraOffsetX, player.y - 25);
                ctx.textAlign = "start";
            }
        }

        if (gameState === "cage_scene") {
            if (currentLevelIndex === 1) {
                const distanceToCage = Math.abs(player.x - 3000);

                if (distanceToCage < 150) {
                    if (typeof drawStoryDialog === "function") {
                        drawStoryDialog(ctx, player.x, player.y, cameraOffsetX);
                    }
                }
            } else {
                setGameState("won");
            }
        }

        drawLevelThreePortal();
        drawTopLeftUI(ctx, score, player.lives, currentLevelIndex);
        drawHamsterMessage();
        drawInteractionPrompt();
        drawUI(ctx, canvas, currentLevelIndex, score, player.lives);

        // ================= INTERAKTIVES PORTAL-QUIZ SYSTEM =================
        if (quizActive) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (quizPhase === "question") {
                ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = "14px 'Press Start 2P', Arial";
                ctx.fillStyle = "white";
                ctx.fillText("¿Qué hace feliz a Lia?", canvas.width / 2, 140);

                quizButtons.forEach(btn => {
                    if (hoveredButtonId === btn.id) {
                        ctx.fillStyle = "rgba(100, 50, 200, 0.95)";
                    } else {
                        ctx.fillStyle = "rgba(38, 18, 112, 0.9)";
                    }

                    ctx.beginPath();
                    ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 12);
                    ctx.fill();
                    ctx.closePath();

                    ctx.fillStyle = "white";
                    ctx.font = "10px 'Press Start 2P', Arial";
                    ctx.fillText(btn.text, btn.x + btn.w / 2, btn.y + btn.h / 2);
                });
            }
            else if (quizPhase === "success") {
                ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = "26px 'Press Start 2P', Arial";
                ctx.fillStyle = "#da9aff";
                ctx.fillText("Está bien", canvas.width / 2, 180);

                ctx.font = "12px 'Press Start 2P', Arial";
                ctx.fillStyle = "white";
                ctx.fillText("You proved your love! The portal grants you passage...", canvas.width / 2, 240);

                const pBtn = enterPortalButton;
                ctx.lineWidth = 3;
                ctx.fillStyle = isEnterPortalHovered ? "rgba(100, 50, 200, 1)" : "rgba(38, 18, 112, 0.9)";
                ctx.strokeStyle = "#da9aff";

                ctx.beginPath();
                ctx.roundRect(pBtn.x, pBtn.y, pBtn.w, pBtn.h, 10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.fillStyle = "white";
                ctx.font = "11px 'Press Start 2P', Arial";
                ctx.fillText(pBtn.text, pBtn.x + pBtn.w / 2, pBtn.y + pBtn.h / 2);
            }
            else if (quizPhase === "finale_pic") {
                if (typeof startBg === 'undefined') {
                    window.startBg = new Image();
                    window.startBg.src = "assets/startscreen.jpg";
                    window.coupleImg = new Image();
                    window.coupleImg.src = "assets/couple.png";
                }

                if (window.startBg.complete) {
                    ctx.drawImage(window.startBg, 0, 0, canvas.width, canvas.height);
                } else {
                    ctx.fillStyle = "#aadedf";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                if (window.coupleImg.complete) {
                    ctx.drawImage(window.coupleImg, (canvas.width - 200) / 2, (canvas.height - 200) / 2 + 10, 200, 200);
                }

                ctx.font = "26px 'Press Start 2P', Arial";
                ctx.fillStyle = "#261270";
                ctx.fillText("✨ Boo Boo time ✨", canvas.width / 2, 140);

                const bBtn = { x: 300, y: 480, w: 300, h: 50 };
                ctx.lineWidth = 3;
                ctx.fillStyle = "rgba(38, 18, 112, 0.9)";
                ctx.strokeStyle = "#da9aff";

                ctx.beginPath();
                ctx.roundRect(bBtn.x, bBtn.y, bBtn.w, bBtn.h, 10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.fillStyle = "white";
                ctx.font = "11px 'Press Start 2P', Arial";
                ctx.fillText("READ LETTER", bBtn.x + bBtn.w / 2, bBtn.y + bBtn.h / 2);
            }
            else if (quizPhase === "finale_letter") {
                ctx.fillStyle = "#0f0c24";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = "24px 'Press Start 2P', Arial";
                ctx.fillStyle = "#ffd1dc";
                ctx.fillText("Happy Birthday! 🎉", canvas.width / 2, 60);

                ctx.font = "10px 'Press Start 2P', Arial";
                ctx.fillStyle = "white";

                let letterLines = [
                    "Dear Rubén,",
                    "",
                    "You defeated all the obstacles, bypassed your enemies,",
                    "and even convinced my Dad of our journey!",
                    "",
                    "Thank you for being such an amazing person,",
                    "for being in my life and enriching it so deeply.",
                    "",
                    "We might be going through some tough times with a lot of",
                    "tension right now, and things are pretty critical for us,",
                    "but I am looking forward to our future.",
                    "",
                    "I know we will overcome every single obstacle together,",
                    "and I am so ready to live a cool, adventurous,",
                    "and wonderful life by your side.",
                    "",
                    "Never stop dreaming and be proud of yourself. I love you.",
                    "All the best! 💖"
                ];

                letterLines.forEach((line, index) => {
                    ctx.fillText(line, canvas.width / 2, 120 + (index * 22));
                });

                const menuBtn = { x: 300, y: 520, w: 300, h: 45 };
                ctx.lineWidth = 2;
                ctx.fillStyle = "rgba(255, 20, 147, 0.9)";
                ctx.strokeStyle = "white";

                ctx.beginPath();
                ctx.roundRect(menuBtn.x, menuBtn.y, menuBtn.w, menuBtn.h, 8);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.fillStyle = "white";
                ctx.font = "10px 'Press Start 2P', Arial";
                ctx.fillText("MAIN MENU", menuBtn.x + menuBtn.w / 2, menuBtn.y + menuBtn.h / 2);
            }
            ctx.textAlign = "start";
        }
    }
    if (teleportFlashTimer > 0) {
        teleportFlashTimer--;
        let opacity = 1;
        if (teleportFlashTimer < 40) {
            opacity = teleportFlashTimer / 40;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(updateGame);
}

const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("startBtn");
const quoteBox = document.getElementById("quote");

function openGameFromMenu(levelIndex) {
    menu.style.display = "none";
    gameContainer.style.display = "block";
    settingsBtn.style.display = "block";
    document.body.classList.add("game-running");
    quoteBox.style.display = "none";
    clearInterval(window.quoteInterval);
    score = 0;
    startLevel(levelIndex);
}

function handleStartError(error) {
    console.error(error);
    menu.style.display = "block";
    gameContainer.style.display = "none";
    settingsBtn.style.display = "none";
    showMessage(`Start error: ${error.message || error}`, 4000);
}

startBtn.addEventListener("click", () => {
    startBtn.textContent = "Continue";
    forcePlayMusic('game');
    console.log("--- DEBUG: Start-Button geklickt ---");
    console.log("bgMusic Objekt:", bgMusic);
    
    if (bgMusic) {
        console.log("Versuche, bgMusic zu spielen...");
    } else {
        console.error("FEHLER: bgMusic ist 'undefined' oder nicht geladen!");
    }
    
    try {
        openGameFromMenu(0);
    } catch (error) {
        handleStartError(error);
    }
});

// game.js
document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.textContent = "Continue";
        forcePlayMusic('game'); 
        try {
            const levelIndex = parseInt(btn.dataset.level);
            openGameFromMenu(levelIndex);
        } catch (error) {
            handleStartError(error);
        }
    });
});

settingsBtn.addEventListener("click", () => {
    if (gameState === "playing") {
        setGameState("paused");
    } else if (gameState === "paused") {
        setGameState("playing");
        pauseOverlay.classList.add("hidden");
    }
});

backToMenuBtn.addEventListener("click", () => {
    pauseOverlay.classList.add("hidden");
    gameContainer.style.display = "none";
    settingsBtn.style.display = "none";
    menu.style.display = "block";
    document.body.classList.remove("game-running");
    quoteBox.style.display = "block";
    if (typeof randomQuote === "function") {
        clearInterval(window.quoteInterval);
        window.quoteInterval = setInterval(randomQuote, 4000);
    }
    setGameState("menu");
});

const wonMainMenuBtn = document.getElementById("wonMainMenuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const wonOverlay = document.getElementById("won-overlay");

wonMainMenuBtn.addEventListener("click", () => {
    wonOverlay.classList.add("hidden");
    gameContainer.style.display = "none";
    settingsBtn.style.display = "none";
    menu.style.display = "block";
    document.body.classList.remove("game-running");
    quoteBox.style.display = "block";
    if (typeof randomQuote === "function") {
        clearInterval(window.quoteInterval);
        window.quoteInterval = setInterval(randomQuote, 4000);
    }
    setGameState("menu");
});

nextLevelBtn.addEventListener("click", () => {
    wonOverlay.classList.add("hidden");
    if (currentLevelIndex === 1) {
        startLevel(2);
    }
    else if (currentLevelIndex + 1 < levels.length) {
        startLevel(currentLevelIndex + 1);
    }
    else {
        showMessage("Congratulations! You beat the game! 🎉", 3000);
        gameContainer.style.display = "none";
        settingsBtn.style.display = "none";
        menu.style.display = "block";
        document.body.classList.remove("game-running");
        quoteBox.style.display = "block";
        setGameState("menu");
    }
});

const resumeBtn = document.getElementById("resumeBtn");
if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
        setGameState("playing");
        pauseOverlay.classList.add("hidden");
    });
}

const restartLevelBtn = document.getElementById("restartLevelBtn");
if (restartLevelBtn) {
    restartLevelBtn.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        startLevel(currentLevelIndex);
    });
}

document.addEventListener("keydown", (e) => {
    if (
        e.key.toLowerCase() === "e"
        && gameState === "playing"
        && currentLevelIndex === 2
        && interactWithLevelCharacter()
    ) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);

window.addEventListener('click', () => {
    if (currentTrack === "menu" && birthdaySound.paused) {
        birthdaySound.play().catch(e => console.log("Sound konnte nicht starten"));
    }
}, { once: true });

updateGame();
