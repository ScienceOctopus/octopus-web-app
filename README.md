# Octopus

[![Build status][circle-img]][circle-url]
[![beta.science-octopus.org][app-img]][app-url]

[circle-img]: https://img.shields.io/circleci/project/github/ScienceOctopus/octopus-web-app/master.svg
[circle-url]: https://circleci.com/gh/ScienceOctopus/octopus-web-app/tree/master

[app-img]: https://img.shields.io/website-up-down-green-red/https/beta.science-octopus.org.svg?label=beta.science-octopus.org
[app-url]: https://beta.science-octopus.org

## What is Octopus?

Octopus is the new way to publish your scientific ideas, findings and research.
Designed to replace journals and papers, Octopus is free to use and gets your
work out there much more quickly, to a wider audience and ensures you get
maximum credit for the work you do, whether that’s coming up with hypotheses,
designing protocols, collecting data, doing analyses or writing reviews.

These principles underlie the design of Octopus: a new way to share scientific
work that recognises and rewards good practice, and serves the needs of
both scientists and science itself.


## Demo

The current working version of Octopus is available online
at [beta.science-octopus.org](https://beta.science-octopus.org/) and runs code from master branch
in this repository.

For more information about the project, please see
the [official website](https://octopus-hypothesis.netlify.com/).


## Publication workflow

In Octopus you publish work in smaller units than a "paper".

You can write and share one of 8 kinds of publication (though we are building
the infrastructure to support custom types for different fields and research types):

- **Problem** – a neatly defined scientific problem
- **Hypothesis** – an original hypothesis relating to an existing published Problem
- **Method/Protocol** – a practical method of testing an existing published Hypothesis
- **Data/Results** – raw data or summarised results collected according to an existing published Method (can be linked to a data repository)
- **Analysis** – a statistical or thematic analysis of existing published Data or Results
- **Interpretation** – a discussion around an existing published Analysis
- **Translation/Application** – ‘real world’ applications arising from an existing published Interpretation
- **Review** – a considered, detailed review of any of the above kinds of publication

Every publication in Octopus must be linked to another existing publication
in order to form ordered chains.

Only Problems and Reviews can be linked to any of the first publication
types – others must be linked only to a type directly above them in the "chain".

Anyone can read anything on Octopus.
Those logged in with an ORCID can write and rate publications.

Every publication you write (including reviews) can be rated by others, and these
will add to your individual page which is available for all individuals,
institutions and funding bodies to see. Publishing quickly and well,
and good collaborative reviewing is therefore rewarded.


## Getting Started

Octopus comprises a Node.js backend and a React frontend.

**Install dependencies**

To get started, you need to install the dependencies using npm:

```
npm ci
```

**Start the app locally**

Once they have been installed you can start both the backend
and the frontend in development mode with this command:

```
npm run dev
```

It's equivalent to running `npm run ui:dev` and `npm run api:dev`.

**Start API**

To run the backend API server on port 3001, simply:

```
npm run api
```

**Compile and start UI**

And to compile the frontend app in release mode:

```
npm run ui:build
```

Then you can start the frontend app server on port 3000 with:

```
npm run ui
```

**Run migrations**

To run migrations you'll need to pass a full PostgreSQL database URL:

```
DATABASE_URL=postgres://username:password@localhost:5432/octopus-web-db npm run migrate up
```


## Contribution Guidelines

Contributions to this codebase are welcomed. Please send your code as a pull request.

Also, please ensure that all JS code is formatted using prettier.


## Copyright and Trademarks

Octopus is freely licensed under the MIT license, a copy of which can be found
in the [LICENSE file](https://github.com/octopus-hypothesis/octopus-web-app/blob/master/LICENSE),
along with a list of copyright holders.

However, Octopus remains a trademark and any use must not be infringing.
