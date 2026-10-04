import { SearchBar } from '/scripts/visuals/search.js';
import { Companies } from '/scripts/client/endpoints.js';

export function initCompanySearch(tag, onSearch) {
    let loadHints = async (text) => {
        let companies = await Companies.search(text, 5);

        const hints = companies.reduce((acc, company) => {
            let value = `${company.name} (${company.ticker})`;
            acc[value] = company.cik;
            return acc;
        }, {});

        return hints;
    };
    return new SearchBar(tag, loadHints, onSearch);
}