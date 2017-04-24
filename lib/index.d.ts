/// <reference types="node" />
import * as EventEmitter from 'events';
declare class SpellChecker extends EventEmitter {
    private cacheTTL;
    private lookup;
    constructor(cacheTTL?: number);
    private clearCache();
    private getCurrentWord();
    spellCheck(word: string): boolean;
}
export = SpellChecker;
