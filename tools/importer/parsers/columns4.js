/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns block (columns4)'];

  // Find the grid containing the two columns
  const grid = element.querySelector(':scope > div');
  if (!grid) return;
  const gridCells = grid.querySelectorAll(':scope > div');
  if (gridCells.length < 2) return;

  // --- LEFT COLUMN: Image ---
  let leftCell = gridCells[0]; // image is first in DOM
  let leftContent = null;
  // Get picture or img from leftCell
  const picture = leftCell.querySelector('picture');
  if (picture) {
    leftContent = picture.cloneNode(true);
  } else {
    const img = leftCell.querySelector('img');
    if (img) leftContent = img.cloneNode(true);
  }

  // --- RIGHT COLUMN: Text content (heading + paragraph) ---
  let rightCell = gridCells[1]; // text is second in DOM
  let rightContent = [];
  // Get heading if present
  const heading = rightCell.querySelector('[data-ux="ContentHeading"], h4, h1, h2, h3, h5, h6');
  if (heading) rightContent.push(heading.cloneNode(true));
  // Get all paragraphs inside rightCell
  rightCell.querySelectorAll('p').forEach(node => {
    if (node.textContent && node.textContent.trim()) {
      rightContent.push(node.cloneNode(true));
    }
  });
  // If still empty, fallback to all text nodes
  if (!rightContent.length) {
    Array.from(rightCell.childNodes).forEach(node => {
      if ((node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) && node.textContent && node.textContent.trim()) {
        rightContent.push(node.cloneNode(true));
      }
    });
  }

  // Table rows
  const rows = [
    headerRow,
    [leftContent, rightContent.length ? rightContent : '']
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
