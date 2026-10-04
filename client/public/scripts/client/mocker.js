import { Company, Insider, Form, Trade } from './models.js';

const FORM_XML_URL = 'https://www.sec.gov/Archives/edgar/data/718937/000091957423006577/xslF345X03/ownership.xml';

const COMPANIES = [
    ['Apple Inc.', 'AAPL'],
    ['MICROSOFT CORP', 'MSFT'],
    ['NVIDIA CORP', 'NVDA'],
    ['ELECTRAMECCANICA VEHICLES CORP.', 'SOLO'],
    ['AMAZON COM INC', 'AMZN'],
    ['Meta Platforms, Inc.', 'META'],
    ['UNIVERSAL BIOSENSORS INC', 'UBI'],
    ['View, Inc.', 'VIEW'],
    ['ELI LILLY & Co', 'LLY'],
    ['Tesla, Inc.', 'TSLA']
]

const INSIDERS = [
    'Musk Elon',
    'Musk Kimbal',
    'Mizuno Hiromichi',
    'DENHOLM ROBYN M',
    'Wilson-Thompson Kathleen',
    'Taneja Vaibhav',
    'Baglino Andrew D',
    'Branderiz Eric',
    'MURDOCH JAMES R',
    'Buss Brad W'
]

const INSIDER_TITLES = [
    '10% Owner',
    'Director',
    'Officer',
    'Other'
]

const TRADE_SECURITY_TITLES = [
    'Common Stock',
    'Restricted Stock'
]

const TRADE_TYPES = [
    'Buy',
    'Sell'
]

export class Mocker {
    static companies(count) {
        return Array.from({ length: count }, (_, idx) => Mocker.company(idx));
    }

    static company(idx = 0) {
        return new Company({
            'cik': '0000000000',
            'name': COMPANIES[idx % COMPANIES.length][0],
            'ticker': COMPANIES[idx % COMPANIES.length][1],
            'exchange': null
        });
    }

    static insiders(count) {
        return Array.from({ length: count }, (_, idx) => Mocker.insider(idx));
    }

    static insider(idx = 0) {
        return new Insider({
            'cik': '0000000000',
            'name': INSIDERS[idx % INSIDERS.length]
        });
    }

    static insiderTitles() {
        let count = Math.floor(Math.random() * 2) + 1;

        let result = Array.from({ length: count }, () => random(INSIDER_TITLES));
        result = [...new Set(result)];

        return result;
    }

    static forms(count, withTrades = false) {
        return Array.from({ length: count }, (_, idx) => Mocker.form(idx, withTrades));
    }

    static form(idx = 0, withTrades = false) {
        let form = new Form({
            'accNo': '0000000000-00-000000',
            'company': Mocker.company(idx),
            'insider': Mocker.insider(idx),
            'insiderTitles': Mocker.insiderTitles(),
            'filedAt': randomDate(),
            'xmlUrl': FORM_XML_URL
        });

        if (withTrades) {
            form.trades = Mocker.trades(Math.floor(Math.random() * 2 + 1));
        }
        return form;
    }

    static trades(count, withForm = false) {
        return Array.from({ length: count }, () => Mocker.trade(withForm));
    }

    static trade(withForm = false) {
        let trade = new Trade({
            'securityTitle': random(TRADE_SECURITY_TITLES),
            'sharePrice': Math.random() * 100,
            'shareCount': randomNumber(1_000),
            'sharesLeft': randomNumber(1_000_000),
            'valueLeft': null,
            'executedAt': randomDate(),
            'type': random(TRADE_TYPES)
        });

        if (withForm) {
            trade.form = Mocker.form();
        }
        return trade;
    }
}

function randomDate() {
    return randomNumber(1_000_000_000_000);
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function random(array) {
    return array[Math.floor(Math.random() * array.length)];
}