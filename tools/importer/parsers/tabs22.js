/* global WebImporter */
export default function parse(element, { document }) {
  // Find tab menu and content
  const tabMenu = element.querySelector(':scope > .w-tab-menu, :scope > [role="tablist"]');
  const tabContent = element.querySelector(':scope > .w-tab-content, :scope > .tabs-content');
  if (!tabMenu || !tabContent) return;

  // Get all tab links (labels) and panes (content)
  const tabLinks = Array.from(tabMenu.querySelectorAll('[role="tab"], a.w-tab-link'));
  const tabPanes = Array.from(tabContent.querySelectorAll('.w-tab-pane'));

  // Compose table: header row (block name, one cell), then for each tab: [label, content]
  const cells = [
    ['Tabs'],
  ];

  for (let i = 0; i < tabLinks.length; i++) {
    let label = '';
    const link = tabLinks[i];
    const labelDiv = link.querySelector('div');
    if (labelDiv && labelDiv.textContent.trim()) {
      label = labelDiv.textContent.trim();
    } else {
      label = link.textContent.trim();
    }
    let content = '';
    const pane = tabPanes[i];
    if (pane) {
      // Use the grid/content as the tab content if available, else the pane
      const grid = pane.querySelector('.w-layout-grid');
      content = grid ? grid : pane;
    }
    // Each row is an array of two columns: [label, content]
    cells.push([label, content]);
  }

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
