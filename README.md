# Follow Insider

US insider trading tracker, built on 20+ years of SEC filings.

> **Status:** the hosted version is currently offline. You can still run it locally, see [Running locally](#running-locally).

## Why insider trading?

When executives, directors, and major shareholders (insiders) buy or sell shares of their own company, they must report the trade to the SEC on Form 4. Insiders often know more about their company than outside investors, so their trades can be a useful signal.

Follow Insider collects these filings, turns them into structured trades, and makes them searchable.

## Highlights

- **Full history:** collected 20+ years of SEC filings through 3.5M+ API requests and identified 2.5M+ purchases and sales
- **Reliable data:** designed so that no transaction is missed or misread
- **Always up to date:** checks EDGAR for new Form 4 filings every 5 minutes, with a daily catch-up run
- **Searchable:** browse trades by company name, ticker, or CIK, with filters and pagination

## How it works

1. **Loading:** the backend fetches Form 4 filing references from SEC EDGAR (latest feed, daily indexes, and full fiscal quarters for backfills) using the [SEC API](https://github.com/alexkouzel/sec-api) library.
2. **Parsing and storage:** each filing is parsed into companies, insiders, and trades, and saved to PostgreSQL in batches.
3. **REST API:** Spring Boot serves public endpoints for trades, insiders, companies, forms, and fiscal quarters, with caching for frequent queries. Admin endpoints for loading data and reading logs are protected with HTTP Basic auth.
4. **Web app:** a static HTML, CSS, and JavaScript client, hosted on Firebase Hosting.

## Tech stack

| Area           | Technologies                                               |
| -------------- | ---------------------------------------------------------- |
| Backend        | Java 17, Spring Boot 3, Spring Data JPA, Spring Security   |
| Database       | PostgreSQL (H2 for tests)                                  |
| Infrastructure | AWS Elastic Beanstalk, Amazon S3, AWS CDK                  |
| Frontend       | HTML, CSS, JavaScript, Firebase Hosting                    |

## Project structure

| Directory  | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `core/`    | Spring Boot backend: data loading, parsing, and the REST API  |
| `client/`  | Web app                                                       |
| `aws-cdk/` | Infrastructure as code for AWS Elastic Beanstalk              |
| `scripts/` | Scripts to run and deploy the backend                         |

## Running locally

**Prerequisites:** Java 17, a PostgreSQL database, and a GitHub token with `read:packages` access (the SEC API dependency is downloaded from GitHub Packages).

1. Copy the environment template and fill in the values. For local development you need `EDGAR_USER_AGENT`, `GPR_USERNAME`, `GPR_TOKEN`, the `DEV_DB_*` variables, and `DEV_ADMIN_USERNAME` / `DEV_ADMIN_PASSWORD`.
   ```bash
   cp .env-template.sh .env.sh
   ```
   `EDGAR_USER_AGENT` must follow the SEC format, for example `Sample Company Name admin@example.com`.

2. Start the backend with the `dev` profile. It runs on `http://localhost:5000`.
   ```bash
   sh scripts/run.sh dev
   ```

3. Load some data. Automatic loading is off in `dev`, so trigger it through the admin API, for example the latest filings:
   ```bash
   curl -X POST -u <admin-username>:<admin-password> http://localhost:5000/formloader/latest
   ```
   Other loading options: `/formloader/last/days/{days}`, `/formloader/company/{cik}`, `/formloader/year/{year}/quarter/{quarter}`, and `/formloader/from/{from}/to/{to}`.

4. Start the web app. Set `serverUrl` in `client/public/scripts/config.js` to `http://localhost:5000`, then serve the client with the Firebase CLI:
   ```bash
   cd client
   npx firebase-tools serve
   ```

## Deployment

The backend runs on AWS Elastic Beanstalk. Set up the infrastructure once with AWS CDK (see [aws-cdk/README.md](aws-cdk/README.md)), then deploy a new version:

```bash
sh scripts/deploy.sh <version>
```

The web app is deployed to Firebase Hosting with `firebase deploy` from the `client/` directory.
