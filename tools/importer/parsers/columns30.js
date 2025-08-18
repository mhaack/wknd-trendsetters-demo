/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (the actual columns wrapper)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Each direct child of grid is a column
  const columnElements = Array.from(grid.children);

  // Header row: single column with block name (exactly as example)
  const headerRow = ['Columns block (columns30)'];

  // Second row: each column's content in its own cell
  const contentRow = columnElements;

  // Create cells: header is a single column, contentRow is N columns
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
