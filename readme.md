# Socto

[![Build Status](https://travis-ci.org/Winwardo/solid-octo-disco.svg?branch=master)](https://travis-ci.org/Winwardo/solid-octo-disco)
[![Circle CI](https://circleci.com/gh/Winwardo/solid-octo-disco.svg?style=svg)](https://circleci.com/gh/Winwardo/solid-octo-disco)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/d544db1297e04420b13c514662c305af)](https://www.codacy.com/app/winwardo/solid-octo-disco)

Created by team `solid-octo-disco 👌` (Topher Winward & Vasily Shelkov)

## I want to just run this.
If you are reading this as a marker, you should have access to a pre-built copy of Socto.
Two steps are required to running Socto:
+ Ensure OrientDB is running. Do this by running `START_DATABASE_WINDOWS.bat`.
  + If you receive the error `The ORIENTDB_HOME environment variable is not defined correctly`, please manually go to `./lib/orientdb/bin/` and double click `server.bat` - do not run it from a command prompt.
+ Start the Node server: run `npm start` from a command prompt within the `solid-octo-disco` folder.
+ Socto should now be accessible at http://localhost:3000.

## I want to build from scratch, then run.
If you have a pure clone of the git repo and want to run, please run the following commands:
+ `npm install --production`
+ `npm install gulp -g`
+ `npm install webpack -g`
+ `npm run build`
+ Follow the instructions above to start OrientDB and the server.

## I want to develop.
Whether you have a pure clone, or a marker version of Socto, use these commands:
+ `npm install`
+ `npm install gulp -g`
+ `npm install webpack -g`
+ Start the OrientDB server
+ `npm run dev`
+ The server will now be available at http://localhost:3000, complete with hot-reloading of server and client files. All development tools are available, including redux-devtools.

# Extra information

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

## Tools available
+ `make clean`: Removes all `build` and `node_module` files.
+ `npm install`: Install all of Socto's dependencies.
+ `npm run dev`: Runs nodeman's file watcher on the server side code so the developer doesn't have to restart server with every change.
+ `npm run build`: Builds the server as a production ready deploy.
+ `npm start`: Runs the built server.
+ `npm run lint`: Autoformats all code in src and test to the AirBnB code style. This must be run before any commit.
+ `npm test`: Runs all tests.
+ `npm run doc`: Generates this documentation.
