import * as spellchecker from 'spellchecker';
import * as EventEmitter from 'events';

let debounced: NodeJS.Timer;

interface CachedWord {
  isMisspelled: boolean;
  corrections: string[];
}

class SpellChecker extends EventEmitter {

  private lookup: CachedWord[] = [];

  constructor(private cacheTTL = 10000) {
    super();
  }

  private clearCache(): void {
    this.lookup = [];
  }

  private getCurrentWord(): string {
    const sel = window.getSelection();
    if (!sel) {
      return '';
    }

    if (sel.type === 'Caret') {
      const word: string[] = [];
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

  spellCheck(word: string): boolean {
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
      this.emit('misspelling', corrections);
    }

    return !isMisspelled;
  }
}

export = SpellChecker;
