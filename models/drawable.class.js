class DrawableObject {
   x = 120;
  y = 80;
  width = 200;
  height = 150;
  img;
  imageCache = {};

  /**
   * Lädt ein einzelnes Bild und speichert es als aktuelles Bild.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Lädt mehrere Bilder in den Cache (z. B. für StatusBar oder Animation).
   */
  loadImages(imageArray) {
    imageArray.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Zeichnet das Objekt, wenn ein Bild vorhanden ist.
   */
 draw(ctx) {
  if (this.img) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  
}

}
