/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid
  const columns = Array.from(grid.children);

  // For the provided HTML, we expect two columns:
  // First: image
  // Second: text content (heading, paragraph, buttons)
  // Reference the entire column element for each cell (to preserve structure and semantics)
  const cells = [
    ['Columns block (columns1)'],
    columns
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
