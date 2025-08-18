/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name per spec
  const headerRow = ['Hero (hero39)'];

  // Get the background image: first <img> inside any child grid cell
  let imgCell = [];
  const gridDivs = element.querySelectorAll(':scope > div.w-layout-grid > div');
  for (const div of gridDivs) {
    const img = div.querySelector('img');
    if (img) {
      imgCell = [img];
      break;
    }
  }

  // Get the content block: headline, paragraph, button
  let contentCell = [];
  for (const div of gridDivs) {
    // Look for headline
    const h1 = div.querySelector('h1');
    // Possible paragraph & CTA in .flex-vertical
    const flex = div.querySelector('.flex-vertical');
    if (h1 || flex) {
      if (h1) contentCell.push(h1);
      if (flex) {
        // Paragraph(s)
        flex.querySelectorAll('p').forEach(p => contentCell.push(p));
        // CTA button (usually <a> inside .button-group)
        flex.querySelectorAll('.button-group a').forEach(a => contentCell.push(a));
      }
      break;
    }
  }

  // Edge case: fallback to whole element if extraction fails
  if (imgCell.length === 0) imgCell = [''];
  if (contentCell.length === 0) contentCell = [''];

  // 3 rows: header, image, content
  const cells = [
    headerRow,
    [imgCell],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
