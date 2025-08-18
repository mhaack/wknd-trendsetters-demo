/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Hero (hero20)'];

  // 2. Background row: collage of images
  // Find the grid layout containing images
  const gridSection = element.querySelector('.ix-hero-scale-3x-to-1x .grid-layout');
  let images = [];
  if (gridSection) {
    images = Array.from(gridSection.querySelectorAll('img'));
  }
  let backgroundCell;
  if (images.length === 1) {
    backgroundCell = images[0]; // Use the single image
  } else if (images.length > 1) {
    // Group images in a div to preserve collage structure
    const collageDiv = document.createElement('div');
    collageDiv.className = 'hero-background-collage';
    images.forEach(img => collageDiv.appendChild(img));
    backgroundCell = collageDiv;
  } else {
    backgroundCell = '';
  }
  const backgroundRow = [backgroundCell];

  // 3. Content row: heading, subheading, call-to-actions
  // All content is inside .ix-hero-scale-3x-to-1x-content .container
  const contentSection = element.querySelector('.ix-hero-scale-3x-to-1x-content .container');
  let contentCell = [];
  if (contentSection) {
    // Heading
    const heading = contentSection.querySelector('h1');
    if (heading) contentCell.push(heading);
    // Subheading
    const subheading = contentSection.querySelector('p.subheading');
    if (subheading) contentCell.push(subheading);
    // Call-to-action buttons
    const buttonGroup = contentSection.querySelector('.button-group');
    if (buttonGroup) {
      // Reference all existing CTA link elements directly
      const ctas = Array.from(buttonGroup.querySelectorAll('a'));
      if (ctas.length > 0) {
        // Group all CTAs in a div (to keep layout)
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'hero-cta-group';
        ctas.forEach(a => ctaDiv.appendChild(a));
        contentCell.push(ctaDiv);
      }
    }
  }
  const contentRow = [contentCell];

  // Build the table as in the example (1 column, 3 rows)
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
