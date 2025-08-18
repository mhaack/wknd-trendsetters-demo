/* global WebImporter */
export default function parse(element, { document }) {
  // Find main container and grid
  const mainContainer = element.querySelector('.container');
  if (!mainContainer) return;
  const grid = mainContainer.querySelector('.grid-layout');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // First column (text/buttons)
  const leftCol = gridChildren[0];
  const leftColContent = [];
  const heading = leftCol.querySelector('h1');
  if (heading) leftColContent.push(heading);
  const subheading = leftCol.querySelector('p');
  if (subheading) leftColContent.push(subheading);
  const buttonGroup = leftCol.querySelector('.button-group');
  if (buttonGroup) leftColContent.push(buttonGroup);

  // Second column (images)
  const rightCol = gridChildren[1];
  let images = [];
  const imgGrid = rightCol.querySelector('.grid-layout');
  if (imgGrid) {
    images = Array.from(imgGrid.querySelectorAll('img'));
  }

  // The header row must be exactly one column, as per example
  const headerRow = ['Columns block (columns36)'];
  // The content row is an array, with each item a column cell
  const contentRow = [leftColContent, ...images];

  // Compose cells as required
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
