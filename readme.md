# Socto

[![Build Status](https://travis-ci.org/Winwardo/solid-octo-disco.svg?branch=master)](https://travis-ci.org/Winwardo/solid-octo-disco)
[![Circle CI](https://circleci.com/gh/Winwardo/solid-octo-disco.svg?style=svg)](https://circleci.com/gh/Winwardo/solid-octo-disco)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/d544db1297e04420b13c514662c305af)](https://www.codacy.com/app/winwardo/solid-octo-disco)

Created by team `solid-octo-disco 👌` (Topher Winward & Vasily Shelkov)

## I want to just run this.
If you are reading this as a marker, you should have access to a pre-built copy of Socto.
Two steps are required to running Socto:
+ Ensure OrientDB is running. Do this by running `START_DATABASE_WINDOWS.bat`.
  + If you receive the error `"The ORIENTDB_HOME environment variable is not defined correctly"`, please manually go to `./lib/orientdb/bin/` and double click `server.bat` - do not run it from a command prompt.
+ Start the Node server: run `npm start` from a command prompt within the `solid-octo-disco` folder.
+ Socto should now be accessible at http://localhost:3000.
+ If either the `./build` or `./node_modules` folder is missing, please follow the next instructions for building.

## I want to build from scratch, then run.
If you have a pure clone of the git repo and want to run, please run the following commands:
+ `npm install`
+ `npm run build`
+ Follow the instructions above to start OrientDB and the server.

## I want to develop.
Whether you have a pure clone, or a marker version of Socto, use these commands:
+ `npm install`
+ Start the OrientDB server
+ `npm run dev`
+ The server will now be available at http://localhost:3000, complete with hot-reloading of server and client files. All development tools are available, including redux-devtools.

# Extra information

## Where is `queryInterface.html`?
As we are using React, it it does not make any sense to have a `queryInterface.html` file. Instead, Express serves `./public/index.html` to the client. On this page, `bundle.js` is included, which contains the relevant React code to start displaying our interface. Look at `./src/client/index.js` to see where the React & Redux code begins and is kicked off. This displays the React component found in `./src/client/queryInterface.js`, and from here it's a lot simpler to find the children components used.

## How does the database schema work?
As we are using [OrientDB](orientdb.com), it is not possible for us to provide a `mysqldump` of our schema. However, our OrientDB schema is generated on startup, using data found in `./src/shared/data/databaseSchema.js`. This is commented and hopefully clear in itself.

This file is used both to set up the appropriate classes and indexes in OrientDB, but also for creating object builders, found in `databaseObjects.js`. This ensures that when we use classes like `Tweet`, `Tweeter` and `Country` in our code, it matches exactly the object schema found in OrientDB. This way a data mismatch between our server and the database becomes impossible.

## This doesn't look like Javascript, what's going on?
Socto makes extensive use of both ES6 and React. All the `.js` files you see compile down to pure Javascript. A simple example is as follows:
```
const foo = (bar) => bar * 2;
```
compiles into
```
var foo = function foo(bar) {
  return bar * 2;
};
```
Similarly, any file that looks like it's merging Javascript and HTML are actually JSX React files.
```
<Hello name="World" />
```
compiles into
```
React.createElement(Hello, {name: "World"})
```
It's strange to look at at first, but quickly becomes very natural and allows for some incredibly powerful expressions.

## What are those four green rectangles at the top of this page?
Those are status badges - the first two are confirmation from Travis CI and Circle CI that our code can be built independently across several versions of Node.js, including `0.12.4`, the exact version used in Lewin Lab. Click them to see the build history.

The third is a Codacy badge. When we commit to our GitHub repo, Codacy takes a copy of the code, and runs several different static analysers on it, to find any issues. This is a third layer of code quality checks, above ESLint and JSCS. It then clearly displays any errors. If at any time the codebase had too many errors, Codacy will deny any further pull requests from being merged until the quality increases. This is a strict but very effective way of ensuring Socto always has the highest quality code possible.

## Tools available
+ `make clean`: Removes all `build` and `node_module` files.
+ `npm install`: Install all of Socto's dependencies.
+ `npm run dev`: Runs nodeman's file watcher on the server side code so the developer doesn't have to restart server with every change.
+ `npm run build`: Builds the server as a production ready deploy.
+ `npm start`: Runs the built server.
+ `npm run lint`: Autoformats all code in src and test to the AirBnB code style. This must be run before any commit.
+ `npm test`: Runs all tests.
+ `npm run doc`: Generates this documentation.