/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns block (columns3)'];

  // Find all direct GridCell children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div[data-ux="GridCell"]'));
  if (!columns.length) return;

  // Helper to extract card content
  function extractCard(card, idx) {
    const frag = document.createElement('div');
    if (idx === 0) {
      // First column: image, heading, description
      const img = card.querySelector('[data-ux="ContentCardWrapperImage"] img');
      const heading = card.querySelector('[data-ux="ContentCardHeading"]');
      const desc = card.querySelector('[data-ux="ContentCardText"]');
      if (img) frag.appendChild(img.cloneNode(true));
      if (heading) frag.appendChild(heading.cloneNode(true));
      if (desc) frag.appendChild(desc.cloneNode(true));
      return frag;
    }
    // Other columns: only the FIRST heading, EXPANDED text, and show less link
    const heading = card.querySelector('[data-ux="ContentCardHeading"]');
    if (heading) frag.appendChild(heading.cloneNode(true));
    // Expanded block (text only, no duplicate heading)
    const expandedBlock = card.querySelector('[id^="expandedTextBlock"] [data-ux="ContentCardText"]');
    if (expandedBlock) frag.appendChild(expandedBlock.cloneNode(true));
    const showLessLabel = card.querySelector('[id^="expandedTextBlock"] label a');
    if (showLessLabel) frag.appendChild(showLessLabel.cloneNode(true));
    return frag;
  }

  // For each column, extract the correct content
  const cells = columns.map((col, idx) => {
    const card = col.querySelector('[data-ux="ContentCard"]');
    if (!card) return '';
    return extractCard(card, idx);
  });

  // Compose table rows
  const tableRows = [headerRow, cells];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
