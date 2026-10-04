export class Insider {
    constructor({ cik, name }) {
        this.cik = cik;
        this.name = name;
    }
}

export class Company {
    constructor({ cik, name, ticker, exchange }) {
        this.cik = cik;
        this.name = name;
        this.ticker = ticker;
        this.exchange = exchange;
    }
}

export class Form {
    constructor({ accNo, company, insider, insiderTitles, filedAt, xmlUrl, trades }) {
        this.accNo = accNo;
        this.company = new Company(company);
        this.insider = new Insider(insider);
        this.insiderTitles = insiderTitles;
        this.filedAt = filedAt;
        this.xmlUrl = xmlUrl;

        if (trades) {
            this.trades = trades.map(trade => new Trade(trade));
        }
    }
}

export class Trade {
    constructor({ securityTitle, shareCount, sharePrice, sharesLeft, valueLeft, executedAt, type, form }) {
        this.securityTitle = securityTitle;
        this.shareCount = shareCount;
        this.sharePrice = sharePrice;
        this.sharesLeft = sharesLeft;
        this.valueLeft = valueLeft;
        this.executedAt = executedAt;
        this.type = type;

        if (form) {
            this.form = new Form(form);
        }
    }
}