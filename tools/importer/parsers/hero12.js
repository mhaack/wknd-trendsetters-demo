/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as specified
  const headerRow = ['Hero (hero12)'];

  // Row 2: Background image (the outermost image, typically visually behind the text)
  // It's the first .grid-layout child div's only <img> element
  let backgroundImg = null;
  const gridLayout = element.querySelector('.grid-layout.desktop-1-column');
  if (gridLayout && gridLayout.children.length > 0) {
    const bgDiv = gridLayout.children[0];
    // Only select <img> elements that are direct children or descendants
    backgroundImg = bgDiv.querySelector('img');
  }
  const bgRow = [backgroundImg ? backgroundImg : ''];

  // Row 3: The combination of all card text, icons, images, and CTA
  // This is inside: gridLayout.children[1] > .card > .card-body
  let contentCell = '';
  if (gridLayout && gridLayout.children.length > 1) {
    const contentCol = gridLayout.children[1];
    const cardBody = contentCol.querySelector('.card-body');
    if (cardBody) {
      // Reference the cardBody element directly (includes images, headings, icons, text, CTA, etc)
      contentCell = cardBody;
    } else {
      // If .card-body is missing, fall back to referencing the full contentCol
      contentCell = contentCol;
    }
  }

  // Compose the table in the required format
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
