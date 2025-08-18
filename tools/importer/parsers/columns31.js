/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column as specified in the example
  const headerRow = ['Columns block (columns31)'];

  // Find the grid-layout container holding columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get direct children of grid-layout, each is a column
  const columns = Array.from(grid.children);

  // The content row: as many columns as found in the grid
  const contentRow = columns.map(col => col && col.childNodes.length ? col : '');

  // Create the table: headerRow is a single cell, contentRow is N columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element with the block table
  element.replaceWith(table);
}
