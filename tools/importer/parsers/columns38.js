/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (each represents a column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Header row must be a single column (single cell array)
  const headerRow = ['Columns (columns38)'];
  // Content row: one cell per column
  const contentRow = columns;
  // Assemble cells for createTable
  const cells = [headerRow, contentRow];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
