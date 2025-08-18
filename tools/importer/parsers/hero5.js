/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match the example exactly
  const headerRow = ['Hero (hero5)'];

  // Find main grid container
  const grid = element.querySelector(':scope > .w-layout-grid');

  // Find image element (background/primary visual)
  let imgEl = null;
  if (grid) {
    imgEl = grid.querySelector('img');
  }

  // Find the text and CTA block
  let textBlock = [];
  let innerGrid = null;
  if (grid) {
    innerGrid = grid.querySelector('.w-layout-grid.container');
    if (innerGrid) {
      // Find the actual content section
      const contentSection = innerGrid.querySelector('.section');
      if (contentSection) {
        // Heading (any level, but typically h2 in this block)
        const heading = contentSection.querySelector('h2, h1, h3, h4, h5, h6');
        if (heading) textBlock.push(heading);
        // Description paragraph(s)
        const desc = contentSection.querySelector('.rich-text, .paragraph-lg, .w-richtext');
        if (desc) textBlock.push(desc);
        // Buttons (call to action)
        const buttonGroup = contentSection.querySelector('.button-group');
        if (buttonGroup) textBlock.push(buttonGroup);
      }
    }
  }
  // fallback for empty content: ensure at least an empty array
  if (!textBlock.length) textBlock = [''];

  // Compose table as required: 1 column, 3 rows
  const cells = [
    headerRow,
    [imgEl ? imgEl : ''], // image row, empty if not found
    [textBlock], // content row (array of elements)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
