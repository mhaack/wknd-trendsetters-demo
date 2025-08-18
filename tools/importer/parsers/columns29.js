/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all direct child divs (these are the columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // The header row must be a single cell spanning all columns.
  // The block spec requires:
  // cells = [[header], [...columns]];
  const headerRow = ['Columns (columns29)'];
  const contentRow = columnDivs; // Each div is a column, referenced directly

  // Build the cells array
  const cells = [headerRow, contentRow];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
