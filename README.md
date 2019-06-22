This is the current implementation of the Octopus science publishing platform, containing a frontend and backend written in JS as well as database migrations and website resources.

# About Octopus

Octopus is the new way to publish your scientific ideas, findings and research. Designed to replace journals and papers, Octopus is free to use and gets your work out there much more quickly, to a wider audience and ensures you get maximum credit for the work you do, whether that’s coming up with hypotheses, designing protocols, collecting data, doing analyses or writing reviews.

These principles underlie the design of Octopus: a new way to share scientific work that recognises and rewards good practice, and serves the needs of both scientists and science itself.

In Octopus, then, you publish work in smaller units than a ‘paper’. You can write and share one of 8 kinds of publication (though we are building the infrastructure to support custom types for different fields and research types):

- Problem – a neatly defined scientific problem
- Hypothesis – an original hypothesis relating to an existing published Problem
- Method/Protocol – a practical method of testing an existing published Hypothesis
- Data/Results – raw data or summarised results collected according to an existing published Method (can be linked to a data repository)
- Analysis – a statistical or thematic analysis of existing published Data or Results
- Interpretation – a discussion around an existing published Analysis
- Translation/Application – ‘real world’ applications arising from an existing published Interpretation
- Review – a considered, detailed review of any of the above kinds of publication

Every publication in Octopus must be linked to another existing publication in order to form ordered chains. Only Problems and Reviews can be linked to any of the first publication types – others must be linked only to a type directly above them in the ‘chain’:
Graph of the connections between publication stages

Anyone can read anything on Octopus. Those logged in with an ORCID can write and rate publications.

Every publication you write (including reviews) can be rated by others, and these will add to your individual page which is available for all individuals, institutions and funding bodies to see. Publishing quickly and well, and good collaborative reviewing is therefore rewarded.

For more information about the project, please see the [official website](https://octopus-hypothesis.netlify.com/).

# Hosted Octopus

The hosted (canonical) version of Octopus is available online at https://octopus-publishing.azurewebsites.net, and typically runs the latest commit to master in this repository.

# Getting Started

Octopus comprises a Node.js backend and a React frontend. To get started, you need to install the dependencies using npm:

    npm ci

Once they have been installed you can start both the backend and the frontend in development mode with this command:

    npm run dev

To run the backend (API) server, simply:

    npm run server

And to compile the frontend in release mode:

    npm run build

# Contribution Guidelines

Contributions to this codebase are welcomed. Please send your code as a pull request. Also, please ensure that all JS code is formatted using prettier with the style in the `package.json` file.

# Copyright and Trademarks

Octopus is freely licensed under the MIT license, a copy of which can be found in the [LICENSE file](https://github.com/tigerw/octopus/blob/master/LICENSE), along with a list of copyright holders.

However, Octopus remains a trademark and any use must not be infringing.
