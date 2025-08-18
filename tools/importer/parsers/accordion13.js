/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block header, as specified in the task and example
  const headerRow = ['Accordion (accordion13)'];

  // Get all accordion items. Each is a direct child '.divider' under the main element
  const accordionItems = [];
  const dividers = element.querySelectorAll(':scope > .divider');
  dividers.forEach((divider) => {
    // Each divider contains a '.grid-layout' with two children: title and content
    const grid = divider.querySelector('.grid-layout');
    if (grid) {
      // Safely get both columns for this row
      const gridChildren = grid.querySelectorAll(':scope > div');
      // Defensive: handle missing title/content
      const title = gridChildren[0] || document.createElement('div');
      const content = gridChildren[1] || document.createElement('div');
      accordionItems.push([title, content]);
    }
  });

  // Only create rows for valid accordion items
  const cells = [headerRow, ...accordionItems];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element in document
  element.replaceWith(block);
}
