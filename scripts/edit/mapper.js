export class DOMToSourceMapper {
  constructor(sourceHTML) {
    this.sourceDoc = new DOMParser().parseFromString(sourceHTML, 'text/html');
    this._decorateSections();
    this.elementIndex = new Map();
    this.sectionIndex = new Map();
    this.blockIndex = new Map();
  }

  _generateId() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.random() < 0.5 ? 6 : 8; // Randomly choose 6 or 8 characters
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  _decorateSections() {
    const main = this.sourceDoc.body.querySelector('main');
    main.querySelectorAll(':scope > div').forEach((section) => {
      const wrappers = [];
      let defaultContent = false;
      [...section.children].forEach((e) => {
        if (e.tagName === 'DIV') {
          wrappers.push(e);
        } else {
         if (!defaultContent) {
          defaultContent = true;
          const wrapper = document.createElement('div');
          wrappers.push(wrapper);
          wrapper.classList.add('default-content-wrapper');
         }
         wrappers[wrappers.length - 1].append(e);
        }
      });
      wrappers.forEach((wrapper) => section.append(wrapper));
    });
  }

  _undecorateSections(doc) {
    const main = doc.body.querySelector('main');
    main.querySelectorAll(':scope > div').forEach((section) => {
      section.querySelectorAll('div.default-content-wrapper').forEach((defaultContentDiv) => {
        [...defaultContentDiv.childNodes].forEach((child) => {
          defaultContentDiv.before(child);
        });
        defaultContentDiv.remove();
      });
    });

    main.querySelectorAll(':scope [data-edit-id]').forEach((el) => {
      el.removeAttribute('data-edit-id');
      el.removeAttribute('data-edit');
    });
    return doc;
  }

  _normalizeImageSrc(src) {
    const imgUrl = new URL(src, window.location.href);
    if (imgUrl.pathname.startsWith('/media_')) {
      return imgUrl.pathname;
    }
    return src;
  }

  _findSourceElement(decoratedElement) {
    const searchTagName = decoratedElement.tagName;
    const searchText = decoratedElement.textContent?.trim();

    // for default content we need to find the
    if (decoratedElement.closest('div.default-content-wrapper')) {
      const sourceDefaultContentDivs = this.sourceDoc.querySelectorAll('div.default-content-wrapper');
      for (const sourceDefaultContent of sourceDefaultContentDivs) {
        if (sourceDefaultContent.textContent?.trim() === searchText) {
          return sourceDefaultContent;
        }
      }
    } else if (decoratedElement.closest('div.block')) {
      const block = decoratedElement.closest('div.block');
      const blockName = block.dataset.blockName;
      const sourceBlock = this.sourceDoc.querySelector(`div.${blockName}`);
      if (sourceBlock) {
        let match = null;

        // match images by src and alt
        if (searchTagName === 'IMG') {
          const src = decoratedElement.getAttribute('src');
          const alt = decoratedElement.getAttribute('alt');
          if (src || alt) {
            const normalizedSrc = this._normalizeImageSrc(src);
            const sourceImages = sourceBlock.querySelectorAll('img');
            for (const sourceImage of sourceImages) {
              const sourceSrc = sourceImage.getAttribute('src');
              const sourceAlt = sourceImage.getAttribute('alt');
              if (sourceSrc || sourceAlt) {
                const normalizedSourceSrc = this._normalizeImageSrc(sourceSrc);
                if (normalizedSourceSrc === normalizedSrc || (sourceAlt === alt && sourceAlt !== '')) {
                  match = sourceImage;
                  break;
                }
              }
            }
          }
        }

        // match lists by text content
        if (searchTagName === 'UL' || searchTagName === 'OL') {
          const sourceLists = sourceBlock.querySelectorAll('ul, ol');
          const ulSearchText = searchText.replace(/\s+/g, '').trim();
          for (const sourceList of sourceLists) {
            if (sourceList.textContent?.trim() === ulSearchText) {
              match = sourceList;
              break;
            }
          }
        }

        if (!match && searchTagName && searchText) {
          // 1. Try to match by tag name and text content
          match = Array.from(sourceBlock.querySelectorAll(searchTagName)).find(
            (srcEl) => {
              return srcEl.textContent?.trim() === searchText;
            }
          );
        }

        // 2. If not found, try to match by text content only
        if (!match && searchText) {
          match = Array.from(sourceBlock.querySelectorAll('*')).find(
            (srcEl) => {
              return srcEl.textContent?.trim() === searchText;
            }
          );
        }

        if (match) {
          return match;
        }
      }

      return null;
    }
  }

  initSourceElement(decoratedElement) {
    const sourceElement = this._findSourceElement(decoratedElement);
    if (sourceElement) {
      if (sourceElement.dataset.editId) {
        console.warn('Source element already initialized:', sourceElement);
        return sourceElement;
      }
      const id = this._generateId();
      sourceElement.dataset.editId = id;
      this.elementIndex.set(id, sourceElement);
      return sourceElement;
    }

    return null;
  }

  getSourceElement(decoratedElement) {
    const id = decoratedElement.dataset.editId;
    if (!id) {
      return null;
    }
    return this.elementIndex.get(id);
  }

  updateSourceElement(decoratedElement, changeType, newValue) {
    const id = decoratedElement.dataset.editId;
    if (!id) {
      return null;
    }
    const sourceElement = this.elementIndex.get(id);
  
    if (sourceElement) {
      switch (changeType) {
        case 'text':
          sourceElement.textContent = newValue;
          break;
        case 'attribute':
          const { name, value } = newValue;
          if (value) {
            sourceElement.setAttribute(name, value);
          } else {
            sourceElement.removeAttribute(name);
          }
          break;
        case 'html':
          sourceElement.innerHTML = newValue;
          break;
        default:
          console.warn('Unknown change type:', changeType);
          return false;
      }
    }
  }

  getSourceHTML(undecorateSections = false) {
    const html = undecorateSections ? this._undecorateSections(this.sourceDoc.cloneNode(true)) : this.sourceDoc.cloneNode(true);

    return html.body.outerHTML;
  }
}
