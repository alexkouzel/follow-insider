export function initDropdown(container, label, defaultKey, entries, onChange) {
    let tag = document.createElement('div');

    tag.className = 'dropdown';
    tag.innerHTML = `
        <p>${label}</p>
        <div style="height: 0.5rem"></div>
        <button class="dropbtn">${entries[defaultKey]}</button>
        <div class="dropdown-content"></div>
    `;

    container.appendChild(tag);

    if (entries.length === 0) return;

    let button = tag.querySelector('.dropbtn');
    let content = tag.querySelector('.dropdown-content');
    
    button.onclick = (event) => {
        event.stopPropagation();
        let computedStyle = window.getComputedStyle(content);
        let isNone = computedStyle.display === 'none';
        content.style.display = isNone ? 'block' : 'none'; 
    }

    window.addEventListener('click', (event) => {
        if (!tag.contains(event.target)) {
            content.style.display = 'none';
        }
    })

    Object.keys(entries).forEach((key) => {
        let value = entries[key];

        let item = document.createElement('p');
        item.innerText = value;
        item.onclick = (event) => {
            event.stopPropagation();
            button.innerText = value;
            content.style.display = 'none';
            onChange(value, key);
        };
        content.appendChild(item);
    });
}