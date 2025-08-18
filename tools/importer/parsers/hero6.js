/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block type
  const headerRow = ['Hero (hero6)'];

  // --- Extract background image (if present) ---
  // Look for any immediate child img elements with a cover/background role
  let bgImg = null;
  const imgCandidates = element.querySelectorAll('img');
  imgCandidates.forEach(img => {
    // Look for image with class indicating cover/background
    if (img.classList.contains('cover-image')) {
      bgImg = img;
    }
  });
  const bgImgRow = [bgImg ? bgImg : ''];

  // --- Extract headline, subheading, CTA(s) ---
  // Find the content container (normally .card)
  let card = null;
  // Look for a card that contains heading, subheading, buttons.
  // Try to find using class, fallback to other heuristics if needed
  card = element.querySelector('.card');

  // Compose cell content from all relevant elements inside the card
  const cellContent = [];
  if (card) {
    // Headline (h1)
    const headline = card.querySelector('h1');
    if (headline) cellContent.push(headline);
    // Subheading (p.subheading or first p)
    let subheading = card.querySelector('p.subheading');
    if (!subheading) {
      // fallback to first paragraph if .subheading absent
      subheading = card.querySelector('p');
    }
    if (subheading) cellContent.push(subheading);
    // CTA Buttons
    // Look for any direct <a> elements within a button group
    const buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) {
      const buttons = buttonGroup.querySelectorAll('a');
      buttons.forEach(btn => cellContent.push(btn));
    } else {
      // If no button group, look for .button links directly in card
      const buttons = card.querySelectorAll('a.button');
      buttons.forEach(btn => cellContent.push(btn));
    }
  }
  // If nothing found, provide empty string so table structure is maintained
  const contentRow = [cellContent.length ? cellContent : ''];

  // Compose the block table
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
