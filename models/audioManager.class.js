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
      pepeHit: new Audio("audio/audio_pepe_death.mp3"),
    };
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.4;
    this.isBackgroundPlaying = false;

    const savedSound = localStorage.getItem("soundEnabled");
    const savedMusic = localStorage.getItem("musicEnabled");

    this.soundEnabled = savedSound !== null ? savedSound === "true" : true;
    this.musicEnabled = savedMusic !== null ? savedMusic === "true" : true;
  }

  /**
   * Plays a specific sound effect (excluding background music)
   * @param {string} name - The name of the sound to play
   */
  playSound(name) {
    if (!this.soundEnabled) return;
    if (name === "background") return;
    const sound = this.sounds[name];
    if (!sound) return;
    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone
      .play()
      .catch((e) => console.warn(`Could not play sound "${name}":`, e));
  }

  /**
   * Toggles background music on or off
   * @param {boolean} enable - true to play, false to stop
   */
  toggleBackgroundMusic(enable) {
    const bg = this.sounds.background;

    if (enable && this.musicEnabled && !this.isBackgroundPlaying) {
      bg.currentTime = 0;
      bg.play()
        .then(() => {
          this.isBackgroundPlaying = true;
        })
        .catch((e) => console.warn(" Background music playback blocked:", e));
    } else if (!enable && this.isBackgroundPlaying) {
      bg.pause();
      this.isBackgroundPlaying = false;
    }
  }

  /**
   * Stops all sound effects (excluding background music)
   */
  stopAllSounds() {
    Object.keys(this.sounds).forEach((key) => {
      if (key !== "background") {
        const sound = this.sounds[key];
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  /**
   * Stops everything (sound effects + background music)
   */
  stopEverything() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.isBackgroundPlaying = false;
  }

  /**
   * Enables or disables all audio (sound effects + music)
   * @param {boolean} enable - true to enable, false to disable
   */
  setSoundEnabled(enable) {
    this.soundEnabled = enable;
    this.musicEnabled = enable;

    localStorage.setItem("soundEnabled", enable.toString());
    localStorage.setItem("musicEnabled", enable.toString());

    if (!enable) {
      this.stopEverything();
    } else {
      this.toggleBackgroundMusic(true);
    }
  }

  /**
   * Enables or disables music only (without affecting sound effects)
   * @param {boolean} enable - true to enable, false to disable
   */
  setMusicEnabled(enable) {
    this.musicEnabled = enable;
    localStorage.setItem("musicEnabled", enable);
    this.toggleBackgroundMusic(enable);
  }

  /**
   * Enables or disables all audio together
   * @param {boolean} enable - true to enable, false to disable
   */
  setAllAudioEnabled(enable) {
    this.setSoundEnabled(enable);
    this.setMusicEnabled(enable);
  }

  /**
   * Gets the current sound state
   * @returns {boolean}
   */
  isSoundEnabled() {
    return this.soundEnabled;
  }

  /**
   * Gets the current music state
   * @returns {boolean}
   */
  isMusicEnabled() {
    return this.musicEnabled;
  }

  /**
   * Checks if background music is currently playing
   * @returns {boolean}
   */
  isBackgroundMusicPlaying() {
    return this.isBackgroundPlaying;
  }
}
