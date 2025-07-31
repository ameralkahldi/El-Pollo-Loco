// Die Endboss-Klasse erbt von MovableObject und stellt den animierten Endgegner dar.
class Endboss extends MovableObject {
  // Array mit allen Bildpfaden für die Laufanimation des Endbosses.
  IMAGE_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  // Der Konstruktor wird beim Erstellen eines neuen Endboss-Objekts aufgerufen.
  constructor() {
    super();

    this.loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);

    this.x = 2000;
    this.y = -35;
    this.width = 300;
    this.height = 500;

    this.currentImage = 0;

    // ✅ NEU:
    this.energy = 100;
    this.dead = false;
    this.speed = 0;

    this.animate();
  }
  animate() {
    setInterval(() => {
      this.playWalkingAnimation(); // Wechselt das angezeigte Bild.
    }, 200);
  }

  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;

    let path = this.IMAGE_WALKING[i];

    this.img = this.imageCache[path];

    this.currentImage++;
  }
}
