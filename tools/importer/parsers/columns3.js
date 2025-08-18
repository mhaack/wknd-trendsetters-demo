/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container (the multi-column root)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the immediate children of the grid-layout (these are the columns)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Table header row exactly as specified
  const headerRow = ['Columns (columns3)'];

  // Build the cells for the columns row
  // Each cell references all the direct children of that column
  const columnCells = columns.map(col => {
    // If the column only has one child, return it directly
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    // Otherwise, gather all element and text children
    // Filter out empty text nodes
    return Array.from(col.childNodes).filter(child => {
      if (child.nodeType === 3) {
        return child.textContent.trim().length > 0;
      }
      return true;
    });
  });

  // Construct the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnCells
  ], document);

  // Replace element with the block table
  element.replaceWith(table);
}
