/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as shown in the example
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];
  // Find all cards in all tab panes
  const panes = element.querySelectorAll('.w-tab-pane');
  panes.forEach((pane) => {
    // Get direct grid child; skip if missing
    const grid = pane.querySelector('.w-layout-grid');
    if (!grid) return;
    // All card links in grid
    const cards = grid.querySelectorAll('a');
    cards.forEach((card) => {
      // 1st cell: the image (img element), prefer .cover-image
      let img = card.querySelector('img.cover-image') || card.querySelector('img');
      // 2nd cell: heading and description
      // Heading
      const heading = card.querySelector('h3');
      // Description (div.paragraph-sm or .paragraph-sm.utility-margin-bottom-0)
      let desc = card.querySelector('.paragraph-sm');
      // Sometimes heading and desc may be wrapped in a div; we only want their elements
      const textCell = [];
      if (heading) textCell.push(heading);
      if (desc && desc !== heading) textCell.push(desc);
      // If both missing, don't push empty row
      if (!img && textCell.length === 0) return;
      // Add row to table
      rows.push([
        img ? img : '',
        textCell.length === 1 ? textCell[0] : textCell
      ]);
    });
  });
  // Build and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
