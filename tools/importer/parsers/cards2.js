/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // Find the main grid of cards (contains image + text cards)
  const grid = element.querySelector('.grid-layout');
  if (grid) {
    // Get all card links inside the grid
    const cardLinks = Array.from(grid.querySelectorAll(':scope > a.utility-link-content-block'));
    cardLinks.forEach(cardLink => {
      // Find image (if present)
      let img = cardLink.querySelector('img');
      // Compose text content for the card
      const contentElements = [];
      // Tag(s)
      const tagGroup = cardLink.querySelector('.tag-group');
      if (tagGroup) {
        Array.from(tagGroup.children).forEach(tag => {
          contentElements.push(tag);
        });
      }
      // Heading
      const heading = cardLink.querySelector('h3');
      if (heading) contentElements.push(heading);
      // Description
      const para = cardLink.querySelector('p');
      if (para) contentElements.push(para);
      // Build row: [image, text elements]
      cells.push([
        img || '',
        contentElements.length === 1 ? contentElements[0] : contentElements
      ]);
    });
  }

  // Find side columns with text-only cards, divider-separated
  // These are inside .flex-horizontal.flex-vertical.flex-gap-sm
  const flexContainers = element.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm');
  flexContainers.forEach(flexContainer => {
    // Each card is a link. Ignore dividers.
    const cardLinks = Array.from(flexContainer.querySelectorAll(':scope > a.utility-link-content-block'));
    cardLinks.forEach(cardLink => {
      // Only text content
      const contentElements = [];
      const heading = cardLink.querySelector('h3');
      if (heading) contentElements.push(heading);
      const para = cardLink.querySelector('p');
      if (para) contentElements.push(para);
      cells.push(['', contentElements.length === 1 ? contentElements[0] : contentElements]);
    });
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element with the block table
  element.replaceWith(block);
}