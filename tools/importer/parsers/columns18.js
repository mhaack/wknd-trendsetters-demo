/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns18)'];

  // Find the main content container - it contains the grid with columns
  const container = element.querySelector('.container');
  let grid;
  if (container) {
    grid = container.querySelector('.grid-layout');
  } else {
    grid = element.querySelector('.grid-layout');
  }

  // Defensive: if there's no grid, fallback to just reference all direct children
  let gridChildren = grid ? Array.from(grid.children) : Array.from(element.children);

  // From HTML: gridChildren[0] = left content column (div),
  //             gridChildren[1] = ul (contact list),
  //             gridChildren[2] = image (right column)

  // We want left cell: intro block (headings/p/subheading) and the ul (contact info)
  //           right cell: image
  let leftCellElements = [];
  if (gridChildren.length > 1) {
    leftCellElements.push(gridChildren[0]);
    leftCellElements.push(gridChildren[1]);
  } else if (gridChildren.length === 1) {
    leftCellElements.push(gridChildren[0]);
  }

  // Find the image for the right cell
  let rightCellImg = null;
  // Try to find the first <img> inside the grid
  if (grid) {
    rightCellImg = grid.querySelector('img');
  }
  // Fallback: search in the whole element
  if (!rightCellImg) {
    rightCellImg = element.querySelector('img');
  }

  // Build the content row (second row):
  //   left cell: combined content column
  //   right cell: image (or null if not found)
  const secondRow = [leftCellElements, rightCellImg];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);
  element.replaceWith(table);
}
