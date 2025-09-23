import { loadCSS } from './aem.js';
import { saveToAem, saveToDA } from './edit/actions.js';
import { EditableImage } from './edit/image.js';
import { DOMToSourceMapper } from './edit/mapper.js';

const SECTION_SELECTOR = '.section';
const BLOCK_SELECTOR = '[data-block-name]';

const EDITABLES = [
  { selector: 'div.block h1', nodeName: 'H1', label: 'Heading 1' },
  { selector: 'div.block h2', nodeName: 'H2', label: 'Heading 2' },
  { selector: 'div.block h3', nodeName: 'H3', label: 'Heading 3' },
  { selector: 'div.block h4', nodeName: 'H4', label: 'Heading 4' },
  { selector: 'div.block h5', nodeName: 'H5', label: 'Heading 5' },
  { selector: 'div.block h6', nodeName: 'H6', label: 'Heading 6' },
  { selector: 'div.block p', nodeName: 'P', label: 'Paragraph' },
  { selector: 'img', nodeName: 'IMG', label: 'Image' },
  { selector: 'div.block ul', nodeName: 'UL', label: 'List' },
  { selector: 'div.block ol', nodeName: 'OL', label: 'Ordered List' },
  {
    selector: 'div.default-content-wrapper',
    nodeName: 'DIV',
    label: 'Default Content',
  },
];
const EDITABLE_SELECTORS = EDITABLES.map((edit) => edit.selector).join(', ');

const label = document.createElement('div');
label.className = 'nx-label';

const buttons = document.createElement('div');
buttons.className = 'nx-buttons';

const closeButton = document.createElement('button');
closeButton.className = 'nx-close';
const closeButtonIcon = document.createElement('i');
closeButtonIcon.classList.add('nx-close-icon', 'nx-icon');
closeButton.append(closeButtonIcon);
buttons.append(closeButton);

const saveButton = document.createElement('button');
saveButton.className = 'nx-save';
const saveButtonIcon = document.createElement('i');
saveButtonIcon.classList.add('nx-save-icon', 'nx-icon');
saveButton.append(saveButtonIcon);
buttons.append(saveButton);

const overlay = document.createElement('div');
overlay.className = 'nx-overlay';
overlay.append(buttons, label);
document.body.append(overlay);

// Global mapper instance
let domToSourceMapper = null;
let editedElement = { current: null };

// Initialize the mapper with source HTML
function initializeMapper(sourceHTML) {
  if (sourceHTML) {
    domToSourceMapper = new DOMToSourceMapper(sourceHTML);
  } else {
    console.warn('No source HTML provided for mapper initialization');
  }
}

function updateSourceElement(editable) {
  console.log('Updating source element for', editable);
  if (domToSourceMapper) {
    domToSourceMapper.updateSourceElement(editable, 'html', editable.innerHTML);
  }
}

function finishEdit(editable) {
  if (editable) {
    updateSourceElement(editable);
    
    editable.removeAttribute('contenteditable');
    editable.classList.remove('is-active-edit');
    if (editable.tagName === 'IMG') {
      new EditableImage(editable).hideOverlay();
    }
    editedElement.current = null;
  }
}

function handleEditable(editable) {
  const childEdits = editable.querySelectorAll(EDITABLE_SELECTORS);
  if (childEdits.length > 0) return;

  const sourceElement = domToSourceMapper.initSourceElement(editable);
  if (sourceElement) {
    console.log('Source element initialized:', sourceElement);
    editable.dataset.edit = true;
    editable.dataset.editId = sourceElement.dataset.editId;

    editable.addEventListener('click', (e) => {
      // If it's already editable, do nothing      
      const target = e.target;
      if (target.closest('[contenteditable]')) {
        return;
      }

      // Save previous edited elements and remove the styles
      const prevEditables = document.body.querySelectorAll('[contenteditable]');
      prevEditables.forEach((prev) => {
        finishEdit(prev);
      });

      // Set the editable attr and set focus
      editable.setAttribute('contenteditable', true);
      editable.classList.add('is-active-edit');
      editable.classList.remove('is-editable');
      if (editable.tagName === 'IMG') {
        new EditableImage(editable).showOverlay();
      }     

      setTimeout(() => {
        editable.focus();
      }, 100);

      // keep track of the edited element
      editedElement.current = editable;
    });
  } else {
    console.warn('Source element not initialized:', editable);
  }
}

