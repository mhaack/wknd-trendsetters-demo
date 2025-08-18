/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Columns block (columns16)'];

  // Find the grid container holding columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // For each grid cell, gather all direct children
  const gridItems = Array.from(grid.children);

  // For each column, gather all content (not just img, but any text or inline elements)
  const columnCells = gridItems.map(item => {
    // Take all children of the primary column wrapper
    // If there's only one child (e.g. the aspect-ratio div), use its children
    const wrappers = Array.from(item.children);
    let content = [];
    wrappers.forEach(wrap => {
      // Collect all element nodes (img, p, span, etc.) inside wrapper
      Array.from(wrap.childNodes).forEach(node => {
        // Only include element nodes or non-empty text nodes
        if (node.nodeType === 1) {
          content.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Preserve non-empty text nodes
          content.push(document.createTextNode(node.textContent));
        }
      });
    });
    // If no content found, fallback to empty string
    if (content.length === 0) return '';
    return content.length === 1 ? content[0] : content;
  });

  // Compose the table: header (one cell), column row (one per column)
  const cells = [headerRow, columnCells];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
