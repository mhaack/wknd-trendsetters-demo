/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches block name
  const headerRow = ['Cards (cards17)'];
  // Each card is a div.utility-aspect-1x1 under the grid layout
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Compose rows: each with [image, ''] as these are image-only cards
  const rows = cardDivs.map(cardDiv => {
    // Get the img (should always exist)
    const img = cardDiv.querySelector('img');
    // Defensive: if img is missing, put empty string
    return [img || '', ''];
  });
  // Compose final cells array
  const cells = [headerRow, ...rows];
  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
