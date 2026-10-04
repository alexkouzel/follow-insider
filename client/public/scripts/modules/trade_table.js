import { Table, Row, Cell } from '/scripts/visuals/table.js';
import { Trades } from '/scripts/client/endpoints.js';
import * as string from '/scripts/utils/string.js';

export function initTradeTable(container, filters) {
    let columns = ['Company', 'Insider', 'Relationship', 'Type', 'Price', 'Quantity', 'Owned', 'Δ Owned', 'Value', 'Trade Date', 'Filing Date'];
    let align = ['start', 'start', 'start', 'center', 'end', 'end', 'end', 'end', 'end', 'end', 'end']

    let pageSize = 10;

    let props = {
        align: align,
        loadPage: (idx, count) => _loadPage(idx, pageSize, filters, count),
        loadCount: () => _loadCount(filters),
        pageSize: pageSize,
    };

    let table = new Table(columns, props);
    container.appendChild(table.tag);

    return table;
}

async function _loadCount(filters) {
    return await Trades.count(filters);
}

async function _loadPage(idx, pageSize, filters, count) {
    let trades = await Trades.page(idx, pageSize, filters, count);
    return _tradesToRows(trades);
}

function _tradesToRows(trades) {
    return trades.map(trade => _tradeToRow(trade));
}

function _tradeToRow(trade) {
    let form = trade.form;

    return new Row([
        _companyCell(form),
        _insiderCell(form),
        _relationshipCell(form),
        _typeCell(trade),
        _priceCell(trade),
        _shareCountCell(trade),
        _sharesLeftCell(trade),
        _deltaOwnedCell(trade),
        _valueCell(trade),
        _executedAtCell(trade),
        _filedAtCell(form)
    ], {
        color: _rowColor(trade),
    });
}

function _rowColor(trade) {
    let value = trade.sharePrice * trade.shareCount;
    return trade.type === 'SELL' ? _red(value) : _green(value);
}

function _companyCell(form) {
    let company = `${form.company.name} (${form.company.ticker})`;
    return new Cell(company, {
        // onclick: () => window.open('/company/' + form.company.cik)
    });
}

function _insiderCell(form) {
    let insider = form.insider.name;
    return new Cell(insider);
}

function _relationshipCell(form) {
    let relationship = null;

    if (form.insiderTitles) {
        relationship = form.insiderTitles.join(', ');
    }

    return new Cell(relationship);
}

function _typeCell(trade) {
    let typeValue = trade.type === 'BUY' ? 'Buy' : 'Sell';
    let typeColor = trade.type === 'BUY' ? 'var(--green)' : 'var(--red)';
    return new Cell(typeValue, { color: typeColor });
}

function _priceCell(trade) {
    let price = string.formatMoney(trade.sharePrice, '$');

    return new Cell(price);
}

function _shareCountCell(trade) {
    let shareCount = null;

    if (trade.shareCount) {
        shareCount = trade.type === 'SELL' ? '-' : '+';
        shareCount += string.formatNumber(trade.shareCount);
    }

    return new Cell(shareCount);
}

function _sharesLeftCell(trade) {
    let sharesLeft = trade.sharesLeft;

    if (!sharesLeft && trade.valueLeft && trade.sharePrice) {
        sharesLeft = Math.round(trade.valueLeft / trade.sharePrice);
    }

    sharesLeft = string.formatNumber(sharesLeft);

    return new Cell(sharesLeft);
}

function _deltaOwnedCell(trade) {
    let value = trade.sharePrice * trade.shareCount;
    let valueLeft = trade.valueLeft ? trade.valueLeft : trade.sharePrice * trade.sharesLeft;
    let valueInitial = trade.type === 'SELL' ? valueLeft + value : valueLeft - value;

    let deltaValue = valueInitial > 0 ? value / valueInitial : 1;
        
    let delta = trade.type === 'SELL' ? '-' : '+';
    delta += string.formatPercent(deltaValue);

    return new Cell(delta);
}

function _valueCell(trade) {
    let value = null;

    if (trade.sharePrice && trade.shareCount) {
        value = trade.type === 'SELL' ? '-' : '+';
        value += string.formatMoney(trade.sharePrice * trade.shareCount, '$');
    }

    return new Cell(value);
}

function _executedAtCell(trade) {
    let executedAt = string.formatDate(trade.executedAt);

    return new Cell(executedAt);
}

function _filedAtCell(form) {
    let filedAt = string.formatDate(form.filedAt);

    return new Cell(filedAt, {
        onclick: () => window.open(form.xmlUrl),
    });
}

// ----------------------------------------
// color utilities

function _green(value) {
    return _color(value, false, true, false);
}

function _red(value) {
    return _color(value, true, false, false);
}

function _color(value, red, green, blue) {
    const minValue = 10;
    const maxValue = 3_000_000;

    // normalize the number to a value between 0 and 255
    value = (value - minValue) / (maxValue - minValue);
    value = Math.min(Math.max(value, 0.005), 1);
    value = Math.pow(value, 0.3);
    value *= 40;

    // adjust the intensity to make the color darker or brighter
    const intensity = Math.round(255 - value);

    // calculate each color component based on whether it's the primary color or not
    const redHex = red ? 'FF' : intensity.toString(16).padStart(2, '0');
    const greenHex = green ? 'FF' : intensity.toString(16).padStart(2, '0');
    const blueHex = blue ? 'FF' : intensity.toString(16).padStart(2, '0');

    // construct the hex color code
    return `#${redHex}${greenHex}${blueHex}`;
}
