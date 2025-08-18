/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as in the example
  const headerRow = ['Cards (cards33)'];
  const cells = [headerRow];

  // 2. Find all immediate card links (one per card)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));
  cardLinks.forEach((a) => {
    // a. Image: first img found inside this <a>
    const img = a.querySelector('img');
    
    // b. Find the content div (the div that is not the image itself)
    // The first direct child div inside <a> is the card grid
    const cardGrid = a.querySelector(':scope > div');
    let contentDiv = null;
    if (cardGrid) {
      // The cardGrid usually has two children: [img, contentContainer]
      const gridChildren = Array.from(cardGrid.children);
      contentDiv = gridChildren.find(child => child !== img);
    }

    // Fallback: if not found, look for a div (not containing the img!) inside <a>
    if (!contentDiv) {
      const possibleDivs = Array.from(a.querySelectorAll('div'));
      contentDiv = possibleDivs.find(div => !div.contains(img));
    }
    
    // Remove any 'Read' text node at the bottom (optional CTA, but not a link, so omit)
    if (contentDiv) {
      const lastChild = contentDiv.lastElementChild;
      if (lastChild && lastChild.textContent && lastChild.textContent.trim().toLowerCase() === 'read') {
        contentDiv.removeChild(lastChild);
      }
    }
    
    // Safeguard: if still missing, skip this card
    if (!img || !contentDiv) return;
    
    // Compose the row: image in first cell, all text (including heading, tags, etc) in second
    cells.push([
      img,
      contentDiv
    ]);
  });

  // 3. Create block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}