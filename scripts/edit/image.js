export class EditableImage {
  constructor(imgEl) {
    this.imgEl = imgEl;
  }

  showOverlay() {
    let overlay = this.imgEl.nextElementSibling;
    if (!overlay || !overlay.classList.contains("nx-image-overlay")) {
      // Create overlay container
      overlay = document.createElement("div");
      overlay.className = "nx-image-overlay";

      const imageEditButton = document.createElement('button');
      const imageEditButtonIcon = document.createElement('i');
      imageEditButtonIcon.classList.add('nx-icon', 'nx-image-icon');
      imageEditButton.append(imageEditButtonIcon);
      imageEditButton.addEventListener('click', this.handleImageEdit.bind(this));
      
      const imageAltButton = document.createElement('button');
      const imageAltButtonIcon = document.createElement('i');
      imageAltButtonIcon.classList.add('nx-icon', 'nx-image-alt-icon');
      imageAltButton.append(imageAltButtonIcon);
      imageAltButton.addEventListener('click', this.handleImageAlt.bind(this));

      const imageDeleteButton = document.createElement('button');
      const imageDeleteButtonIcon = document.createElement('i');
      imageDeleteButtonIcon.classList.add('nx-icon', 'nx-image-delete-icon');
      imageDeleteButton.append(imageDeleteButtonIcon);
      imageDeleteButton.addEventListener('click', this.handleImageDelete.bind(this));
      
      overlay.append(imageEditButton,imageAltButton,imageDeleteButton);
      
      // Insert overlay after the image
      this.imgEl.parentNode.insertBefore(overlay, this.imgEl.nextSibling);

      // Get the display width and height of the image
      overlay.style.left = `${this.imgEl.offsetLeft + this.imgEl.offsetWidth / 2}px`;
      overlay.style.top = `${this.imgEl.offsetTop + this.imgEl.offsetHeight / 2}px`;
    }
  }

  handleImageEdit(e) {
    e.stopPropagation();
    const currentSrc = this.imgEl.src || '';
    const newSrc = window.prompt('Edit image URL:', currentSrc);
    if (newSrc !== null && newSrc !== currentSrc) {
        this.imgEl.src = newSrc;
        // If the image is inside a <picture> tag, update all <source> tags as well
        const parent = this.imgEl.parentElement;
        if (parent && parent.tagName.toLowerCase() === 'picture') {
          const sources = parent.querySelectorAll('source');
          sources.forEach(source => {
            if (source.hasAttribute('srcset')) {
              source.setAttribute('srcset', newSrc);
            }
            if (source.hasAttribute('src')) {
              source.setAttribute('src', newSrc);
            }
          });
        }
    }
  }

  handleImageAlt(e) {
    e.stopPropagation();
    console.log('Image alt clicked', this.imgEl);
    const currentAlt = this.imgEl.alt || '';
    const newAlt = window.prompt('Edit image alt text:', currentAlt);
    if (newAlt !== null) {
      this.imgEl.alt = newAlt;
    }

  }

  handleImageDelete(e) {
    e.stopPropagation();
    console.log('Image delete clicked', this.imgEl);
  }

  hideOverlay() {
    const overlay = this.imgEl.nextElementSibling;
    if (overlay && overlay.classList.contains('nx-image-overlay')) {
      overlay.remove();
    }
  }
}
