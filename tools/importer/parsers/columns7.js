/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct children of the grid (the image wrappers)
  const gridCells = Array.from(element.children);
  // Extract the images from each cell
  const images = gridCells.map(cell => cell.querySelector('img') || '');

  // Header row: single cell, must span all columns
  const headerCell = document.createElement('th');
  headerCell.textContent = 'Columns block (columns7)';
  headerCell.colSpan = images.length > 0 ? images.length : 1;
  const headerRow = [headerCell];

  // Content row: one cell for each image
  const contentRow = images;

  // Compose the table
  const cells = [
    headerRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
