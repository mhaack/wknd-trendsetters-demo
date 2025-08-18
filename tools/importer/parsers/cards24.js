/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards24)'];
  // Find all top-level card links
  const cards = Array.from(element.querySelectorAll(':scope > a.utility-link-content-block'));
  const rows = [headerRow];
  cards.forEach(card => {
    // Image: use the first img inside the utility-aspect-2x3 container
    let img = null;
    const imgContainer = card.querySelector('.utility-aspect-2x3');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // Text cell: tag(s) + date + heading
    const textParts = [];
    // Tag/date row
    const tagDate = card.querySelector('.flex-horizontal');
    if (tagDate && (tagDate.textContent.trim())) {
      textParts.push(tagDate);
    }
    // Heading
    const heading = card.querySelector('h3');
    if (heading && heading.textContent.trim()) {
      textParts.push(heading);
    }
    // If there is no tag/date or heading, fallback to all text
    if (textParts.length === 0) {
      // Defensive: fallback, should never hit for this structure
      textParts.push(document.createTextNode(card.textContent.trim()));
    }
    rows.push([
      img,
      textParts
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
