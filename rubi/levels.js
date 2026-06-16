export const levels = [
  {
    name: "Level 1 – The Bagel Adventure 🥯",
    platforms: [
      { x: 0, y: 550, width: 290, height: 50 },
      { x: 450, y: 550, width: 250, height: 50 },
      { x: 750, y: 430, width: 200, height: 20 }, 
      { x: 1050, y: 550, width: 400, height: 50 },
      { x: 1550, y: 420, width: 200, height: 20 },
      { x: 1850, y: 350, width: 250, height: 20 },
      { x: 2200, y: 430, width: 200, height: 20 },
      { x: 2500, y: 550, width: 600, height: 50 }
    ],
    cherries: [
      { x: 140, y: 510, radius: 10 },
      { x: 380, y: 480, radius: 10 },
      { x: 550, y: 510, radius: 10 },
      { x: 770, y: 370, radius: 10 }, 
      { x: 1200, y: 510, radius: 10 },
      { x: 1650, y: 320, radius: 10 }, 
      { x: 1970, y: 250, radius: 10 }, 
      { x: 2300, y: 330, radius: 10 }, 
      { x: 2450, y: 610, radius: 10 },
      { x: 2650, y: 510, radius: 10 },
    ],
    hamster: {
      x: 830,
      y: 440 - 80,
      width: 80,
      height: 80,
      interactionRadius: 80,
      message: "Buenos días!", 
      image: "./assets/pflanze_lv1.png",
      item: { name: "Flower", icon: "🌸", image: "./assets/flower.png" } 
    },
    bagel: { x: 2900, y: 500, radius: 30, health: 4 }
  },
  {
    name: "Level 2 – The French Spy 🐱",
    platforms: [
      { x: 0, y: 550, width: 300, height: 50 },
      { x: 350, y: 430, width: 130, height: 20, isMoving: true, startX: 350, rangeX: 200 },
      { x: 600, y: 550, width: 200, height: 50 }, 
      { x: 850, y: 450, width: 350, height: 20 }, 
      { x: 1300, y: 530, width: 150, height: 20 }, 
      { x: 1550, y: 430, width: 120, height: 20, isMoving: true, startX: 1550, rangeX: 180 },
      { x: 1850, y: 510, width: 100, height: 20 },
      { x: 2050, y: 420, width: 130, height: 20, isMoving: true, startX: 2050, rangeX: 150 },
      { x: 2300, y: 500, width: 100, height: 20 },
      { x: 2550, y: 550, width: 900, height: 50 } 
    ],
    cherries: [
      { x: 150, y: 500, radius: 10 },
      { x: 450, y: 340, radius: 10 }, 
      { x: 700, y: 500, radius: 10 },
      { x: 1000, y: 380, radius: 10 }, 
      { x: 1380, y: 480, radius: 10 },
      { x: 1650, y: 330, radius: 10 }, 
      { x: 1950, y: 460, radius: 10 },
      { x: 2200, y: 340, radius: 10 }, 
      { x: 2400, y: 450, radius: 10 },
      { x: 2800, y: 500, radius: 10 }
    ],
    hamster: {
      x: 1000,
      y: 425 - 40,
      width: 80,
      height: 80,
      interactionRadius: 60,
      message: "Yippiieeee!", 
      image: "./assets/hamster.png",
      item: { name: "Churro", icon: "🥖", image: "./assets/churro.png" } 
    },
    bagel: {
      x: 3100, 
      y: 510,
      radius: 45,
      health: 10,
      name: "Monsieur Chat"
    }
  },
  {
    name: "Level 3 – Cosmic Jungle 🪐",
    platforms: [
      { x: 0, y: 550, width: 250, height: 50 },     
      { x: 400, y: 530, width: 200, height: 20 },
      { x: 800, y: 530, width: 150, height: 20 },
      { x: 1400, y: 530, width: 250, height: 20 },
      { x: 300, y: 420, width: 100, height: 20, isMoving: true, startX: 300, rangeX: 120 },
      { x: 550, y: 330, width: 150, height: 20 },
      { x: 800, y: 200, width: 300, height: 20 },  
      { x: 850, y: 320, width: 200, height: 20 },  
      { x: 1150, y: 260, width: 100, height: 20, isMoving: true, startX: 1150, rangeX: 200 },
      { x: 1450, y: 380, width: 120, height: 20 },
      { x: 1650, y: 290, width: 150, height: 20 },
      { x: 1900, y: 210, width: 100, height: 20, isMoving: true, startX: 1900, rangeX: 150 },
      { x: 2150, y: 300, width: 200, height: 20 },
      { x: 2450, y: 400, width: 120, height: 20 },
      { x: 2650, y: 450, width: 100, height: 20, isMoving: true, startX: 2650, rangeX: 180 },
      { x: 2950, y: 450, width: 250, height: 20 }, 
      { x: 3350, y: 550, width: 1200, height: 50 }  
    ],
    cherries: [
      { x: 120, y: 500, radius: 10 },
      { x: 320, y: 500, radius: 10 }, 
      { x: 350, y: 340, radius: 10 }, 
      { x: 450, y: 490, radius: 10 },
      { x: 620, y: 250, radius: 10 }, 
      { x: 880, y: 500, radius: 10 },
      { x: 950, y: 280, radius: 10 }, 
      { x: 1250, y: 180, radius: 10 }, 
      { x: 1500, y: 340, radius: 10 },
      { x: 1520, y: 490, radius: 10 },
      { x: 1780, y: 200, radius: 10 }, 
      { x: 1950, y: 140, radius: 10 }, 
      { x: 2300, y: 220, radius: 10 }, 
      { x: 2500, y: 350, radius: 10 },
      { x: 3050, y: 400, radius: 10 },
      { x: 3800, y: 500, radius: 10 },
      { x: 3900, y: 500, radius: 10 },
      { x: 4200, y: 500, radius: 10 }
    ],
    hamster: {
      x: 3050, 
      y: 450 - 40,
      width: 40,
      height: 40,
      interactionRadius: 60,
      message: "My physical body is trapped back on Earth, but my soul will always find a way to you.", 
      image: "./assets/ghost.png",
      item: { name: "Heart", icon: "❤️", image: "./assets/lilheart.png" } 
    },
    bagel: {
      x: 4000, 
      y: 500,
      radius: 40, 
      health: 21, 
      name: "Lia's Dad"
    }
  }
];