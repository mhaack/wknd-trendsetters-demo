/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards37)'];
  const cells = [headerRow];

  // Find the main card grid (first .grid-layout inside .container)
  const container = element.querySelector('.container');
  if (!container) return;
  // Get all top-level card/group elements inside the main grid
  const mainGrid = container.querySelector('.grid-layout');
  if (!mainGrid) return;

  // Helper to extract card content into two cells: image, text
  function extractCard(cardElem) {
    // Find the image container (prefer aspect div if present)
    let img = cardElem.querySelector('img');
    let aspectDiv = null;
    let possibleDiv = cardElem.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    if (possibleDiv && img && possibleDiv.contains(img)) {
      aspectDiv = possibleDiv;
    }
    const imageCell = aspectDiv || img;

    // For text: gather heading, description, CTA (in order)
    let textParts = [];
    // Headings
    let heading = cardElem.querySelector('h2, .h2-heading, h3, .h4-heading');
    if (heading) textParts.push(heading);
    // Description
    let p = cardElem.querySelector('p');
    if (p) textParts.push(p);
    // CTA button
    let cta = cardElem.querySelector('.button');
    if (cta) textParts.push(cta);

    return [imageCell, textParts];
  }

  // Collect all card elements (either direct cards or nested grids)
  Array.from(mainGrid.children).forEach(child => {
    // If it's a nested grid-layout, process its children as cards
    if (child.classList.contains('grid-layout')) {
      Array.from(child.children).forEach(subCard => {
        const row = extractCard(subCard);
        if (row[0] || (row[1] && row[1].length)) {
          cells.push(row);
        }
      });
    } else {
      const row = extractCard(child);
      if (row[0] || (row[1] && row[1].length)) {
        cells.push(row);
      }
    }
  });

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
