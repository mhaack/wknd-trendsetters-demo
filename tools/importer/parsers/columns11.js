/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns11)'];

  // Find the main two-column grid at the top
  const topGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  let leftCell = null;
  let rightCell = null;
  if (topGrid) {
    const topCols = topGrid.querySelectorAll(':scope > div');
    // Left column: eyebrow + h1
    const leftDiv = topCols[0];
    if (leftDiv) {
      leftCell = document.createElement('div');
      Array.from(leftDiv.childNodes).forEach(node => {
        // Only add non-empty nodes
        if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
          leftCell.appendChild(node);
        }
      });
    }
    // Right column: paragraph, author info, CTA
    const rightDiv = topCols[1];
    if (rightDiv) {
      rightCell = document.createElement('div');
      // Add the main rich text paragraph
      const richtext = rightDiv.querySelector('.rich-text');
      if (richtext) rightCell.appendChild(richtext);
      // Author row (avatar + info)
      const authorRow = rightDiv.querySelector('.w-layout-grid');
      if (authorRow) rightCell.appendChild(authorRow);
    }
  }

  // Find the second grid containing two images
  const bottomGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  let secondRow = [];
  if (bottomGrid) {
    const imgDivs = bottomGrid.querySelectorAll(':scope > div');
    imgDivs.forEach(div => {
      const img = div.querySelector('img');
      if (img) secondRow.push(img);
    });
    // If for some reason less than 2 images, pad with empty string
    while (secondRow.length < 2) secondRow.push('');
  } else {
    // Fallback: empty cells if no images found
    secondRow = ['', ''];
  }

  // Compose the table structure
  const cells = [
    headerRow,
    [leftCell, rightCell],
    secondRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
