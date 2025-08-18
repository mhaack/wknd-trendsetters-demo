/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion Block Header
  const rows = [
    ['Accordion (accordion34)']
  ];

  // Accordion items: top-level .accordion or .w-dropdown
  const items = element.querySelectorAll(':scope > .accordion, :scope > .w-dropdown');

  items.forEach((item) => {
    // Title cell: find the clickable label
    let titleTextEl = item.querySelector('.paragraph-lg');
    if (!titleTextEl) {
      // fallback: get first child div of toggle (after icon)
      const toggle = item.querySelector('.w-dropdown-toggle');
      if (toggle) {
        const children = Array.from(toggle.children).filter(c => !c.classList.contains('w-icon-dropdown-toggle'));
        titleTextEl = children[0] || toggle;
      }
    }

    // Content cell: find the rich text content inside expanded panel
    let contentEl = item.querySelector('.accordion-content, .w-dropdown-list');
    if (contentEl) {
      const rich = contentEl.querySelector('.rich-text, .w-richtext');
      if (rich) {
        contentEl = rich;
      } else {
        // fallback: get first div within contentEl
        const divChild = contentEl.querySelector('div');
        if (divChild) contentEl = divChild;
      }
    } else {
      // Edge case: if no content found, use empty div
      contentEl = document.createElement('div');
    }

    rows.push([
      titleTextEl,
      contentEl
    ]);
  });

  // Create Accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
