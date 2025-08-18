/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cards25)'];

  // Get all immediate child divs representing cards
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Map each card to a [image, text] row
  const rows = cardDivs.map(card => {
    // Find the image (mandatory)
    const img = card.querySelector('img');

    // Find text content: look for h3 and p inside a .utility-padding-all-2rem
    let textContent = null;
    const pad = card.querySelector('.utility-padding-all-2rem');
    if (pad) {
      // If there is a .utility-padding-all-2rem, use that block
      textContent = pad;
    } else {
      // Otherwise, check for direct h3/p
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3 || p) {
        // Create a container for them, preserving semantic tags
        const container = document.createElement('div');
        if (h3) container.appendChild(h3);
        if (p) container.appendChild(p);
        textContent = container.childNodes.length ? container : '';
      } else {
        // No text content
        textContent = '';
      }
    }
    // Always reference existing element nodes
    return [img, textContent];
  }).filter(row => !!row[0]); // Only include rows with images

  // Build table: header + card rows
  const cells = [headerRow, ...rows];

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(blockTable);
}
