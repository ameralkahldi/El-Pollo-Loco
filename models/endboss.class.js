// Die Endboss-Klasse erbt von MovableObject und stellt den animierten Endgegner dar.
class Endboss extends MovableObject {

    // Array mit allen Bildpfaden für die Laufanimation des Endbosses.
    IMAGE_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    // Der Konstruktor wird beim Erstellen eines neuen Endboss-Objekts aufgerufen.
    constructor() {
        super(); // Ruft den Konstruktor der Elternklasse MovableObject auf.

        // Lädt das erste Bild als Startbild des Endbosses.
        this.loadImage(this.IMAGE_WALKING[0]);

        // Lädt alle Bilder in den Cache, damit sie später schnell angezeigt werden können.
        this.loadImages(this.IMAGE_WALKING);

        // Setzt die Startposition des Endbosses (rechts außerhalb des Bildschirms).
        this.x = 2000;

        // Setzt die vertikale Position (y) leicht über dem Boden.
        this.y = -35;

        // Setzt die Größe des Endbosses.
        this.width = 300;
        this.height = 500;

        // Initialisiert den Zähler für das aktuelle Animationsbild.
        this.currentImage = 0;

        // Startet die Laufanimation.
        this.animate();
    }

    // Die animate()-Funktion ruft alle 200 Millisekunden die Funktion zum Bildwechsel auf.
    animate() {
        setInterval(() => {
            this.playWalkingAnimation(); // Wechselt das angezeigte Bild.
        }, 200);
    }

    // Diese Funktion ändert das sichtbare Bild des Endbosses, um eine Laufanimation zu erzeugen.
    playWalkingAnimation() {
        // Berechnet den Index im Array basierend auf currentImage.
        let i = this.currentImage % this.IMAGE_WALKING.length;

        // Holt den Pfad zum aktuellen Bild.
        let path = this.IMAGE_WALKING[i];

        // Wechselt das sichtbare Bild aus dem Cache.
        this.img = this.imageCache[path];

        // Erhöht den Zähler für das nächste Bild.
        this.currentImage++;
    }
}
