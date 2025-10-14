/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns: left (text) and right (image)
  let leftCol = null, rightCol = null;

  // Find SplitItem (left) and SplitItemImage (right)
  const left = element.querySelector('[data-ux="SplitItem"]');
  const right = element.querySelector('[data-ux="SplitItemImage"]');

  // --- LEFT COLUMN (TEXT) ---
  if (left) {
    // Find the main section
    const section = left.querySelector('section[data-ux="SectionSplit"]') || left;
    // Create a container for left column content
    leftCol = document.createElement('div');
    // Heading
    const heading = section.querySelector('h2');
    if (heading) leftCol.appendChild(heading.cloneNode(true));
    // All content blocks
    const contentBlocks = section.querySelectorAll('[data-ux="Content"]');
    contentBlocks.forEach(block => {
      leftCol.appendChild(block.cloneNode(true));
    });
  }

  // --- RIGHT COLUMN (IMAGE) ---
  if (right) {
    // Try to find an actual <img> element
    let img = right.querySelector('img');
    if (!img) {
      // Sometimes image is a background-image on a div
      const bgDiv = right.querySelector('div[role="img"]');
      if (bgDiv) {
        // Try to get background-image from inline style first
        let bgUrl = '';
        if (bgDiv.style.backgroundImage) {
          const urlMatch = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
          if (urlMatch && urlMatch[1]) {
            bgUrl = urlMatch[1];
          }
        }
        // If no inline style, try data-hlx-imp-bgimage
        if (!bgUrl && bgDiv.hasAttribute('data-hlx-imp-bgimage')) {
          bgUrl = bgDiv.getAttribute('data-hlx-imp-bgimage');
        }
        // If still no url, try to find an <img> inside
        if (!bgUrl) {
          const fallbackImg = bgDiv.querySelector('img');
          if (fallbackImg) {
            img = fallbackImg;
          }
        }
        // If we have a background image URL, create an <img>
        if (bgUrl) {
          img = document.createElement('img');
          img.src = bgUrl;
        }
      }
    }
    if (img) {
      rightCol = document.createElement('div');
      rightCol.appendChild(img);
    } else {
      // If no image found, use the right column as-is
      rightCol = right.cloneNode(true);
    }
  }

  // --- Compose table ---
  const headerRow = ['Columns (columns6)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element
  element.replaceWith(table);
}
