/* global WebImporter */
export default function parse(element, { document }) {
  // Find the parent container holding all cards
  const cardsContainer = element.querySelector('[data-ux="ContentCards"]');
  if (!cardsContainer) return;
  const cardCells = Array.from(cardsContainer.querySelectorAll('[data-ux="GridCell"]'));

  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  cardCells.forEach((cardCell) => {
    // Image: [data-ux="ContentCardWrapperImage"] img
    const imageWrapper = cardCell.querySelector('[data-ux="ContentCardWrapperImage"]');
    let img = imageWrapper ? imageWrapper.querySelector('img') : null;

    // Text: Collect all h4 headings in [data-ux="Block"], each as a separate element
    const block = cardCell.querySelector('[data-ux="Block"]');
    let textCell = [];
    if (block) {
      const h4s = Array.from(block.querySelectorAll('h4'));
      if (h4s.length) {
        textCell = h4s.map(h => {
          const heading = document.createElement('h4');
          heading.textContent = h.textContent.trim();
          return heading;
        });
      } else {
        textCell = [block.textContent.trim()];
      }
    }
    rows.push([img, textCell]);
  });

  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
