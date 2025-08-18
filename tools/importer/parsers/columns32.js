/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the grid layout
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get top-level children (columns)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Table header: exact as example
  const headerRow = ['Columns (columns32)'];
  // Data row: each column's full content as a cell
  const row = columns.map((col) => col);

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);
  element.replaceWith(table);
}
