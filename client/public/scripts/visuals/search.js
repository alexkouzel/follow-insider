export class SearchBar {
    constructor(tag, loadHints, onSearch) {
        this.tag = tag;
        this.onSearch = onSearch;
        this.loadHints = loadHints;

        this.focus = -1;
        this.hintsNum = 0;

        this._handleHints(loadHints);
    }

    get _hintsTag() {
        return this.tag.querySelectorAll('.hints>*');
    }

    _handleHints() {
        let inputTag = this.tag.querySelector('input');

        // update hints on search input
        let debounceTimeout;
        inputTag.addEventListener('input', () => {
            clearTimeout(debounceTimeout);

            let handleHints = async () => {
                inputTag.value !== ''
                    ? await this._updateHints(inputTag.value)
                    : this._resetHints();
            };

            debounceTimeout = setTimeout(handleHints, 300);
        });

        // handle hints' navigation & clicks
        inputTag.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Down':
                case 'ArrowDown':
                    this.focus++;
                    this._updateActiveHint();
                    break;
                case 'Up':
                case 'ArrowUp':
                    this.focus--;
                    this._updateActiveHint();
                    break;
                case 'Enter':
                    let hintsTag = this._hintsTag;

                    hintsTag.length !== 0
                        ? hintsTag[this.focus].click()
                        : this.onSearch('', '');
            }
        });

        // hide hints if clicked somewhere
        window.addEventListener('click', () => {
            this._resetHints();
        });
    }

    _updateActiveHint() {
        if (this.hintsNum === 0)
            return false;

        // shift current focus
        if (this.focus < 0) {
            this.focus = (this.hintsNum - 1);
        }
        this.focus = this.focus % this.hintsNum;

        // update an active hint
        let hintsTag = this._hintsTag;

        if (hintsTag === null)
            return;

        for (let i = 0; i < hintsTag.length; i++) {
            let hintTag = hintsTag[i];

            i === this.focus
                ? hintTag.classList.add('hints-active')
                : hintTag.classList.remove('hints-active');
        }
    }

    async _updateHints(input) {
        this._resetHints();

        let hintMap = await this.loadHints(input);

        // check if any matches found
        this.hintsNum = Object.keys(hintMap).length;
        if (this.hintsNum === 0) return;

        this.focus = 0;

        // create a list with hints
        let container = document.createElement('div');
        container.classList.add('hints');
        this.tag.appendChild(container);

        // add matched hints to the list
        input = input.toLowerCase();

        let i = 0;
        for (const hint in hintMap) {
            let hintTag = document.createElement('p');
            let matchIdx = hint.toLowerCase().indexOf(input);
            
            if (matchIdx !== -1) {
                let left = hint.substring(0, matchIdx);
                let middle = hint.substring(matchIdx, input.length + matchIdx);
                let right = hint.substring(input.length + matchIdx, hint.length);
                hintTag.innerHTML = `${left}<b>${middle}</b>${right}`;
            } else {
                hintTag.innerText = hint;
            }

            if (i === 0) hintTag.classList.add('hints-active');

            hintTag.onclick = () => this.onSearch(hint, hintMap[hint]);
            container.appendChild(hintTag);

            i++;
        }
    }

    _resetHints() {
        let hintsTag = this.tag.querySelector('.hints');

        if (hintsTag !== null)
            hintsTag.remove();

        this.focus = -1;
    }
}