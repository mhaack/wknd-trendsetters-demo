/* global WebImporter */
export default function parse(element, { document }) {
  // Table header (matches example exactly)
  const headerRow = ['Cards (cards21)'];

  // Defensive: Find the card container (supporting variations)
  let cardBody = element.querySelector('.card-body');
  if (!cardBody) {
    cardBody = element.querySelector('.card .card-body') || element;
  }

  // Find the image (mandatory)
  const img = cardBody.querySelector('img');

  // Find the heading/title (optional)
  let heading = cardBody.querySelector('.h4-heading');
  if (!heading) {
    heading = cardBody.querySelector('h4, h3, h2, h1');
  }

  // Prepare text cell content (heading then description, if present)
  const textContent = [];
  if (heading) textContent.push(heading);
  // Look for a description below the heading
  let description = null;
  if (heading) {
    // Find next sibling that is not the image
    let next = heading.nextSibling;
    while (next) {
      if (next.nodeType === Node.ELEMENT_NODE && next.tagName.toLowerCase() !== 'img') {
        description = next;
        break;
      }
      next = next.nextSibling;
    }
    if (description) textContent.push(description);
  }

  // Compose the content row
  const row = [img, textContent];
  const cells = [headerRow, row];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
