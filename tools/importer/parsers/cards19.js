/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards19)'];

  // Get all direct card divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  const rows = cardDivs.map(cardDiv => {
    // Find the first svg icon (inside a .icon container)
    let iconDiv = cardDiv.querySelector('.icon');
    let iconCell = iconDiv ? iconDiv : document.createElement('div');

    // Find the p element holding the text
    let pEl = cardDiv.querySelector('p');
    let textCell = pEl ? pEl : document.createElement('p');

    return [iconCell, textCell];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the table block
  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(tableBlock);
}
