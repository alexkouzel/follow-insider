export class Loader {
    constructor(container) {
        this.tag = this._build();
        container.appendChild(this.tag);
    }

    _build() {
        let loader = document.createElement('div');
        loader.classList.add('lds-facebook', 'abs-ctr');
        loader.innerHTML = '<div></div><div></div><div></div>';
        return loader;
    }

    isVisible() {
        return this.tag.style.display === 'block';
    }

    show() {
        this.tag.style.display = 'block';
    }

    hide() {
        this.tag.style.display = 'none';
    }

    remove() {
        this.tag.remove();
    }
}