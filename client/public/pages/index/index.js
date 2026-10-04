import { initCompanySearch } from '/scripts/modules/company_search.js';

document.addEventListener('DOMContentLoaded', () => {

    // company search
    let searchTag = document.querySelector('.search');

    initCompanySearch(searchTag, (name, cik) => {
        window.location.assign(`/trades?companyName=${encodeURIComponent(name)}&companyCik=${cik}`);
    });

});