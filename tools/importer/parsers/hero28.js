/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero28)'];

  // Extract background image - find the first <img> inside element
  let bgImg = null;
  const imgs = element.querySelectorAll('img');
  if (imgs.length > 0) {
    bgImg = imgs[0];
  }
  const imgRow = [bgImg ? bgImg : ''];

  // Extract content: Headline (h1), subheading, CTA
  // We want to reference the actual DOM nodes from the original HTML
  let contentCol = null;
  const grid = element.querySelector('.w-layout-grid');
  if (grid && grid.children.length > 1) {
    contentCol = grid.children[1];
  }

  // Compose content cell
  let contentCell = document.createElement('div');
  if (contentCol) {
    // Find the div that contains heading/buttons, or fallback to all children
    let inner = contentCol.querySelector('.utility-margin-bottom-6rem');
    if (inner) {
      // Reference the heading and button group elements directly
      const heading = inner.querySelector('h1');
      if (heading) contentCell.appendChild(heading);
      const buttonGroup = inner.querySelector('.button-group');
      if (buttonGroup && buttonGroup.childNodes.length > 0) {
        contentCell.appendChild(buttonGroup);
      }
    } else {
      // Fallback: append all children if structure is missing
      Array.from(contentCol.childNodes).forEach(node => {
        contentCell.appendChild(node);
      });
    }
  }
  const contentRow = [contentCell];

  // Compose table
  const rows = [headerRow, imgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with table
  element.replaceWith(table);
}
