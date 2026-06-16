export let currentTrack = "none";


// Musik-Instanzen
export const bgMusic = new Audio('./audio/background.MP3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

export const birthdaySound = new Audio('./audio/hbday.mp3');
birthdaySound.loop = true;
birthdaySound.volume = 0.4;

// Effekte
export const yippeeSound = new Audio('./audio/yippee.mp3');
export const fireballSound = new Audio('./audio/fireball_whoosh.mp3');
export const collectSound = new Audio('./audio/collect.mp3');
export const fartSound = new Audio('./audio/fart.mp3');
export const playerHitSound = new Audio('./audio/playerhit.mp3');
export const teleportSound = new Audio('./audio/teleport.mp3');

// Die Funktion, die alles steuert
export function forcePlayMusic(track) {
    console.log("Switching music to:", track);

    bgMusic.pause();
    bgMusic.currentTime = 0;

    birthdaySound.pause();
    birthdaySound.currentTime = 0;

    if (track === 'menu') {
        console.log("Playing birthday music");
        currentTrack = 'menu';

        birthdaySound.play()
            .then(() => console.log("Birthday music started"))
            .catch(err => console.error(err));
    }

    if (track === 'game') {
        console.log("Playing game music");
        currentTrack = 'game';

        bgMusic.play()
            .then(() => console.log("Game music started"))
            .catch(err => console.error(err));
    }
}

export function playEffect(audioElement, volume = 0.5) {
    if (!audioElement) return;
    const sound = audioElement.cloneNode(true);
    sound.volume = volume;
    sound.play().catch(e => console.log("Effekt blockiert:", e));
}