export const inventory = [];
export const maxSlots = 3;
let inventoryVisible = false;

// --- BILDER FÜR DIE UI OBEN LINKS LADEN ---
const uiCherryImg = new Image();
uiCherryImg.src = "./assets/cherry.png";

const uiHeartImg = new Image();
uiHeartImg.src = "./assets/heartlive.png";

const uiBagpackImg = new Image();
uiBagpackImg.src = "./assets/bagpack.png";

export function addItemToInventory(item) {
  if (inventory.length < maxSlots) {
    inventory.push(item);
    updateInventoryDOM(); 
  } else {
    console.log("Inventory is full!");
  }
}

export function toggleInventory() {
  inventoryVisible = !inventoryVisible;
  setInventoryVisible(inventoryVisible);
}

export function isInventoryVisible() {
  return inventoryVisible;
}

// --- SCORE-BEREICH AUF DEM CANVAS ZEICHNEN ---
export function drawTopLeftUI(ctx, score, lives, currentLevelIndex) {
  const startX = 20;
  const startY = 30;    
  const lineHeight = 48; 

  // Schriftart auf die weiße Pixel-Schriftart einstellen
  ctx.font = "14px 'Press Start 2P', Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "white"; 

  // 1. Zeile: Kirschen-Bild (38x38px) + Text "Score: X" (Abstand verkürzt)
  ctx.drawImage(uiCherryImg, startX, startY, 38, 38);
  ctx.fillText(` Score: ${score}`, startX + 38, startY + 12);

  // 2. Zeile: Herz-Bild (auf 44x44px vergrößert) + Text "Lives: X" (Abstand verkürzt)
  ctx.drawImage(uiHeartImg, startX - 3, startY + lineHeight, 44, 44);
  ctx.fillText(` Lives: ${lives}`, startX + 38, startY + lineHeight + 12);

  // 3. Zeile: Rucksack-Bild (40x40px) + Text "Inventory" (Abstand verkürzt)
  ctx.drawImage(uiBagpackImg, startX - 1, startY + lineHeight * 2, 40, 40);
  ctx.fillText(` Inventory [I]`, startX + 38, startY + lineHeight * 2 + 12);
}

// Klickbereich für das Inventar
export function handleInventoryClick(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  if (mouseX >= 15 && mouseX <= 210 && mouseY >= 120 && mouseY <= 170) {
    toggleInventory(); 
  }
}

export function drawInventoryBox(ctx, canvas) {
  return; 
}

export function initInventory() {
  inventory.length = 0;
  inventoryVisible = false;
  updateInventoryDOM();
  setInventoryVisible(false);
}

export function updateInventoryDOM() {
  for (let i = 0; i < maxSlots; i++) {
    const slot = document.getElementById(`slot-${i}`);
    if (slot) {
      if (inventory[i]) {
        if (inventory[i].image) {
          slot.textContent = "";
          let img = slot.querySelector("img");
          if (!img) {
            img = document.createElement("img");
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.objectFit = "contain";
            slot.appendChild(img);
          }
          img.src = inventory[i].image;
          img.alt = inventory[i].name;
        } else {
          slot.textContent = inventory[i].icon || inventory[i].name || inventory[i];
        }
      } else {
        slot.textContent = "?"; 
      }
    }
  }
}

export function setInventoryVisible(visible) {
  inventoryVisible = visible;
  const inventoryBox = document.getElementById("inventoryBox");
  if (inventoryBox) {
    if (visible) {
      inventoryBox.classList.remove("hidden");
    } else {
      inventoryBox.classList.add("hidden");
    }
  }
}

export function updateInventoryUI(ctx, canvas) {
  return; 
}