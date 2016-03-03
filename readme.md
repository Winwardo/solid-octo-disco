# solid-octo-disco

[![Build Status](https://travis-ci.org/Winwardo/solid-octo-disco.svg?branch=master)](https://travis-ci.org/Winwardo/solid-octo-disco)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/d544db1297e04420b13c514662c305af)](https://www.codacy.com/app/winwardo/solid-octo-disco)
[![Codacy Badge](https://api.codacy.com/project/badge/coverage/d544db1297e04420b13c514662c305af)](https://www.codacy.com/app/winwardo/solid-octo-disco)

Team repo.

#### Tools
* `make clean`: Removes all build and node_module files.
* `npm install`: Install all the project's dependencies.

* `npm run dev`: Run's nodeman's file watcher on the server side code so don't have to restart server with every change.
* `npm start`: Run's the built server.

* `npm run lint`: Autoformats all code in src and test to the AirBnB code style.

* `npm test`: Generates a `coverage.html` showing test line coverage for travis to send code coverage to codacity.
* `npm run test-quick`: Quick runner for local testing.

### Getting Started
run:
```
git clone https://github.com/Winwardo/solid-octo-disco.git
cd solid-octo-disco
make clean
npm install or make bootstrap
```

Then for development run `npm run dev` and testing `npm run test-quick`.

### Pushing a change
Then run `npm run lint` first for autoformatting.