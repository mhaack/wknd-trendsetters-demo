/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid (columns)
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // For each column, gather all its content (including text and child nodes)
  // If the column is an image only (like <img>), handle it directly
  // If the column contains multiple elements, include all that are not empty text nodes
  const cells = columns.map(col => {
    // If it's just an <img>, use it directly
    if (col.tagName === 'IMG') {
      return col;
    }
    // Otherwise, gather non-empty child nodes (including text)
    const parts = [];
    col.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        parts.push(node);
      } else if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent.trim();
        if (txt.length) {
          // Preserve text node as a <span> to keep formatting
          const span = document.createElement('span');
          span.textContent = txt;
          parts.push(span);
        }
      }
    });
    // If only one part, use it directly; else, return array
    return parts.length === 1 ? parts[0] : parts;
  });

  // Build table with proper header (EXACT match)
  const headerRow = ['Columns (columns15)'];
  const table = WebImporter.DOMUtils.createTable([headerRow, cells], document);
  element.replaceWith(table);
}
