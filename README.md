# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Set Up .env Files

Because .env.\* is included in the .gitignore of this repo, you will need to create .env files.

Please create these two files in your root directory:

- .env.development
- .env.test

Each should contain this single line (see the .env.example file):

PGDATABASE=database_name_here

Remember to replace database_name_here with the appropriate names for the databases (can be found in the /db/setup.sql file if you are struggling)
