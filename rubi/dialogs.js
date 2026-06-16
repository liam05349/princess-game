export const storyScenes = {
    cageDiscovered: {
        dialogIndex: 0,
        dialogs: [
            { speaker: "YOU", text: "Omaga, you found me! I missed you so much!" }, // Satz 1 kommt aus dem Käfig
            { speaker: "PLAYER", text: "Watch out! What is happeni-" }              // Satz 2 kommt vom Spieler
        ]
    }
};

export let currentDialogStep = 0;
export function incrementDialogStep() { currentDialogStep++; }
export function resetDialogStep() { currentDialogStep = 0; }

export function drawStoryDialog(ctx, playerX, playerY, cameraOffsetX) {
    const scene = storyScenes.cageDiscovered;
    const currentTextObj = scene.dialogs[currentDialogStep];

    if (!currentTextObj) return;

    const cageX = 3000;
    const cageY = 550 - 180;

    let bubbleX = 0;
    let bubbleY = 0;

    if (currentTextObj.speaker === "YOU") {
        bubbleX = cageX + 90 - cameraOffsetX;
        bubbleY = cageY - 30;
    } else {
        bubbleX = playerX + 60 - cameraOffsetX;
        bubbleY = playerY + 108 - 25; // 108 ist dein FOOT_OFFSET, 25 Pixel über dem Kopf
    }

    ctx.font = "11px 'Press Start 2P', Arial";
    const textWidth = ctx.measureText(currentTextObj.text).width;
    const boxWidth = textWidth + 24;
    const boxHeight = 34;

    ctx.fillStyle = "rgba(38, 18, 112, 0.95)";
    ctx.beginPath();
    ctx.roundRect(bubbleX - boxWidth / 2, bubbleY - boxHeight / 2, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "rgba(38, 18, 112, 0.95)";
    ctx.moveTo(bubbleX - 8, bubbleY + boxHeight / 2);
    ctx.lineTo(bubbleX + 8, bubbleY + boxHeight / 2);
    ctx.lineTo(bubbleX, bubbleY + boxHeight / 2 + 8);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(currentTextObj.text, bubbleX, bubbleY);
    ctx.textAlign = "start"; 

    ctx.font = "8px 'Press Start 2P', Arial";
    ctx.fillStyle = "#aadedf";
    ctx.fillText("Press [Space]", bubbleX, bubbleY + (boxHeight / 2) + 12);
    ctx.textAlign = "start";
}