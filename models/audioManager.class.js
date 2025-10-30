class AudioManager {
  constructor() {
    this.sounds = {
      chickenDeath: new Audio("audio/audio_chicken_death.mp3"),
      coinCollect: new Audio("audio/audio_coin_collect.wav"),
      bottleCollect: new Audio("audio/audio_landing.wav"),
      bossMove: new Audio("audio/audio_chickenBoss.wav"),
      gameOver: new Audio("audio/audio_game_over.wav"),
      background: new Audio("audio/audio_music.mp3"),
      jumpSound: new Audio("audio/audio_jump.wav"),
    
    };

    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.4;
    this.isBackgroundPlaying = false;

    const savedSound = localStorage.getItem("soundEnabled");
    this.soundEnabled = savedSound !== null ? savedSound === "true" : true;

    //if (this.soundEnabled) this.toggleBackgroundMusic(true);
  }

  playSound(name) {
    if (!this.soundEnabled) return;
    const sound = this.sounds[name];
    if (!sound) return;
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone
      .play()
      .catch((e) => console.warn(`Could not play sound "${name}":`, e));
  }

  toggleBackgroundMusic(enable) {
    const bg = this.sounds.background;
    if (enable && !this.isBackgroundPlaying) {
      bg.currentTime = 0;
      bg.play()
        .then(() => {
          this.isBackgroundPlaying = true;
        })
        .catch((e) => console.warn("⚠️ Background music playback blocked:", e));
    } else if (!enable && this.isBackgroundPlaying) {
      bg.pause();
      this.isBackgroundPlaying = false;
    }
  }

  stopAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.isBackgroundPlaying = false;
  }

  setSoundEnabled(enable) {
    this.soundEnabled = enable;
    localStorage.setItem("soundEnabled", enable);
    this.toggleBackgroundMusic(enable);
    if (!enable) this.stopAllSounds();
  }
}
