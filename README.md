# My House of Games API

Solo project for the backend section of the Northcoders Software Development Bootcamp.

Hosted

A hosted version of this project can be found here. https://my-be-nc-games.herokuapp.com/

API

This API serves a number of endpoints to retrieve data from a PostgreSQL database. It's written in JavaScript, using Node.js and express for the backend alongside A testing suite which uses Jest.

Cloning

Fork and clone this repo, and then:

run npm install in order to install all of the required dependencies.

Create two .env files in the root directory:

.env.development Populate with 'PGDATABASE=<name_of_your_db>', 'PGUSER=<your_username>' and if needed add in 'PGPASSWORD=<your_password>'.

.env.test Populate with 'PGDATABASE=<name_of_your_db>\_test', 'PGUSER=<your_username>' and if needed add in 'PGPASSWORD=<your_password>'.

Run npm run setup-dbs to create two separate databases, one for development and one for testing.

Run npm run seed to seed the development database. The test database will seed automatically every time a test runs. This should work fine providing your .env files are setup correctly.

Tests can be run using npm test to run the entire test suite, or with npm test <path_to_file> which will run a single, specified testing file.

Versions
This project was developed using version 18.1.0 of Node, and version 8.7.3 of node-postgres
