const electron = require('electron');
const {webFrame, remote} = electron;
const SpellChecker = require('../lib/index.js');
const buildEditorContextMenu = remote.require('electron-editor-context-menu');

let selection;
function resetSelection () {
  selection = {
    isMisspelled: false,
    spellingSuggestions: []
  };
}
resetSelection();

// Reset the selection when clicking around, before the spell-checker runs and the context menu shows.
window.addEventListener('mousedown', resetSelection);

function onMisspelling (suggestions) {
  // Prime the context menu with spelling suggestions if the user has selected text.
  if (window.getSelection().toString()) {
    selection.isMisspelled = true;
    selection.spellingSuggestions = suggestions.slice(0, 3);
  }
  return selection;
}

// The spell-checker runs when the user clicks on text and before the 'contextmenu' event fires.
webFrame.setSpellCheckProvider(
  'en-US',
  true,
  new SpellChecker('en-US').on('misspelling', onMisspelling));


function onContextMenu (event) {
  // Only show context menus in text fields
  if (!event.target.closest('textarea, input, [contenteditable="true"]')) {
    return;
  }

  const menu = buildEditorContextMenu(selection);

  // do this b/c of a potential timing issue between when the selection changes
  // and when this is fired
  setTimeout(function () {
    menu.popup(remote.getCurrentWindow());
  }, 30);
}

window.addEventListener('contextmenu', onContextMenu);

module.exports.selection = selection;
module.exports.resetSelection = resetSelection;
module.exports.onContextMenu = onContextMenu;
module.exports.onMisspelling = onMisspelling;
