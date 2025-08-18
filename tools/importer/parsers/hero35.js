/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in example
  const headerRow = ['Hero (hero35)'];

  // Row 2: Background image (none present in this HTML)
  const backgroundRow = [''];

  // Row 3: Gather Title, Subheading, and CTA (all placed in one cell)
  // We'll reference the relevant content blocks directly
  let title = null;
  let subheading = null;
  let cta = null;

  // Find the grid which contains the actual content
  const grid = element.querySelector('.grid-layout');
  if (grid) {
    // Get all direct children
    const gridChildren = Array.from(grid.children);
    // The first child contains the headline and subheading
    const textBlock = gridChildren[0];
    if (textBlock) {
      // Heading (any level)
      title = textBlock.querySelector('h1, h2, h3, h4, h5, h6');
      // Subheading (paragraph, may have class 'subheading')
      subheading = textBlock.querySelector('p, .subheading');
    }
    // Second child is typically the CTA button or link
    if (gridChildren.length > 1) {
      // Use the entire element as CTA (button or link)
      cta = gridChildren[1];
    }
  }

  // Compose the content cell for row 3
  const contentArr = [];
  if (title) contentArr.push(title);
  if (subheading) contentArr.push(subheading);
  if (cta) contentArr.push(cta);
  const contentRow = [contentArr];

  // Compose the block table (1 column, 3 rows)
  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}