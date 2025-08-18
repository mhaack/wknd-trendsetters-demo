/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct column children of the grid
  const columns = Array.from(grid.children);

  // Build the table so the header row is a single cell, and the second row contains the columns
  const tableRows = [
    ['Columns (columns9)'], // header row - single cell
    columns                 // content row - each column as a cell
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element in the DOM
  element.replaceWith(block);
}