function getLabel(el) {
  if (el.dataset.blockName) return `${el.dataset.blockName} block`;
  if (el.classList.contains('section')) return 'Section';
  return EDITABLES.find((editable) => {
    return editable.nodeName === el.nodeName;
  })?.label;
}

function getTree(el) {
  const tree = [getLabel(el)];
  let traverse = el;
  while (traverse) {
    traverse = traverse.parentElement.closest('[data-edit]');
    if (!traverse) break;
    tree.push(getLabel(traverse));
  }
  return tree;
}

function setTree(tree) {
  const list = document.createElement('ul');
  tree.forEach((label) => {
    list.insertAdjacentHTML('beforeend', `<li>${label}</li>`);
  });
  label.append(list);
}

function handleSection(section) {
  section.addEventListener('mouseover', (e) => {
    // Attempt to resolve the editable
    const el = e.target.dataset.edit
      ? e.target
      : e.target.closest('[data-edit]');
    if (!el ||!el.dataset.edit) return; 

    // update edited element
    if(!el.hasAttribute('contenteditable')) {
      el.classList.add('is-editable');
    }

    // update tree view
    label.innerHTML = '';
    const tree = getTree(el);
    setTree(tree);
  });

  section.addEventListener('mouseout', (e) => {
    const el = e.target.dataset.edit
      ? e.target
      : e.target.closest('[data-edit]');
    if (!el ||!el.dataset.edit) return;

    el.classList.remove('is-editable');

    // update tree view
    label.innerHTML = '';
  });
}

async function handleSave(context) {
  // first close all editables
  if (editedElement.current) {
    finishEdit(editedElement.current);
  }

  // visually indicate saving
  saveButtonIcon.classList.add('is-saving');
  saveButton.disabled = true;

  // save to DA
  const sourceHTML = domToSourceMapper.getSourceHTML(true);
  //console.log('Source HTML:', sourceHTML);
  const path = window.location.pathname.endsWith('/')
    ? window.location.pathname + 'index'
    : window.location.pathname;
  const saveResult = await saveToDA(
    `/${context.config.owner}/${context.config.repo}/${path}`,
    sourceHTML
  );

  // save to AEM
  if (saveResult.success) {
    const aemResult = await saveToAem(
      `/${context.config.owner}/${context.config.repo}/${path}`,
      'preview'
    );
    if (aemResult.error) {
      console.log('AEM preview save failed', aemResult.error);
    } else {
      console.log('AEM preview saved successfully');
    }
  } else {
    console.log('Source HTML save failed, did not save to AEM', saveResult.error);
  }

  // visually indicate saving is done
  saveButtonIcon.classList.remove('is-saving');
  saveButton.disabled = false;
}

/**
 * Initializes the edit context
 * @param {*} context 
 */
export default async function initEdit(context) {
  await loadCSS('/styles/context.css');
  const main = document.body.querySelector('main');

  // fetch from content source directly
  const path = window.location.pathname.endsWith('/')
    ? window.location.pathname + 'index'
    : window.location.pathname;
  const sourceUrl = `${context.config.mountpoint}${path.substring(1)}`;
  const sourceHTML = await fetch(sourceUrl).then((res) => res.text());
  initializeMapper(sourceHTML);

  const els = main.querySelectorAll(
    `${SECTION_SELECTOR}, ${BLOCK_SELECTOR}`
  );
  els.forEach((el) => {
    el.dataset.edit = true;
    handleSection(el);
  });

  const editables = main.querySelectorAll(EDITABLE_SELECTORS);
  editables.forEach((editable) => {
    handleEditable(editable);
  });

  overlay.style.display = 'block';

  // handle click outside of edited element to finish edit
  document.addEventListener('click', (e) => {
    if (editedElement.current && !editedElement.current.contains(e.target)) {
      finishEdit(editedElement.current);
    }
  });

  // handle action buttons
  saveButton.addEventListener('click', () => {
    handleSave(context);
  });
  closeButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    const sk = document.querySelector('aem-sidekick');
    if (sk) {
      sk.setAttribute('open', 'true');
    }
  });
}
