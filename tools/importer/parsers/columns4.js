/* global WebImporter */
export default function parse(element, { document }) {
  // The header row for the block table, exactly per example
  const headerRow = ['Columns (columns4)'];

  // Get all immediate child divs (each column cell)
  const columnDivs = element.querySelectorAll(':scope > div');

  // For each column, include all of its content (not just the image)
  // This makes the parser robust for cases where there is text, lists, buttons, etc, not just images
  const columns = Array.from(columnDivs).map(colDiv => {
    // If the column has just one child, include that; otherwise, include all children
    const children = Array.from(colDiv.childNodes).filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
    if (children.length === 1) {
      return children[0];
    } else if (children.length > 1) {
      return children;
    } else {
      // If somehow empty, still return an empty text node to not break table structure
      return document.createTextNode('');
    }
  });

  const cells = [
    headerRow,
    columns
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
