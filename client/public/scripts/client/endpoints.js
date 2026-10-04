import { Config } from '/scripts/config.js';
import { Insider, Company, Form, Trade } from './models.js';
import { Mocker } from './mocker.js';
import * as http from '/scripts/utils/http.js';

const SERVER_URL = Config.serverUrl;

const CONVERT_COMPANY = json => new Company(json);
const CONVERT_INSIDER = json => new Insider(json);
const CONVERT_TRADE = json => new Trade(json);
const CONVERT_FORM = json => new Form(json);

export class Insiders {

    static async page(idx = 0, size = 10) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.insiders(size);
        }

        let url = `${SERVER_URL}/insiders`;
        let body = { pageIdx: idx, pageSize: size };

        return await http.getModels(url, CONVERT_INSIDER, body);
    }

    static async cik(cik) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.insider();
        }

        let url = `${SERVER_URL}/insiders/${cik}`;

        return await http.getModel(url, CONVERT_INSIDER);
    }

    static async forms(cik) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.forms(4, true);
        }

        let url = `${SERVER_URL}/insiders/${cik}/forms`;

        return await http.getModels(url, CONVERT_FORM);
    }

    static async search(text, limit) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.insiders(limit);
        }

        let url = `${SERVER_URL}/insiders/search`;
        let body = { text: text, limit: limit };

        return await http.getModels(url, CONVERT_INSIDER, body);
    }
}

export class Companies {
    static async page(idx = 0, size = 10) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.companies(size);
        }

        let url = `${SERVER_URL}/companies`;
        let body = { pageIdx: idx, pageSize: size };

        return await http.getModels(url, CONVERT_COMPANY, body);
    }

    static async cik(cik) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.company();
        }

        let url = `${SERVER_URL}/companies/${cik}`;

        return await http.getModel(url, CONVERT_COMPANY);
    }

    static async forms(cik) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.forms(4, true);
        }

        let url = `${SERVER_URL}/companies/${cik}/forms`;

        return await http.getModels(url, CONVERT_FORM);
    }

    static async search(text, limit) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.companies(limit);
        }

        let url = `${SERVER_URL}/companies/search`;
        let body = { text: text, limit: limit };

        return await http.getModels(url, CONVERT_COMPANY, body);
    }
}

export class Forms {
    static async page(idx = 0, size = 10) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.forms(size, true);
        }

        let url = `${SERVER_URL}/forms`;
        let body = { pageIdx: idx, pageSize: size };

        return await http.getModels(url, CONVERT_FORM, body);
    }

    static async count() {

        if (Config.debugMode) {
            await debugDelay();
            return 1000;
        }

        let url = `${SERVER_URL}/forms/count`;

        return await http.getData(url);
    }
}

export class Trades {
    static async page(idx = 0, size = 10, tradeFilters, count) {

        if (Config.debugMode) {
            await debugDelay();
            return Mocker.trades(size, true);
        }

        let url = `${SERVER_URL}/trades`;
        let body = { 
            getPageRequest: { pageIdx: idx, pageSize: size, count: count }, 
            tradeFilters: tradeFilters
        };

        return await http.getModels(url, CONVERT_TRADE, body);
    }

    static async count(tradeFilters) {

        if (Config.debugMode) {
            await debugDelay();
            return 1000;
        }

        let url = `${SERVER_URL}/trades/count`;

        return await http.getData(url, tradeFilters);
    }
}

function debugDelay() {
    return new Promise(resolve => setTimeout(resolve, Config.debugDelay));
}
