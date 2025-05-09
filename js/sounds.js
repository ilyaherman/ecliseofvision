class SoundManager {
  constructor() {
    // Initialize sound objects
    this.sounds = {
      rain: new Audio('assets/sounds/levels/1/rain.mp3'), // Replace with actual path to rain sound file
      // Add other sounds here as needed
      // jump: new Audio('assets/sounds/jump.mp3'),
      // collision: new Audio('assets/sounds/collision.mp3'),
      // gameOver: new Audio('assets/sounds/gameover.mp3')
    };

    // Configure sound properties
    this.sounds.rain.loop = true; // Rain sound loops
    this.sounds.rain.volume = 0.5; // Adjust volume (0.0 to 1.0)
    // Configure other sounds as needed
    // this.sounds.jump.volume = 0.7;
    // this.sounds.collision.volume = 0.7;
    // this.sounds.gameOver.volume = 0.7;
  }

  // Play a sound by name
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].play().catch(error => {
        console.error(`Error playing sound ${soundName}:`, error);
      });
    } else {
      console.warn(`Sound ${soundName} not found`);
    }
  }

  // Pause a sound by name
  pause(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
    }
  }

  // Stop a sound by name (pauses and resets to start)
  stop(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
      this.sounds[soundName].currentTime = 0;
    }
  }

  // Stop all sounds
  stopAll() {
    Object.keys(this.sounds).forEach(soundName => {
      this.stop(soundName);
    });
  }
}

// Export a singleton instance
const soundManager = new SoundManager();