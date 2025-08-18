/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout containing the columns
  const grid = element.querySelector('.grid-layout, .w-layout-grid');
  if (!grid) return;

  // Get the immediate children of the grid, which are the columns
  const columns = Array.from(grid.children);
  if (columns.length < 2) return; // Expecting at least two columns for a columns block

  // Construct the table rows
  const headerRow = ['Columns block (columns27)'];
  // Next row: each column's content as a cell.
  // Reference the actual elements in the document, not clones
  const secondRow = columns.map(col => col);

  const tableData = [headerRow, secondRow];

  // Create table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
