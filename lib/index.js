"use strict";
const spellchecker = require("spellchecker");
const EventEmitter = require("events");
let debounced;
class SpellChecker extends EventEmitter {
    constructor(cacheTTL = 10000) {
        super();
        this.cacheTTL = cacheTTL;
        this.lookup = [];
    }
    clearCache() {
        this.lookup = [];
    }
    getCurrentWord() {
        const sel = window.getSelection();
        if (!sel) {
            return '';
        }
        if (sel.type === 'Caret') {
            const word = [];
            const text = sel.focusNode.textContent || '';
            let i = sel.focusOffset - 1;
            while (i > 0 && /\s/g.test(text[i])) {
                word.unshift(text[i]);
                i--;
            }
            return word.join('');
        }
        return sel.toString();
    }
    spellCheck(word) {
        if (debounced) {
            clearTimeout(debounced);
        }
        debounced = setTimeout(() => this.clearCache(), this.cacheTTL);
        let cached = this.lookup[word];
        let { isMisspelled, corrections } = cached || { isMisspelled: false, corrections: [] };
        if (!cached) {
            isMisspelled = spellchecker.isMisspelled(word);
            corrections = isMisspelled ? spellchecker.getCorrectionsForMisspelling(word) : [];
            this.lookup[word] = { isMisspelled, corrections };
        }
        if (isMisspelled && this.getCurrentWord() === word) {
            console.log('word', this.getCurrentWord());
            this.emit('misspelling', corrections);
        }
        return !isMisspelled;
    }
}
module.exports = SpellChecker;
