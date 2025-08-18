/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) header row exactly as in example
  const cells = [['Cards (cards10)']];

  // Get all card-link anchors (each card)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a.card-link'));

  cardLinks.forEach(card => {
    // First cell: image
    let img = null;
    const aspectDiv = card.querySelector('.utility-aspect-3x2');
    if (aspectDiv) {
      img = aspectDiv.querySelector('img');
    }

    // Second cell: tag, heading, paragraph (in order, only if present)
    const textDiv = card.querySelector('.utility-padding-all-1rem');
    const textParts = [];
    if (textDiv) {
      // Tag (optional, above title)
      const tagGroup = textDiv.querySelector('.tag-group');
      if (tagGroup) {
        const tag = tagGroup.querySelector('.tag');
        if (tag) textParts.push(tag);
      }
      // Heading (title)
      const heading = textDiv.querySelector('h3');
      if (heading) textParts.push(heading);
      // Paragraph (description)
      const para = textDiv.querySelector('p');
      if (para) textParts.push(para);
    }
    // Always push [img, textParts] for each card row
    cells.push([img, textParts]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
