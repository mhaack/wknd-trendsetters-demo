/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container inside the section
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the immediate .w-layout-grid.grid-layout that contains the two columns
  const mainGrid = container.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;
  // Find all direct children in mainGrid
  const gridChildren = Array.from(mainGrid.children);

  // The first two children are the two columns (left and right testimonial columns)
  // From visual analysis: left = title/quote grid, right = author info grid
  let column1 = null;
  let column2 = null;
  if (gridChildren.length === 3) {
    // The first two are header and quote, last is the testimonial columns grid
    // The inner grid contains the actual columns
    const innerGrid = gridChildren[2];
    // This grid should have two columns (one for testimonial and author, one for logo)
    const innerCols = Array.from(innerGrid.children).filter(el => el.nodeType === 1);
    // We'll consider all left-side items for column1, and all right-side items for column2
    // Let's build them using div wrappers
    column1 = document.createElement('div');
    // Heading + quote at top
    if (gridChildren[0]) column1.appendChild(gridChildren[0]);
    if (gridChildren[1]) column1.appendChild(gridChildren[1]);
    // Divider and author info below
    if (innerCols[0]) column1.appendChild(innerCols[0]);
    if (innerCols[1]) column1.appendChild(innerCols[1]);
    // column2 is the right-most item (logo svg)
    column2 = document.createElement('div');
    if (innerCols[2]) column2.appendChild(innerCols[2]);
    else if (innerCols[1] && innerCols[1].querySelector('svg')) column2.appendChild(innerCols[1]);
  } else {
    // Fallback: treat all children as a single column
    column1 = document.createElement('div');
    gridChildren.forEach(child => column1.appendChild(child));
    column2 = document.createElement('div');
  }

  // Remove empty columns
  const columns = [column1, column2].filter(col => col && col.childNodes.length > 0);

  // Build the block table
  const headerRow = ['Columns (columns26)'];
  const contentRow = columns;
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
