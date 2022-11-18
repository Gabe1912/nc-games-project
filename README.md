# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

---

## Link to Hosted Version of the Project

https://gabes-nc-games-project.cyclic.app/

---

## Prep Instructions

I will now explain how to:

- Clone this repo to your own machine
- Install the required dependencies
- Seed the local databases
- And run tests (full testing suit is included)

### Cloning The Repo

In your console, first navigate to the directory you wish to clone this repo to.

Then copy and paste the following command:

```
git clone https://github.com/Gabe1912/nc-games-project.git
```

### Installing Dependencies

There a handfull of dependencies and dev dependencies that this repo relies on:

#### Dev Dependencies

- husky
- jest
- jest-extended

#### Dependencies

- dotenv
- express
- jest-sorted
- pg
- pg-format
- supertest

You can install of these dependencies by copying and pasting this command into your command line while in the repo's root directory:

```
npm i
```

### Seeding the Local Database

Your next step is to setup and seed the database for this repo. Luckily for you, this repo includes some scripts built in to make life easier for you.

First you need to set up your database by running this command:

```
npm run setup-dbs
```

Then you need to run this next command to seed the database:

```
npm run seed
```

### Run Tests

Another script that is included in this repo allows you to easily run the testing suits.

#### To run both testing suites run this command in your terminal:

```
npm t
```

---

## Set Up .env Files

Because .env.\* is included in the .gitignore of this repo, you will need to create .env files.

Please create these two files in your root directory:

- .env.development
- .env.test

Each should contain this single line (see the .env.example file):

PGDATABASE=database_name_here

Remember to replace database_name_here with the appropriate names for the databases (can be found in the /db/setup.sql file if you are struggling)

---

## Minimum versions

To be safe, I recommend using:

- Node version 19.0.0
- Postgres version 12.12

You can check which versions you are using by running the following commands in your console:

```
node -v
```

```
psql --version
```

---

## I Hope You Have Enjoyed This Repo :)

### Please visit my website and tell me its great, I like validation ;D

#### By Gabe1912
