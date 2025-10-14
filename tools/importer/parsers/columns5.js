/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate children divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Left column: image only
  const leftCol = columns[0];
  const img = leftCol.querySelector('img');
  const leftColContent = img ? img.cloneNode(true) : leftCol.cloneNode(true);

  // Right column: all text sections stacked
  const rightCol = columns[1];
  // Find all ContentBasic blocks (these contain all text sections)
  const sectionDivs = Array.from(rightCol.querySelectorAll('div[data-ux="ContentBasic"]'));

  // Compose right column: create a single wrapper div and append all sections
  const rightColWrapper = document.createElement('div');
  sectionDivs.forEach(div => {
    rightColWrapper.appendChild(div.cloneNode(true));
  });

  // Table structure
  const headerRow = ['Columns block (columns5)'];
  const secondRow = [leftColContent, rightColWrapper];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow,
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
