/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _webpackConfig = __webpack_require__(2);

	var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

	var _tweetFinder = __webpack_require__(3);

	var _orientdb = __webpack_require__(4);

	var _twitterSearch = __webpack_require__(11);

	var _bodyParser = __webpack_require__(15);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _footballSearch = __webpack_require__(16);

	var _journalism = __webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();
	var port = process.env.PORT || 3000;

	// In development hotload React using webpack-hot-middleware
	if (process.env.NODE_ENV === 'development') {
	  var webpack = __webpack_require__(19);
	  var compiler = webpack(_webpackConfig2.default[1]);
	  app.use(__webpack_require__(20)(compiler, {
	    noInfo: true,
	    publicPath: _webpackConfig2.default[1].output.publicPath
	  }));

	  app.use(__webpack_require__(21)(compiler));
	}

	// parse application/x-www-form-urlencoded
	app.use(_bodyParser2.default.urlencoded({ extended: false }));

	// parse application/json
	app.use(_bodyParser2.default.json());

	//--------------------------------------------------------------------------

	app.use('/public', _express2.default.static('public'));

	app.get('/', function (req, res) {
	  res.sendFile('index.html', { root: 'public' });
	});

	app.get('/orient/generate', function (req, res) {
	  (0, _orientdb.generateDatabase)(res);
	});

	app.post('/search', function (req, res) {
	  (0, _tweetFinder.searchQuery)(req, res);
	});

	app.get('/tweet/:id', function (req, res) {
	  (0, _tweetFinder.getTweetFromDb)(res, req.params.id);
	});

	// not used in Socto web interface, example test if we could stream
	app.get('/twit/stream/:query', function (req, res) {
	  res.writeHead(200, { 'Content-Type': 'application/json' });
	  (0, _twitterSearch.stream)(req, res);
	});

	app.get('/football/seasons/:year', function (req, res) {
	  (0, _footballSearch.searchFootballSeasons)(res, req.params.year);
	});

	app.post('/football/seasons/:year/teams', function (req, res) {
	  (0, _footballSearch.searchFootballSeasonTeams)(res, req.params.year, req.body.leagues);
	});

	app.get('/football/teams/:teamid/players', function (req, res) {
	  (0, _footballSearch.searchFootballTeamPlayers)(res, req.params.teamid);
	});

	app.get('/journalism/teams/:teamname/:footballDataOrgTeamId', function (req, res) {
	  (0, _journalism.journalismTeam)(res, req.params.teamname, req.params.footballDataOrgTeamId);
	});

	app.get('/journalism/players/:playername', function (req, res) {
	  (0, _journalism.journalismPlayer)(res, req.params.playername);
	});

	// Used for development purposes to make sure we're hitting the correct twitter end point
	app.get('/exampleTwitterJson', function (req, res) {
	  res.writeHead(200, { 'Content-Type': 'application/json' });
	  _twitterSearch.TwitAccess.get('statuses/show/:id', { id: '718691141239975936' }) //718691141239975936, 717000298338750465, 693770454784425984, 718691141239975936
	  .then(function (tweets) {
	    return res.end(JSON.stringify(tweets.data.user));
	  });
	});

	app.get('*', function (req, res) {
	  res.status(404).sendFile('404.html', { root: 'public' });
	});

	// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
	app.listen(port, function (err) {
	  if (err) {
	    console.log(err);
	    return;
	  }

	  console.log('Server running at http://localhost:' + port);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	// module.exports = require("C:\\Users\\Topher\\Documents\\GitHub\\solid-octo-disco\\webpack.config.js");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getOriginalTweetUserFromTweet = exports.getTweetFromDb = exports.normaliseQueryTerm = exports.unionTweets = exports.buildTwitterQuery = exports.searchQuery = exports.MAX_TWEET_RESULTS = undefined;

	var _orientdb = __webpack_require__(4);

	var _databaseObjects = __webpack_require__(9);

	var _utilities = __webpack_require__(7);

	var _twitterSearch = __webpack_require__(11);

	var MAX_TWEET_RESULTS = exports.MAX_TWEET_RESULTS = 500;

	/**
	 * Searches our database for Tweets and returns them.
	 * If the returned results are not satisfactory (such
	 * as not enough relevant results, or they are too old,)
	 * then the Twitter API will be called directly.
	 * @param req A HTTP Request object
	 * @param res A HTTP Response object
	 * @returns {Promise.<T>|*}
	 */
	var searchQuery = exports.searchQuery = function searchQuery(req, res) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return potentiallySearchTwitter(req.body.searchTwitter, req.body.searchTerms);
	  }).then(function () {
	    return Promise.all(req.body.searchTerms.map(function (queryItem) {
	      return searchDatabase(queryItem);
	    }));
	  }).then(function (tweetResultsForAllQueries) {
	    return splatTogether(tweetResultsForAllQueries, 'OR');
	  }).then(function (splattedTweets) {
	    return getTweetsAsResults(splattedTweets);
	  }).then(function (tweetsAsResults) {
	    return resultsToPresentableOutput(tweetsAsResults);
	  }).then(function (presentableTweets) {
	    res.writeHead(200, { 'Content-Type': 'application/json' });
	    res.end(JSON.stringify(presentableTweets));
	  }, function (rejection) {
	    console.warn('Unable to search for query \'' + req.body.searchTerms + '\'', rejection);
	    res.writeHead(500, { 'Content-Type': 'application/json' });
	    res.end('An unexpected internal error occurred.');
	  });
	};

	/**
	 * May asynchronously search Twitter for new tweet results based on queries.
	 * @param {Object} body { searchTwitter: true, searchTerms: ... }
	 * @returns {Promise.<T>} Either resolves immediately or a promise for searching Twitter
	 */
	var potentiallySearchTwitter = function potentiallySearchTwitter(searchTwitter, searchTerms) {
	  if (searchTwitter) {
	    var twitterQueries = buildTwitterQuery(searchTerms);
	    return Promise.all(twitterQueries.map(function (twitterQuery) {
	      return (0, _twitterSearch.searchAndSaveFromTwitter)(twitterQuery);
	    }));
	  } else {
	    return Promise.resolve();
	  }
	};

	/**
	 * Given some search terms with param types, convert it to Twitter API
	 * friendly queries.
	 * @param searchTerms
	 * @returns {Array} Some Twitter API queries, like ["#arsenal OR @manchester"]
	 */
	var buildTwitterQuery = exports.buildTwitterQuery = function buildTwitterQuery(searchTerms) {
	  var maxTwitterQueryTerms = 10;
	  var joinKeyword = ' OR ';

	  var result = [];

	  var lastQuery = [];
	  searchTerms.forEach(function (searchTerm) {
	    var actualTerm = searchTerm.query;
	    var termWithNoSpaces = actualTerm.replace(/ /g, '');
	    var currentQueryAddition = [];
	    var alreadyHadAuthorOrMention = false;

	    searchTerm.paramTypes.filter(function (paramType) {
	      return paramType.selected;
	    }).forEach(function (paramType) {
	      switch (paramType.name) {
	        case 'keyword':
	          currentQueryAddition.push('"' + actualTerm + '"');
	          break;
	        case 'hashtag':
	          currentQueryAddition.push('#' + termWithNoSpaces);
	          break;
	        case 'author':
	        case 'mention':
	          if (!alreadyHadAuthorOrMention) {
	            alreadyHadAuthorOrMention = true;
	            currentQueryAddition.push('@' + termWithNoSpaces);
	          }
	          break;
	        default:
	          break;
	      }
	    });

	    if (lastQuery.length + currentQueryAddition.length <= maxTwitterQueryTerms) {
	      lastQuery = lastQuery.concat(currentQueryAddition);
	    } else {
	      result.push(lastQuery.join(joinKeyword));
	      lastQuery = currentQueryAddition;
	    }
	  });

	  if (lastQuery.length > 0) {
	    result.push(lastQuery.join(joinKeyword));
	  }

	  return result;
	};

	var splatTogether = function splatTogether(allTweetResults, type) {
	  if (type === 'OR') {
	    return unionTweets(allTweetResults);
	  } else {
	    throw 'Undefined splatting of type ' + type + ' occurred. Type should be \'AND\' or \'OR\'.';
	  }
	};

	/**
	 * Given a list of resultLists, union all the Tweets together.
	 * That is, given the following list of Tweet ids:
	 *  [[1,2], [2, 3], [1, 4, 5]]
	 * return
	 *  [1,2,3,4,5]
	 * @param {Array[]} allTweetResults - A list of Tweet result lists.
	 * @return {[tweetDatas]} A list of unique Tweets
	 */
	var unionTweets = exports.unionTweets = function unionTweets(allTweetResults) {
	  var dict = {};

	  // Create a dictionary of all Tweets, effectively cancelling out any duplicates
	  allTweetResults.forEach(function (tweetList) {
	    return tweetList.forEach(function (tweetData) {
	      return dict[tweetData.tweet.id] = tweetData;
	    });
	  });

	  var union = [];
	  for (var key in dict) {
	    union.push(dict[key]);
	  }

	  return union;
	};

	var resultsToPresentableOutput = function resultsToPresentableOutput(results) {
	  return {
	    data: {
	      count: results.length,
	      records: results
	    }
	  };
	};

	var searchDatabase = function searchDatabase(searchObject) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return Promise.all(searchObject.paramTypes.filter(function (paramType) {
	      return paramType.selected;
	    }).map(function (paramType) {
	      return searchByParamType(searchObject, paramType.name);
	    }));
	  }).then(function (searchResults) {
	    return searchResults.reduce(function (previous, current) {
	      return previous.concat(current);
	    }, []);
	  }).then(function (tweetRecords) {
	    return makeTweets(tweetRecords);
	  }).then(function (resolved) {
	    return resolved;
	  }, function (rejection) {
	    return console.warn('Major error querying the database.', rejection);
	  });
	};

	var searchByParamType = function searchByParamType(searchObject, paramType) {
	  switch (paramType) {
	    case 'keyword':
	      return searchByKeyword(searchObject.query);
	    case 'author':
	      return searchByAuthor(searchObject.query);
	    case 'mention':
	      return searchByMention(searchObject.query);
	    case 'hashtag':
	      return searchByHashtag(searchObject.query);
	  }

	  throw 'Invalid paramType for database Tweet searching: \'' + paramType + '\'. Should be [author, hashtag, keyword, mention].';
	};

	var searchByKeyword = function searchByKeyword(keyword) {
	  var tweetSelection = makeTweetQuerySelectingFrom('SELECT FROM tweet WHERE content LUCENE :query');
	  return _orientdb.db.query(tweetSelection, { params: { query: normaliseQueryTerm(keyword), limit: MAX_TWEET_RESULTS } });
	};

	var searchByAuthor = function searchByAuthor(author) {
	  var tweetSelection = makeTweetQuerySelectingFrom('TRAVERSE out(\'TWEETED\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)');
	  return _orientdb.db.query(tweetSelection, { params: { query: normaliseQueryTerm(author), limit: MAX_TWEET_RESULTS } });
	};

	var searchByMention = function searchByMention(mention) {
	  var tweetSelection = makeTweetQuerySelectingFrom('TRAVERSE in(\'MENTIONS\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)');
	  return _orientdb.db.query(tweetSelection, { params: { query: normaliseQueryTerm(mention), limit: MAX_TWEET_RESULTS } });
	};

	var searchByHashtag = function searchByHashtag(hashtag) {
	  var tweetSelection = makeTweetQuerySelectingFrom('TRAVERSE in(\'HAS_HASHTAG\') FROM (SELECT FROM hashtag WHERE content LUCENE :query)');
	  return _orientdb.db.query(tweetSelection, { params: { query: normaliseQueryTerm(hashtag), limit: MAX_TWEET_RESULTS } });
	};

	/**
	 * Make a query more search-friendly in our database.
	 * Multiple term queries will receive quotes to preserve order
	 * e.g. "Manchester United" won't return results for "united manchester"
	 * Long single term queries will receive ~ for fuzzy matching
	 * @param term Some phrase, like `manchester united`
	 * @returns {*} The normalised term.
	 */
	var normaliseQueryTerm = exports.normaliseQueryTerm = function normaliseQueryTerm(query) {
	  var terms = query.split(' ');

	  if (terms.length === 1) {
	    if (query.length > 4) {
	      return query + '~'; // fuzzy search
	    } else {
	        return query;
	      }
	  } else {
	    return '"' + query + '"'; // add quotes to preserve order
	  }
	};

	var makeTweetQuerySelectingFrom = function makeTweetQuerySelectingFrom(from) {
	  return 'SELECT ' + '  *' // All the tweet data
	   + ', in(\'TWEETED\').id AS authorId ' // Now the tweet info
	   + ', in(\'TWEETED\').name AS authorName ' + ', in(\'TWEETED\').handle AS authorHandle ' + ', in(\'TWEETED\').profile_image_url as authorProfileImage ' + ', in(\'TWEETED\').is_verified as isVerified ' + ', in(\'TWEETED\').is_user_mention as isUserMention ' + (' FROM (' + from + ') ') // Selected from a subset of tweets
	   + ' WHERE @class = \'Tweet\' ' // Don't accidentally select authors or hastags etc
	   + ' ORDER BY date DESC ' // Might be irrelevant
	   + ' UNWIND authorId, authorName, authorHandle, authorProfileImage, isUserMention, isVerified ' // Converts from ['Steve'] to 'Steve'
	   + ' LIMIT :limit ' // Don't select too many results
	  ;
	};

	var makeTweets = function makeTweets(tweetRecords) {
	  return tweetRecords.filter(function (tweetRecord) {
	    return tweetRecord.id && tweetRecord.authorId;
	  }).map(function (tweetRecord) {
	    return makeTweetAndAuthorFromDatabaseTweetRecord(tweetRecord);
	  });
	};

	var makeTweetAndAuthorFromDatabaseTweetRecord = function makeTweetAndAuthorFromDatabaseTweetRecord(tweetRecord) {
	  return {
	    tweet: (0, _utilities.flattenImmutableObject)(buildTweetFromDatabaseRecord(tweetRecord)),
	    author: (0, _utilities.flattenImmutableObject)(buildTweeterFromDatabaseTweetRecord(tweetRecord))
	  };
	};

	var buildTweeterFromDatabaseTweetRecord = function buildTweeterFromDatabaseTweetRecord(record) {
	  // will spit out which record couldn't be processed.
	  if (!(record.authorId && record.authorName && record.authorHandle && record.authorProfileImage)) {
	    console.log('this record is invalid and cannot be processed', record);
	  }
	  return (0, _databaseObjects.TweeterBuilder)().id(record.authorId).name(record.authorName).handle(record.authorHandle).profile_image_url(record.authorProfileImage).is_user_mention(record.isUserMention).is_verified(record.isVerified).build();
	};

	var buildTweetFromDatabaseRecord = function buildTweetFromDatabaseRecord(record) {
	  return (0, _databaseObjects.TweetBuilder)().id(record.id).content(record.content).date(record.date.toISOString()).likes(record.likes).retweets(record.retweets).longitude(record.longitude).latitude(record.latitude).contains_a_quoted_tweet(record.contains_a_quoted_tweet).image_url(record.image_url).build();
	};

	var getTweetsAsResults = function getTweetsAsResults(data) {
	  return data.map(function (tweet) {
	    return { data: tweet.tweet, author: tweet.author, source: 'twitter' };
	  });
	};

	var getTweetFromDb = exports.getTweetFromDb = function getTweetFromDb(res, id) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return _orientdb.db.query(makeTweetQuerySelectingFrom('SELECT FROM tweet WHERE id =:id'), { params: { id: id, limit: 1 } });
	  }).then(function (results) {
	    return makeTweetAndAuthorFromDatabaseTweetRecord(results[0]);
	  }).then(function (response) {
	    return res.status(200).end(JSON.stringify(response));
	  }, function (rej) {
	    return res.status(500).end(JSON.stringify({
	      message: 'Unable to get tweet from the database.',
	      reason: rej
	    }));
	  });
	};

	/**
	 * Used in ./twitterSearch.js:169.
	 * Tries to get the missing user tweeter for the original tweet from DB
	 * If not in DB then make a call to twitter to retrieve the whole tweet that contains the user tweeter
	 * @param String representing the original tweet's id
	 * @return Tweeter An Immutable Object representing the tweet's user
	 */
	var getOriginalTweetUserFromTweet = exports.getOriginalTweetUserFromTweet = function getOriginalTweetUserFromTweet(tweetId) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return _orientdb.db.query(makeTweetQuerySelectingFrom('SELECT FROM tweet WHERE id =:id'), { params: { id: tweetId, limit: 1 } });
	  }).then(function (tweetRecords) {
	    if (tweetRecords.length === 1) {
	      return buildTweeterFromDatabaseTweetRecord(tweetRecords[0]);
	    }

	    return _twitterSearch.TwitAccess.get('statuses/show/:id', { id: tweetId }).then(function (tweetResult) {
	      return (0, _twitterSearch.buildTweeterFromRaw)(tweetResult.data.user, false);
	    });
	  });
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db = exports.generateDatabase = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _orientjs = __webpack_require__(5);

	var _orientjs2 = _interopRequireDefault(_orientjs);

	var _databaseSchema = __webpack_require__(6);

	var _utilities = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Credentials should be stored in a hidden config file, or in environment variables.
	// As this is a student project, for simplicity, they will reside here.
	var SERVER = (0, _orientjs2.default)({
	  host: 'localhost',
	  port: 2424,
	  username: 'root',
	  password: 'admin'
	});
	var DATABASE_NAME = 'footballers1';

	/**
	 * Insert a new class into the database based on some properties.
	 * It will not override existing classes.
	 * @param db The OrientDb instance
	 * @param name The name of the new class, like 'Tweet'
	 * @param classSchema The schema of the class
	 */
	var insertClass = function insertClass(db, name, classSchema) {
	  var superclass = classSchema.superclass;
	  var properties = classSchema.properties;

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return db.class.create(name, superclass);
	  }).then(function (clazz) {
	    return createClassProperties(clazz, properties);
	  }).then(function () {
	    return(

	      // Add indexes
	      Promise.all(classSchema.indexes.map(function (index) {
	        var defaults = {
	          name: name + '.' + index.properties.join('_'),
	          class: name
	        };
	        var indexToInsert = _extends({}, defaults, index);

	        return db.index.create(indexToInsert);
	      }))
	    );
	  }).then(function () {
	    return console.log('Successfully generated class ' + name + '.');
	  }).catch(function (error) {
	    return console.warn('Error: Unable to generate class ' + name + ';', error.message);
	  });
	};

	/**
	 * Add the properties to the db class
	 * @param class The db OrientDb class
	 * @param properties The class paramater's properties
	 */
	var createClassProperties = function createClassProperties(clazz, properties) {
	  var transformedProperties = properties.map(function (input) {
	    return _extends({}, input, { mandatory: true });
	  });

	  // Add the properties to the class
	  return clazz.property.create(transformedProperties);
	};

	/**
	 * Update the database to have all the classes in a given schema.
	 * @param db The OrientDb instance
	 * @param schema See ./shared/data/databaseSchema.js for an example
	 */
	var insertClassesFromSchema = function insertClassesFromSchema(db, schema) {
	  return Promise.all(Object.keys(schema).map(function (name) {
	    var clazz = schema[name];
	    return insertClass(db, name, clazz);
	  }));
	};

	/**
	 * Ensure a database exists in a working format, creating a new one if it does not.
	 * After ensuring it exists, set up all classes on it.
	 * Not guaranteed to succeed, please check the console for results.
	 * @param res The HTTP response object.
	 */
	var generateDatabase = exports.generateDatabase = function generateDatabase(res) {
	  res.writeHead(200, { 'Content-Type': 'application/json' });

	  SERVER.list().then(function (dbs) {
	    var foundDb = null;

	    dbs.forEach(function (db) {
	      if (db.name === DATABASE_NAME) {
	        foundDb = db;
	      };
	    });

	    if (foundDb === null) {
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return SERVER.create(DATABASE_NAME);
	      }).then(function (db) {
	        return insertClassesFromSchema(db, _databaseSchema.schema);
	      }).then(function () {
	        res.end(JSON.stringify('Attempted to generate new database ' + DATABASE_NAME + ' with classes.'));
	      });
	    } else {
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return insertClassesFromSchema(foundDb, _databaseSchema.schema);
	      }).then(function () {
	        res.end(JSON.stringify('Found database ' + DATABASE_NAME + ', attempted to add missing classes.'));
	      });
	    }
	  });
	};

	var db = exports.db = SERVER.use(DATABASE_NAME);

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("orientjs");

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Boolean = 'Boolean';
	var Datetime = 'Datetime';
	var Double = 'Double';
	var Integer = 'Integer';
	var String = 'String';

	var Edge = 'E';
	var Vertex = 'V';

	var None = [];

	var LUCENE = 'FULLTEXT ENGINE LUCENE';
	var UNIQUE = 'UNIQUE';

	var EmptyEdge = {
	  superclass: Edge,
	  properties: [{ name: 'in', type: 'LINK' }, { name: 'out', type: 'LINK' }],
	  indexes: [{ properties: ['in', 'out'], type: UNIQUE }]
	};

	var schema = exports.schema = {
	  Tweet: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: String }, { name: 'content', type: String }, { name: 'date', type: Datetime }, { name: 'likes', type: Integer }, { name: 'retweets', type: Integer }, { name: 'longitude', type: Double }, { name: 'latitude', type: Double }, { name: 'contains_a_quoted_tweet', type: String }, { name: 'image_url', type: String }],
	    indexes: [{ properties: ['id'], type: UNIQUE }, { properties: ['content'], type: LUCENE }]
	  },
	  Tweeter: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: String }, { name: 'name', type: String }, { name: 'handle', type: String }, { name: 'profile_image_url', type: String }, { name: 'is_user_mention', type: Boolean }, { name: 'is_verified', type: Boolean }],
	    indexes: [{ properties: ['id'], type: UNIQUE }, { properties: ['name'], type: LUCENE }, { properties: ['handle'], type: LUCENE }]
	  },
	  Hashtag: {
	    superclass: Vertex,
	    properties: [{ name: 'content', type: String }],
	    indexes: [{ properties: ['content'], type: LUCENE }]
	  },
	  Place: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: String }, { name: 'name', type: String }, { name: 'full_name', type: String }, { name: 'type', type: String }],
	    indexes: [{ properties: ['id'], type: UNIQUE }, { properties: ['full_name'], type: LUCENE }]
	  },
	  Country: {
	    superclass: Vertex,
	    properties: [{ name: 'code', type: String }, { name: 'name', type: String }],
	    indexes: [{ properties: ['code'], type: UNIQUE }, { properties: ['name'], type: LUCENE }]
	  },
	  League: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: Integer }, { name: 'year', type: String }, { name: 'caption', type: String }, { name: 'league', type: String }],
	    indexes: [{ properties: ['id'], type: UNIQUE }]
	  },
	  Team: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: Integer }, { name: 'name', type: String }, { name: 'shortName', type: String }, { name: 'crestUrl', type: String }],
	    indexes: [{ properties: ['id'], type: UNIQUE }]
	  },
	  Player: {
	    superclass: Vertex,
	    properties: [{ name: 'id', type: Integer }, { name: 'name', type: String }, { name: 'nationality', type: String }],
	    indexes: [{ properties: ['id'], type: UNIQUE }]
	  },
	  TWEETED: EmptyEdge,
	  RETWEETED: EmptyEdge,
	  QUOTED: EmptyEdge,
	  FOLLOWS: EmptyEdge,
	  MENTIONS: EmptyEdge,
	  HAS_HASHTAG: EmptyEdge,
	  HAS_PLACE: EmptyEdge,
	  IN_COUNTRY: EmptyEdge
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tryPropertyOrNA = exports.tryPropertyOrElse = exports.getSemanticCountryFlagName = exports.range = exports.throttleFunction = exports.toggleParamType = exports.createTwitterParamTypes = exports.fetchPost = exports.makePostHeader = exports.makeGetHeader = exports.newPromiseChain = exports.toggleArrayElement = exports.flattenImmutableObject = exports.flattenObjectToArray = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _isomorphicFetch = __webpack_require__(8);

	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * Converts an object of style {'a': {'b': c}, 'd': {'e': f}} to [{'b': c}, {'e': f}]
	 * @param {Object} givenObject Any object.
	 * @returns {Array}
	 */
	var flattenObjectToArray = exports.flattenObjectToArray = function flattenObjectToArray(givenObject) {
	  var result = [];
	  for (var key in givenObject) {
	    if (givenObject.hasOwnProperty(key)) {
	      result.push(givenObject[key]);
	    }
	  }

	  return result;
	};

	/**
	 * Converts an immutable object (one with purely getter methods) to a plain key/value
	 * object, by calling the functions and storing the result.
	 * @param givenObject Similar to {'name': () => { return 'John'; }}
	 * @returns {{}} Similar to {'name': 'John'}
	 */
	var flattenImmutableObject = exports.flattenImmutableObject = function flattenImmutableObject(givenObject) {
	  if ((typeof givenObject === 'undefined' ? 'undefined' : _typeof(givenObject)) !== 'object') {
	    return givenObject;
	  }

	  var result = {};
	  for (var key in givenObject) {
	    if (givenObject.hasOwnProperty(key)) {
	      var field = givenObject[key];

	      if (typeof field === 'function') {
	        result[key] = flattenImmutableObject(field());
	      } else {
	        result[key] = field;
	      }
	    }
	  }

	  return result;
	};

	/**
	 * Checks if the element is in the array, if it is, then return a new array
	 * with it removed else add it to the new array
	 * @param any primitive type that can be .indexOf(ed) from an array
	 * @return new [Array]
	 */
	var toggleArrayElement = exports.toggleArrayElement = function toggleArrayElement(array, element) {
	  var termIndex = array.indexOf(element);
	  if (termIndex > -1) {
	    return [].concat(_toConsumableArray(array.slice(0, termIndex)), _toConsumableArray(array.slice(termIndex + 1)));
	  }

	  return [].concat(_toConsumableArray(array), [element]);
	};

	/**
	 * Starts a new Promise chain, resolving immediately.
	 * @param callback Must return a Promise.
	 * @returns {Promise}
	 */
	var newPromiseChain = exports.newPromiseChain = function newPromiseChain() {
	  return new Promise(function (resolve) {
	    resolve();
	  });
	};

	/**
	 * Generates the boilerplate headers for a JSON GET request
	 * @returns {{method: string, headers: {Accept: string, Content-Type: string}}}
	 */
	var makeGetHeader = exports.makeGetHeader = function makeGetHeader() {
	  return {
	    method: 'GET',
	    headers: {
	      Accept: 'application/json',
	      'Content-Type': 'application/json'
	    }
	  };
	};

	/**
	 * Generates the boilerplate headers for a JSON POST request
	 * @param body The body of the request, e.g. {'query': 'liverpool'}
	 * @returns {{method: string, headers: {Accept: string, Content-Type: string}, body: *}}
	 */
	var makePostHeader = exports.makePostHeader = function makePostHeader(body) {
	  if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
	    body = JSON.stringify(body);
	  }

	  return {
	    method: 'POST',
	    headers: {
	      Accept: 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: body
	  };
	};

	/**
	 * Creates a JSON POST fetch promise with a given url and body
	 * @param url Where to POST, e.g. '/search'
	 * @param body The body of the request, e.g. {'query': 'liverpool'}
	 */
	var fetchPost = exports.fetchPost = function fetchPost(url, body) {
	  return (0, _isomorphicFetch2.default)(url, makePostHeader(body));
	};

	/**
	 * Creates the paramTypes for a Twitter specific search term.
	 * @param array of strings representing search paramaterTypes
	 * @returns [{Object}] representing search terms with meta data
	 */
	var createTwitterParamTypes = exports.createTwitterParamTypes = function createTwitterParamTypes(selectedParamTypes) {
	  return ['author', 'hashtag', 'keyword', 'mention'].map(function (paramType) {
	    return makeParamType(selectedParamTypes, paramType);
	  });
	};

	var makeParamType = function makeParamType(selectedParamTypes, type) {
	  return {
	    name: type,
	    selected: selectedParamTypes.indexOf(type) > -1,
	    icon: getParamTypeIcon(type)
	  };
	};

	/**
	 * Returns a copy of the paramTypes with the name of the passed
	 * in paramType toggled
	 * @param paramTypes array
	 * @param paramTypeToggleName which is the paramType you want to toggle
	 * @returns copy of paramtypes with the paramTypeToggleName paramType toggled
	 */
	var toggleParamType = exports.toggleParamType = function toggleParamType(paramTypes, paramTypeToggleName) {
	  return paramTypes.map(function (paramType) {
	    if (paramType.name !== paramTypeToggleName) {
	      return paramType;
	    }

	    return _extends({}, paramType, {
	      selected: !paramType.selected
	    });
	  });
	};

	/**
	 * Returns a decorated callback function, which will be called some time later.
	 * However, if the returned function is called again before the callback
	 * is activated, the timer will be reset.
	 * This might be useful say when delaying running a search until 200ms after
	 * the user has stopped typing.
	 * @param callback
	 * @param milliseconds
	 * @returns {Function}
	 */
	var throttleFunction = exports.throttleFunction = function throttleFunction(callback, milliseconds) {
	  var timeout = void 0;

	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    if (timeout) {
	      clearTimeout(timeout);
	    }

	    timeout = setTimeout(function () {
	      return callback.apply(undefined, args);
	    }, milliseconds);
	  };
	};

	/**
	 * Creates an array filled with numbers between the range [min, max)
	 * @param min The start number, inclusive.
	 * @param max The end number, exclusive
	 * @param step Step between each number, must be positive.
	 * @returns {Array}
	 */
	var range = exports.range = function range(min, max) {
	  var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

	  if (step <= 0) {
	    return [];
	  }

	  var result = [];
	  for (var i = min; i < max; i += step) {
	    result.push(i);
	  }
	  return result;
	};

	/**
	 * Returns a semantic icon name or character to represent seachParamTypes
	 * eg. hashtag = #, mention = @
	 * @param string which represents a paramtype
	 * @returns char or string representing paramType (could be semantic icon class)
	 */
	var getParamTypeIcon = function getParamTypeIcon(paramType) {
	  switch (paramType) {
	    case 'author':
	      return 'user icon';
	    case 'hashtag':
	      return '#';
	    case 'keyword':
	      return 'file text icon';
	    case 'mention':
	      return 'at icon';
	    default:
	      return '?';
	  }
	};

	/**
	* Transforms the football-data.org api's player nationalities to semantic flag icon class name
	* @param string which represents football-data.org's a player's nationality
	* @returns string representing semantic flag icon class name
	*/
	var getSemanticCountryFlagName = exports.getSemanticCountryFlagName = function getSemanticCountryFlagName(countryName) {
	  switch (countryName) {
	    case 'england':
	      return 'united kingdom';
	    case 'korea, south':
	      return 'south korea';
	    case 'korea, north':
	      return 'north korea';
	    case 'bosnia-herzegovina':
	      return 'bosnia';
	    case 'cote d\'ivoire':
	      return 'cote divoire';
	    default:
	      return countryName;
	  }
	};

	/**
	 * Retrieve the .value property of some optional SPARQL result, else return a given default.
	 * @param object {Object} Of the form {myProperty: {type: "literal", value: "my value"}}
	 * @param property {String} The key name to select
	 * @param else_ {Object} Any object to return if the key does not exist
	 * @returns {*}
	 */
	var tryPropertyOrElse = exports.tryPropertyOrElse = function tryPropertyOrElse(object, property, else_) {
	  try {
	    var result = object[property].value;
	    if (result !== undefined) {
	      return result;
	    }
	  } catch (e) {}

	  return else_;
	};

	/**
	 * Retrieve the .value property of some optional SPARQL result, else return "N/A"
	 * @param object {Object} Of the form {myProperty: {type: "literal", value: "my value"}}
	 * @param property {String} The key name to select
	 */
	var tryPropertyOrNA = exports.tryPropertyOrNA = function tryPropertyOrNA(object, property) {
	  return tryPropertyOrElse(object, property, "N/A");
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CountryBuilder = exports.PlaceBuilder = exports.HashtagBuilder = exports.TweeterBuilder = exports.TweetBuilder = exports.convertSchemaObjectToClass = undefined;

	var _jsBuilderDecorator = __webpack_require__(10);

	var _databaseSchema = __webpack_require__(6);

	/**
	 * Given a schema object, as seen in ./databaseSchema.js, convert it into an object
	 * for use in the BuilderDecorator.
	 * @param name Schema object name
	 * @returns {Object} e.g. {'name': null, 'age': null}
	 */
	var convertSchemaObjectToClass = exports.convertSchemaObjectToClass = function convertSchemaObjectToClass(name, schema) {
	  var newObject = {};
	  var schemaObject = schema[name];
	  schemaObject.properties.forEach(function (property) {
	    newObject[property.name] = null;
	  });
	  return newObject;
	};

	/**
	 * Given an object name in the databaseSchema, create a useful immutable Builder.
	 * @param name e.g. 'Tweet'
	 * @returns {Builder}
	 */
	var generateBuilder = function generateBuilder(name) {
	  return _jsBuilderDecorator.BuilderDecorator.BuilderDecorator(convertSchemaObjectToClass(name, _databaseSchema.schema), { allFieldsMustBeSet: true });
	};

	// ----------------------

	var TweetBuilder = exports.TweetBuilder = generateBuilder('Tweet');
	var TweeterBuilder = exports.TweeterBuilder = generateBuilder('Tweeter');
	var HashtagBuilder = exports.HashtagBuilder = generateBuilder('Hashtag');
	var PlaceBuilder = exports.PlaceBuilder = generateBuilder('Place');
	var CountryBuilder = exports.CountryBuilder = generateBuilder('Country');

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("js-builder-decorator");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.stream = exports.searchAndSaveResponse = exports.searchAndSaveFromTwitter = exports.buildTweeterFromRaw = exports.TwitAccess = exports.TWITTER_ENABLED = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _orientdb = __webpack_require__(4);

	var _databaseInsertActions = __webpack_require__(12);

	var _tweetFinder = __webpack_require__(3);

	var _databaseObjects = __webpack_require__(9);

	var Builders = _interopRequireWildcard(_databaseObjects);

	var _utilities = __webpack_require__(7);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var Twit = __webpack_require__(13);
	var moment = __webpack_require__(14);
	var TWITTER_ENABLED = exports.TWITTER_ENABLED = true;
	var MAX_TWEETS_FROM_TWITTER_API = 100;

	// These keys should be hidden in a private config file or environment variables
	// For simplicity of this assignment, they will be visible here
	var TwitAccess = exports.TwitAccess = new Twit({
	  access_token: '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
	  access_token_secret: 'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
	  consumer_key: 'YiSLB0kOlsTd21UGYT32YOUgg',
	  consumer_secret: '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
	  timeout_ms: 60 * 1000 });

	/**
	 * Convert some raw status from the Twitter API into a proper immutable Tweet object.
	 * @param rawTweet From the Twitter API.
	 * @returns {ImmutableTweet}
	 */
	// optional HTTP request timeout to apply to all requests.
	var buildTweetFromRaw = function buildTweetFromRaw(rawTweet) {
	  var coordinates = findLatitudeLongitude(rawTweet);
	  var image_url = getImageUrl(rawTweet);

	  return Builders.TweetBuilder().id(rawTweet.id_str).content(rawTweet.text).date(moment(new Date(rawTweet.created_at)).format('YYYY-MM-DD HH:mm:ss')).likes(rawTweet.favorite_count).retweets(rawTweet.retweet_count).latitude(coordinates.latitude).longitude(coordinates.longitude).contains_a_quoted_tweet(rawTweet.quoted_status ? rawTweet.quoted_status.id_str : '').image_url(image_url).build();
	};

	/**
	  * Finds if Latitude/Longitude coordinates exist in raw tweet, otherwise return 0.0 for both
	  * @param rawTweet From the Twitter API.
	  * @returns [latitude, longitude]
	  */
	var findLatitudeLongitude = function findLatitudeLongitude(rawTweet) {
	  var test = void 0;
	  try {
	    if (rawTweet.geo) {
	      test = 'geo';
	      if (rawTweet.geo.coordinate) {
	        return {
	          latitude: rawTweet.geo.coordinate[0],
	          longitude: rawTweet.geo.coordinate[1]
	        };
	      } else {
	        return {
	          latitude: rawTweet.geo.coordinates[0],
	          longitude: rawTweet.geo.coordinates[1]
	        };
	      }
	    } else if (rawTweet.coordinates) {
	      test = 'coord';
	      return {
	        latitude: rawTweet.coordinates.coordinate[1],
	        longitude: rawTweet.coordinates.coordinate[0]
	      };
	    } else if (rawTweet.place) {
	      test = 'place';
	      return {
	        latitude: rawTweet.place.bounding_box.coordinates[0][0][1],
	        longitude: rawTweet.place.bounding_box.coordinates[0][0][0]
	      };
	    }
	  } catch (err) {
	    console.warn('Error parsing ' + test + ' data in tweet #' + rawTweet.id_str + '.');
	  }

	  return {
	    latitude: 0.0,
	    longitude: 0.0
	  };
	};

	/**
	 * Pulls the image url out of a tweet if it has one.
	 * @param rawTweet
	 * @returns {*} A direct link to the image being displayed
	 */
	var getImageUrl = function getImageUrl(rawTweet) {
	  try {
	    var media = rawTweet.entities.media[0];
	    if (media.type === 'photo') {
	      return media.media_url_https;
	    }
	  } catch (err) {
	    return 'none';
	  }

	  return 'none';
	};

	/**
	 * Convert some raw user from the Twitter API into a proper immutable Tweeter object.
	 * @param rawTweeter From the Twitter API.
	 * @param Boolean to signify if the passed in rawTweeter is a mention object
	 * or a full user object that has a profile_image_url_https
	 * @returns {ImmutableTweet}
	 */
	var buildTweeterFromRaw = exports.buildTweeterFromRaw = function buildTweeterFromRaw(rawTweeter, isMentionUser) {
	  var tweeter = Builders.TweeterBuilder().id(rawTweeter.id_str).name(rawTweeter.name).handle(rawTweeter.screen_name);

	  if (isMentionUser) {
	    tweeter.profile_image_url('none').is_verified(false).is_user_mention(true);
	  } else {
	    tweeter.profile_image_url(rawTweeter.profile_image_url_https).is_verified(rawTweeter.verified).is_user_mention(false);
	  }

	  return tweeter.build();
	};

	var buildPlaceFromRaw = function buildPlaceFromRaw(rawPlace) {
	  return Builders.PlaceBuilder().id(rawPlace.id).name(rawPlace.name).full_name(rawPlace.full_name).type(rawPlace.place_type).build();
	};

	/**
	 * Given some raw status we know is a retweet, insert it and add a RETWEETED link.
	 * @param db The OrientDB instance
	 * @param retweeter An immutable Tweeter object representing the author of the rawTweet
	 * @param rawRetweet A raw status from the Twitter API representing a retweet
	 * @returns {Promise}
	 */
	var processRawRetweet = function processRawRetweet(db, retweeter, rawRetweet) {
	  var originalTweeter = buildTweeterFromRaw(rawRetweet.user, false);
	  var originalTweet = buildTweetFromRaw(rawRetweet);
	  var rawQuotedStatus = rawRetweet.quoted_status;

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return (0, _databaseInsertActions.upsertTweeter)(db, retweeter);
	  }).then(function () {
	    // if the retweet is a quoted tweet then process the quote tweet
	    // link the quote tweet to the retweet
	    if (rawQuotedStatus) {
	      return processQuoteTweet(db, rawRetweet, rawQuotedStatus);
	    }

	    return processRawOriginalTweet(db, rawRetweet, originalTweeter);
	  }).then(function () {
	    return (0, _databaseInsertActions.linkTweeterToRetweet)(db, retweeter, originalTweet);
	  });
	};

	/**
	 * Given some raw status we know is a quote, insert it and a QUOTED link.
	 * @param db The OrientDB instance
	 * @param rawQuoteTweet A raw status from the twitter API which represents the tweet that quoted the rawOriginalTweet
	 * @param rawOriginalTweet A raw status from the twitter API which represents the tweet that was quoted
	 * @returns {Promise}
	 */
	var processQuoteTweet = function processQuoteTweet(db, rawQuoteTweet, rawOriginalTweet) {
	  var originalTweet = buildTweetFromRaw(rawOriginalTweet);
	  var quoteTweet = buildTweetFromRaw(rawQuoteTweet);
	  var quoteTweeter = buildTweeterFromRaw(rawQuoteTweet.user, false);

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return processRawOriginalTweet(db, rawQuoteTweet, quoteTweeter);
	  }).then(function () {
	    // There's an edge case where the quote in a quoted tweet doesn't have a user Object
	    // found this is particular to a certain android client
	    if (rawOriginalTweet.user) {
	      return buildTweeterFromRaw(rawOriginalTweet.user, false);
	    }

	    // If there isn't a user then try to get the user (see ./twitterFinder.js:317-331)
	    return (0, _tweetFinder.getOriginalTweetUserFromTweet)(rawOriginalTweet.id_str);
	  }).then(function (originalTweeter) {
	    return processRawOriginalTweet(db, rawOriginalTweet, originalTweeter);
	  }).then(function () {
	    return (0, _databaseInsertActions.linkQuoteTweetToOriginalTweet)(db, quoteTweet, originalTweet);
	  });
	};

	/**
	 * Link a tweet to all of its hashtags
	 * @param db The OrientDB instance
	 * @param rawHashtags The original hashtags
	 * @param tweet
	 * @returns {Promise}
	 */
	var linkTweetToHashtags = function linkTweetToHashtags(db, rawHashtags, tweet) {
	  return Promise.all(rawHashtags.map(function (rawHashtag) {
	    var hashtag = Builders.HashtagBuilder().content(rawHashtag.text.toLowerCase()).build();

	    return (0, _utilities.newPromiseChain)().then(function () {
	      return (0, _databaseInsertActions.upsertHashtag)(db, hashtag);
	    }).then(function () {
	      return (0, _databaseInsertActions.linkTweetToHashtag)(db, tweet, hashtag);
	    });
	  }));
	};

	var linkTweetToMentions = function linkTweetToMentions(db, rawMentions, tweet) {
	  return Promise.all(rawMentions.map(function (rawMention) {
	    var mentionedTweeter = buildTweeterFromRaw(rawMention, true);

	    return (0, _utilities.newPromiseChain)().then(function () {
	      return (0, _databaseInsertActions.upsertTweeter)(db, mentionedTweeter);
	    }).then(function () {
	      return (0, _databaseInsertActions.linkTweetToTweeterViaMention)(db, tweet, mentionedTweeter);
	    });
	  }));
	};

	/**
	 * Given a raw status we know is not a retweet, insert it and upsert the user.
	 * @param db The OrientDB instance
	 * @param rawTweet A raw status from the Twitter API
	 * @param originalTweeter An immutable Tweeter object
	 * @returns {Promise}
	 */
	var processRawOriginalTweet = function processRawOriginalTweet(db, rawTweet, originalTweeter) {
	  var tweet = buildTweetFromRaw(rawTweet);
	  var rawHashtags = rawTweet.entities.hashtags;
	  var rawMentions = rawTweet.entities.user_mentions;

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return (0, _databaseInsertActions.upsertTweet)(db, tweet);
	  }).then(function () {
	    return (0, _databaseInsertActions.upsertTweeter)(db, originalTweeter);
	  }).then(function () {
	    return (0, _databaseInsertActions.linkTweeterToTweet)(db, originalTweeter, tweet);
	  }).then(function () {
	    return linkTweetToLocation(db, tweet, rawTweet.place);
	  }).then(function () {
	    return linkTweetToHashtags(db, rawHashtags, tweet);
	  }).then(function () {
	    return linkTweetToMentions(db, rawMentions, tweet);
	  });
	};

	/**
	 * Given a tweet, if it has a place upsert the place and link it to a country
	 * @param db the OrientDB instance
	 * @param tweet A processed tweet to link to a place
	 * @param rawTweet A raw tweet's place property from the Twitter API
	 * @returns {Promise}
	 */
	var linkTweetToLocation = function linkTweetToLocation(db, tweet, rawPlace) {
	  if (rawPlace) {
	    var _ret = function () {
	      var place = buildPlaceFromRaw(rawPlace);
	      var country = Builders.CountryBuilder().code(rawPlace.country_code).name(rawPlace.country).build();

	      return {
	        v: (0, _utilities.newPromiseChain)().then(function () {
	          return (0, _databaseInsertActions.upsertPlace)(db, place);
	        }).then(function () {
	          return (0, _databaseInsertActions.upsertCountry)(db, country);
	        }).then(function () {
	          return (0, _databaseInsertActions.linkTweetToPlace)(db, tweet, place);
	        }).then(function () {
	          return (0, _databaseInsertActions.linkPlaceToCountry)(db, place, country);
	        })
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }

	  return Promise.resolve();
	};

	/**
	 * Given a raw tweet, extract information about the tweeter,
	 * if it was a retweet, etc, and store all information in
	 * the database.
	 * @param db The OrientDB instance
	 * @param rawTweet The original status object from the Twitter API
	 * @returns {Promise.<TwitAccess>}
	 */
	var processTweet = function processTweet(db, rawTweet) {
	  var tweeter = buildTweeterFromRaw(rawTweet.user, false);
	  var rawRetweetedStatus = rawTweet.retweeted_status;
	  var rawQuotedStatus = rawTweet.quoted_status;

	  if (rawRetweetedStatus) {
	    return processRawRetweet(db, tweeter, rawRetweetedStatus);
	  }
	  if (rawQuotedStatus) {
	    return processQuoteTweet(db, rawTweet, rawQuotedStatus);
	  }

	  return processRawOriginalTweet(db, rawTweet, tweeter);
	};

	/**
	 * Search the Twitter API for some query, saving and displaying the results.
	 * @param query Query to search twitter
	 */
	var searchAndSaveFromTwitter = exports.searchAndSaveFromTwitter = function searchAndSaveFromTwitter(query) {
	  var count = arguments.length <= 1 || arguments[1] === undefined ? 300 : arguments[1];

	  if (TWITTER_ENABLED) {
	    console.info('Searching Twitter for query \'' + query + '\'.');
	    return (0, _utilities.newPromiseChain)().then(function () {
	      return sweepTwitterAndConcat(query, count);
	    }).then(function (statuses) {
	      console.info('Twitter search for \'' + query + '\' successful! Found ' + statuses.length + ' relevant Tweets.');

	      return Promise.all(statuses.map(function (rawTweet) {
	        return processTweet(_orientdb.db, rawTweet);
	      })).then(function () {
	        return console.log('Successfully processed the Tweets.');
	      }, function (rej) {
	        return console.warn('failed to process the tweet into the database cache', rej);
	      });
	    }, function (rej) {
	      console.warn('Unable to search Twitter.', rej);
	    });
	  } else {
	    console.info('Twitter disabled, not searching query \'' + query + '\'.');
	    return Promise.resolve();
	  }
	};

	var sweepTwitterAndConcat = function sweepTwitterAndConcat(query, count) {
	  var existingStatuses = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	  var lowestId = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  var extendedQuery = query;
	  if (lowestId !== null) {
	    extendedQuery += ' max_id:' + lowestId;
	  };

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return potentiallySearchTwitter(extendedQuery, count);
	  }).then(function (twitStatuses) {
	    var countLeft = count - MAX_TWEETS_FROM_TWITTER_API;
	    var added = twitStatuses.length;

	    if (countLeft > 0 && added > 0) {
	      var _ret2 = function () {
	        var newLowestId = twitStatuses.map(function (status) {
	          return status.id_str;
	        }).sort()[0];

	        return {
	          v: (0, _utilities.newPromiseChain)().then(function () {
	            return sweepTwitterAndConcat(query, countLeft, twitStatuses, newLowestId);
	          }).then(function (results) {
	            return existingStatuses.concat(results);
	          })
	        };
	      }();

	      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	    } else {
	      return existingStatuses.concat(twitStatuses);
	    }
	  });
	};

	var potentiallySearchTwitter = function potentiallySearchTwitter(exactQuery, count) {
	  if (count > 0) {
	    var _ret3 = function () {
	      var actualCount = Math.min(count, MAX_TWEETS_FROM_TWITTER_API); // Twitter will only return a max of 100 Tweets at any time
	      return {
	        v: (0, _utilities.newPromiseChain)().then(function () {
	          return TwitAccess.get('search/tweets', { q: exactQuery + ' filter:safe -filter:retweets', count: actualCount });
	        }).then(function (twitResults) {
	          return twitResults.data.statuses;
	        })
	      };
	    }();

	    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
	  } else {
	    return [];
	  }
	};

	var searchAndSaveResponse = exports.searchAndSaveResponse = function searchAndSaveResponse(res, query) {
	  return searchAndSaveFromTwitter(query).then(function (result) {
	    res.end(JSON.stringify(result));
	  });
	};

	/**
	 * Connect to the Twitter Stream API for one minute, processing all results.
	 * @param req HTTP Request object with `query` parameter
	 * @param res HTTP Response object
	 */
	var stream = exports.stream = function stream(req, res) {
	  var stream = TwitAccess.stream('statuses/filter', { track: req.params.query });

	  stream.on('tweet', function (tweet) {
	    processTweet(tweet);
	    console.log(tweet.text);
	    res.write('' + tweet.text);
	  });

	  setTimeout(function () {
	    stream.stop();
	    console.log('END');
	    res.end('END');
	  }, 60000);
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.linkPlaceToCountry = exports.linkTweetToPlace = exports.linkTweetToTweeterViaMention = exports.linkTweetToHashtag = exports.linkQuoteTweetToOriginalTweet = exports.linkTweeterToRetweet = exports.linkTweeterToTweet = exports.upsertCountry = exports.upsertPlace = exports.upsertHashtag = exports.upsertTweet = exports.upsertTweeter = undefined;

	var _utilities = __webpack_require__(7);

	var runQueryOnImmutableObject = function runQueryOnImmutableObject(db, query, objectToFlatten) {
	  return db.query(query, { params: (0, _utilities.flattenImmutableObject)(objectToFlatten) });
	};

	var upsertTweeter = exports.upsertTweeter = function upsertTweeter(db, tweeter) {
	  // This is more complex than the other upsert queries
	  // First check if our Tweeter already exists in the database
	  // If they do, ONLY overwrite their current information, if the
	  // new information is complete, e.g. isn't from a mention
	  // and therefore has profile image information
	  var checkQuery = 'SELECT FROM tweeter WHERE id=:id';

	  var update = 'UPDATE tweeter SET id=:id, name=:name, handle=:handle, profile_image_url=:profile_image_url, is_user_mention=:is_user_mention, is_verified=:is_verified WHERE id=:id';
	  var upsert = 'UPDATE tweeter SET id=:id, name=:name, handle=:handle, profile_image_url=:profile_image_url, is_user_mention=:is_user_mention, is_verified=:is_verified UPSERT WHERE id=:id';

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return runQueryOnImmutableObject(db, checkQuery, tweeter);
	  }).then(function (response) {
	    if (response.length === 1) {
	      // Do we have this author already?
	      if (!tweeter.is_user_mention()) {
	        // Is it worth updating?
	        return runQueryOnImmutableObject(db, update, tweeter);
	      }
	    } else {
	      // We can't find the user, so upsert them
	      return runQueryOnImmutableObject(db, upsert, tweeter);
	    }
	  }).then(function () {}, function (rej) {
	    console.error('Upsert tweeter', rej);
	  });
	};

	var upsertTweet = exports.upsertTweet = function upsertTweet(db, tweet) {
	  return runQueryOnImmutableObject(db, 'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets, longitude=:longitude, latitude=:latitude, contains_a_quoted_tweet=:contains_a_quoted_tweet, image_url=:image_url UPSERT WHERE id=:id', tweet).then(function () {}, function (rej) {
	    console.error('Upsert tweet', rej);
	  });
	};

	var upsertHashtag = exports.upsertHashtag = function upsertHashtag(db, hashtag) {
	  return runQueryOnImmutableObject(db, 'UPDATE hashtag SET content=:content UPSERT WHERE content=:content', hashtag).then(function () {}, function (rej) {
	    console.error('Upsert hashtag', rej);
	  });
	};

	var upsertPlace = exports.upsertPlace = function upsertPlace(db, place) {
	  return runQueryOnImmutableObject(db, 'UPDATE place SET id=:id, name=:name, full_name=:full_name, type=:type UPSERT WHERE id=:id', place).then(function () {}, function (rej) {
	    return console.error('Upsert place', rej);
	  });
	};

	var upsertCountry = exports.upsertCountry = function upsertCountry(db, country) {
	  return runQueryOnImmutableObject(db, 'UPDATE country SET code=:code, name=:name UPSERT WHERE code=:code', country).then(function () {}, function (rej) {
	    console.error('Upsert country', rej);
	  });
	};

	var linkTweeterToTweet = exports.linkTweeterToTweet = function linkTweeterToTweet(db, tweeter, tweet) {
	  return db.query('CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)', {
	    params: {
	      tweetId: tweet.id(),
	      tweeterId: tweeter.id()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'TWEETED.in_out', 'tweeter', 'tweet');
	  });
	};

	var linkTweeterToRetweet = exports.linkTweeterToRetweet = function linkTweeterToRetweet(db, tweeter, tweet) {
	  return db.query('CREATE EDGE RETWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)', {
	    params: {
	      tweetId: tweet.id(),
	      tweeterId: tweeter.id()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'RETWEETED.in_out', 'tweeter', 'retweet');
	  });
	};

	var linkQuoteTweetToOriginalTweet = exports.linkQuoteTweetToOriginalTweet = function linkQuoteTweetToOriginalTweet(db, quoteTweet, originalTweet) {
	  return db.query('CREATE EDGE QUOTED FROM (SELECT FROM tweet WHERE id = :quoteTweetId) TO (SELECT FROM tweet WHERE id = :originalTweetId)', {
	    params: {
	      quoteTweetId: quoteTweet.id(),
	      originalTweetId: originalTweet.id()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'QUOTED.in_out', 'quoteTweet', 'quotedTweet');
	  });
	};

	var linkTweetToHashtag = exports.linkTweetToHashtag = function linkTweetToHashtag(db, tweet, hashtag) {
	  return db.query('CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)', {
	    params: {
	      tweetId: tweet.id(),
	      hashtagContent: hashtag.content()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'HAS_HASHTAG.in_out', 'tweet', 'hashtag');
	  });
	};

	var linkTweetToTweeterViaMention = exports.linkTweetToTweeterViaMention = function linkTweetToTweeterViaMention(db, tweet, mentionedTweeter) {
	  return db.query('CREATE EDGE MENTIONS FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM tweeter WHERE id = :mentionedTweeterId)', {
	    params: {
	      tweetId: tweet.id(),
	      mentionedTweeterId: mentionedTweeter.id()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'MENTIONS.in_out', 'tweet', 'mentioned tweeter');
	  });
	};

	var linkTweetToPlace = exports.linkTweetToPlace = function linkTweetToPlace(db, tweet, place) {
	  return db.query('CREATE EDGE HAS_PLACE FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM place WHERE id = :placeId)', {
	    params: {
	      tweetId: tweet.id(),
	      placeId: place.id()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'HAS_PLACE.in_out', 'tweet', 'place');
	  });
	};

	var linkPlaceToCountry = exports.linkPlaceToCountry = function linkPlaceToCountry(db, place, country) {
	  return db.query('CREATE EDGE IN_COUNTRY FROM (SELECT FROM place WHERE id = :placeId) TO (SELECT FROM country WHERE code = :countryCode)', {
	    params: {
	      placeId: place.id(),
	      countryCode: country.code()
	    }
	  }).then(function () {}, function (rej) {
	    return expectRejection(rej, 'IN_COUNTRY.in_out', 'place', 'country');
	  });
	};

	var expectRejection = function expectRejection(rejection, expect, from, to) {
	  if (rejection.message.indexOf(expect) === -1) {
	    console.error('Unexpected error linking ' + from + ' => ' + to + '.', rejection);
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("twit");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fetchFromFootballAPI = exports.searchFootballTeamPlayers = exports.searchFootballSeasonTeams = exports.searchFootballSeasons = exports.footballAccessOptions = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _isomorphicFetch = __webpack_require__(8);

	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

	var _orientdb = __webpack_require__(4);

	var _utilities = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// These keys should be hidden in a private config file or environment variables
	// For simplicity of this assignment, they will be visible here
	var footballAccessOptions = exports.footballAccessOptions = {
	  method: 'GET',
	  headers: {
	    'X-Auth-Token': 'f39c0cf21f95409498f8eea5eb129b0f',
	    'X-Response-Control': 'minified'
	  },
	  dataType: 'json'
	};

	var footballAPIHost = 'http://api.football-data.org';
	var footballAPIVersion = '/v1';

	var searchFootballSeasons = exports.searchFootballSeasons = function searchFootballSeasons(res, year) {
	  var footballRequestUrl = '' + footballAPIHost + footballAPIVersion + '/soccerseasons/?season=' + year;

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return _orientdb.db.query('SELECT FROM league WHERE year=:year', { params: { year: year } });
	  }).then(function (results) {
	    if (results.length === 0) {
	      // If our cache is empty, call the Football API
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return fetchFromFootballAPI(footballRequestUrl);
	      }).then(function (footballSeasons) {
	        return cacheAPIJsonArray(_orientdb.db, 'League', footballSeasons.length > 0 ? footballSeasons : []);
	      });
	    } else {
	      return results; // Return our cached data
	    }
	  }).then(function (footballSeasons) {
	    res.writeHead(200, { 'Content-Type': 'application/json' });
	    res.end(JSON.stringify(footballSeasons));
	  }, function (rejection) {
	    res.writeHead(500, { 'Content-Type': 'application/json' });
	    res.end('An unexpected internal error occurred.');
	    console.warn('Unable to get ' + year, rejection);
	  });
	};

	var searchFootballSeasonTeams = exports.searchFootballSeasonTeams = function searchFootballSeasonTeams(res, year, leagues) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return Promise.all(leagues.map(function (league) {
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return fetchLeagueTeamsById(league.id);
	      }).then(function (leagueTeams) {
	        return _extends({
	          name: league.name,
	          id: league.id
	        }, leagueTeams);
	      });
	    }));
	  }).then(function (allYearsLeagueTeams) {
	    res.writeHead(200, { 'Content-Type': 'application/json' });
	    res.end(JSON.stringify({
	      data: {
	        teamsByLeague: allYearsLeagueTeams
	      }
	    }));
	  }, function (rejection) {
	    res.writeHead(500, { 'Content-Type': 'application/json' });
	    res.end('An unexpected internal error occurred.');
	    console.warn('Unable to search for query year:' + year + '\'s league\'s teams', rejection);
	  });
	};

	var fetchLeagueTeamsById = function fetchLeagueTeamsById(leagueId) {
	  var footballRequestUrl = '' + footballAPIHost + footballAPIVersion + '/soccerseasons/' + leagueId + '/teams';
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return _orientdb.db.query('SELECT FROM team WHERE leagueid=:leagueid', { params: { leagueid: leagueId } });
	  }).then(function (results) {
	    if (results.length === 0) {
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return fetchFromFootballAPI(footballRequestUrl);
	      }).then(function (league) {
	        return cacheAPIJsonArray(_orientdb.db, 'Team', league.teams.map(function (team) {
	          return _extends({}, team, { leagueid: leagueId });
	        }));
	      });
	    } else {
	      return results;
	    }
	  }).then(function (teams) {
	    return { teams: teams };
	  }).then(function (leagueTeamsResolved) {
	    return leagueTeamsResolved;
	  }, function (rejection) {
	    return console.warn('Major error requesting the league with id:' + leagueId + '.', rejection);
	  });
	};

	var searchFootballTeamPlayers = exports.searchFootballTeamPlayers = function searchFootballTeamPlayers(res, teamId) {
	  var footballRequestUrl = '' + footballAPIHost + footballAPIVersion + '/teams/' + teamId + '/players';

	  return (0, _utilities.newPromiseChain)().then(function () {
	    return _orientdb.db.query('SELECT FROM player WHERE teamid=:teamid', { params: { teamid: teamId } });
	  }).then(function (results) {
	    if (results.length === 0) {
	      // If our cache is empty, call the Football API
	      return (0, _utilities.newPromiseChain)().then(function () {
	        return fetchFromFootballAPI(footballRequestUrl);
	      }).then(function (league) {
	        return cacheAPIJsonArray(_orientdb.db, 'Player', league.players.map(function (player) {
	          return _extends({}, player, { teamid: teamId });
	        }));
	      });
	    } else {
	      return results; // Return our cached data
	    }
	  }).then(function (players) {
	    return { players: players };
	  }).then(function (footballPlayers) {
	    res.writeHead(200, { 'Content-Type': 'application/json' });
	    res.end(JSON.stringify(footballPlayers));
	  }, function (rejection) {
	    res.writeHead(500, { 'Content-Type': 'application/json' });
	    res.end('An unexpected internal error occurred.');
	    console.warn('Unable to get ' + teamId, rejection);
	  });
	};

	var fetchFromFootballAPI = exports.fetchFromFootballAPI = function fetchFromFootballAPI(footballRequestUrl) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return console.info('Hitting Football API:', footballRequestUrl);
	  }).then(function () {
	    return (0, _isomorphicFetch2.default)(footballRequestUrl, footballAccessOptions);
	  }).then(function (response) {
	    return response.json();
	  });
	};

	var cacheAPIJsonArray = function cacheAPIJsonArray(db, datatype, dataArray) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return Promise.all( // Insert all the seasons to our cache
	    dataArray.map(function (data) {
	      return db.insert().into(datatype).set(data).one().then(function (res) {}, function (rej) {});
	    }));
	  }).then(function () {
	    if (dataArray.length > 0) {
	      return dataArray;
	    } else {
	      return {};
	    }
	  }) // Return the actual API data as we already have it
	  ;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.journalismPlayer = exports.journalismTeam = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _sparqlClient = __webpack_require__(18);

	var _moment = __webpack_require__(14);

	var _moment2 = _interopRequireDefault(_moment);

	var _utilities = __webpack_require__(7);

	var _footballSearch = __webpack_require__(16);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var client = new _sparqlClient.SparqlClient('http://dbpedia.org/sparql').register({
	  db: 'http://dbpedia.org/resource/',
	  dbpedia: 'http://dbpedia.org/property/'
	});

	var journalismTeam = exports.journalismTeam = function journalismTeam(res, team, footballDataOrgTeamId) {
	  return (0, _utilities.newPromiseChain)().then(function () {
	    return (0, _footballSearch.fetchFromFootballAPI)('http://api.football-data.org/v1/teams/' + footballDataOrgTeamId + '/fixtures');
	  }).then(function (data) {
	    return { footballApiData: data };
	  }).then(function (all) {
	    return (0, _utilities.newPromiseChain)().then(function () {
	      return getTeamInformation(team);
	    }).then(function (teamInformation) {
	      return _extends({}, all, { leftTeam: teamInformation });
	    });
	  }).then(function (all) {
	    return Promise.all(all.footballApiData.fixtures.filter(function (fixture) {
	      var fixtureMonthDifferenceFromToday = (0, _moment2.default)().diff((0, _moment2.default)(fixture.date), 'months');
	      return fixtureMonthDifferenceFromToday <= 1 && fixtureMonthDifferenceFromToday >= -1;
	    }).reverse().map(function (fixture) {
	      var otherTeamName = void 0;
	      var searchedTeamIsHome = void 0;
	      if (fixture.homeTeamName === team) {
	        otherTeamName = fixture.awayTeamName;
	        searchedTeamIsHome = true;
	      } else if (fixture.awayTeamName === team) {
	        otherTeamName = fixture.homeTeamName;
	        searchedTeamIsHome = false;
	      } else {
	        throw 'Neither home nor away team matches the given team name ' + team + '.';
	      }

	      return getTeamInformation(otherTeamName).then(function (result) {
	        return {
	          leftTeam: all.leftTeam,
	          rightTeam: result,
	          fixtureInfo: fixture,
	          searchedTeamIsHome: searchedTeamIsHome
	        };
	      });
	    })).then(function (data) {
	      return _extends({}, all, { matches: data });
	    });
	  }).then(function (all) {
	    return { matches: all.matches };
	  }).then(function (all) {
	    return res.end(JSON.stringify(all));
	  });
	};

	var getTeamInformation = function getTeamInformation(teamOriginal) {
	  var team = teamOriginal.replace(/ /g, '_');

	  var clubDescription = client.registerCommon('rdfs').query('\n      SELECT * WHERE {\n        dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n        ?team a <http://dbpedia.org/ontology/SoccerClub> .\n        OPTIONAL { ?team <http://dbpedia.org/ontology/abstract> ?abstract } .\n        OPTIONAL { ?team <http://dbpedia.org/property/nickname> ?nickname } .\n        OPTIONAL { ?team <http://dbpedia.org/property/website> ?website } .\n        OPTIONAL { ?team <http://dbpedia.org/ontology/league> ?league . ?league rdfs:label ?label } .\n\n        FILTER(langMatches(lang(?abstract), "EN")) .\n        FILTER(langMatches(lang(?label), "EN")) .\n      }\n    ').execute();

	  var groundsDescription = client.query('\n        SELECT * WHERE {\n          dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n          ?team a <http://dbpedia.org/ontology/SoccerClub> .\n          OPTIONAL {\n            ?team <http://dbpedia.org/ontology/ground> ?grounds .\n            OPTIONAL { ?grounds <http://dbpedia.org/property/name> ?groundname } .\n            OPTIONAL { ?grounds <http://dbpedia.org/ontology/seatingCapacity> ?capacity } .\n            OPTIONAL { ?grounds <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .\n            FILTER(langMatches(lang(?groundname), "EN")) .\n          } .\n        }\n      ').execute();

	  var clubPlayers = client.registerCommon('rdfs').query('\n      SELECT * WHERE {\n        dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n        ?team a <http://dbpedia.org/ontology/SoccerClub> .\n        OPTIONAL {\n          ?player <http://dbpedia.org/property/currentclub> ?team .\n          OPTIONAL { ?player <http://dbpedia.org/property/fullname> ?name } .\n          OPTIONAL { ?player <http://dbpedia.org/ontology/number> ?number } .\n          OPTIONAL { ?player <http://dbpedia.org/ontology/birthDate> ?birthDate } .\n          OPTIONAL { ?player <http://dbpedia.org/ontology/position> ?position . ?position rdfs:label ?positionLabel } .\n        }\n\n        FILTER(langMatches(lang(?positionLabel), "EN")) .\n      }\n    ').execute();

	  var chairmanDescription = client.registerCommon('rdfs').query('\n      SELECT * WHERE {\n        dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n        ?team a <http://dbpedia.org/ontology/SoccerClub> .\n        OPTIONAL {\n          ?team <http://dbpedia.org/ontology/chairman> ?chairman .\n          OPTIONAL { ?chairman <http://dbpedia.org/property/name> ?name } .\n          OPTIONAL { ?chairman <http://dbpedia.org/ontology/birthDate> ?birthDate } .\n          OPTIONAL { ?chairman rdfs:comment ?comment } .\n          OPTIONAL { ?chairman <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .\n        } .\n\n        FILTER(langMatches(lang(?name), "EN")) .\n        FILTER(langMatches(lang(?comment), "EN")) .\n      }\n    ').execute();

	  var managerDescription = client.registerCommon('rdfs').query('\n      SELECT * WHERE {\n        dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n        ?team a <http://dbpedia.org/ontology/SoccerClub> .\n        OPTIONAL {\n          ?team <http://dbpedia.org/ontology/manager> ?manager\n          OPTIONAL { ?manager <http://dbpedia.org/property/fullname> ?name } .\n          OPTIONAL { ?manager <http://dbpedia.org/ontology/birthDate> ?birthDate } .\n          OPTIONAL { ?manager rdfs:comment ?comment } .\n          OPTIONAL { ?manager <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .\n        } .\n\n        FILTER(langMatches(lang(?name), "EN")) .\n        FILTER(langMatches(lang(?comment), "EN")) .\n      }\n    ').execute();

	  var ListOfleaguesWon = client.registerCommon('rdfs').query('\n      SELECT ?winners ?label WHERE {\n        dbr:' + team + ' <http://dbpedia.org/ontology/wikiPageRedirects> ?team .\n        ?team a <http://dbpedia.org/ontology/SoccerClub> .\n        OPTIONAL { ?winners <http://dbpedia.org/property/winners> ?team . ?winners rdfs:label ?label } .\n        FILTER(langMatches(lang(?label), "EN")) .\n      }\n    ').execute();

	  return Promise.all([clubDescription, groundsDescription, clubPlayers, chairmanDescription, managerDescription, ListOfleaguesWon]).then(function (results) {
	    var clubInfo = results[0].results.bindings[0];
	    var groundsInfo = results[1].results.bindings[0];
	    var players = results[2].results.bindings;
	    var chairman = results[3].results.bindings;
	    var manager = results[4].results.bindings;
	    var leaguesWon = results[5].results.bindings;

	    return {
	      team: teamOriginal, clubInfo: clubInfo, groundsInfo: groundsInfo, players: players, chairman: chairman, manager: manager, leaguesWon: leaguesWon
	    };
	  });
	};

	var journalismPlayer = exports.journalismPlayer = function journalismPlayer(res, playerName) {
	  var mainDescription = client.registerCommon('rdfs').query('\n      SELECT DISTINCT * WHERE {\n        ?player foaf:name "' + playerName + '"@en .\n        {\n          ?player a umbel-rc:SoccerPlayer\n        } UNION {\n          ?player a dbo:SoccerPlayer\n        } .\n\n        OPTIONAL { ?player <http://dbpedia.org/property/fullname> ?fullname } .\n        OPTIONAL { ?player <http://dbpedia.org/property/name> ?name } .\n        OPTIONAL { ?player <http://dbpedia.org/ontology/Person/height> ?height } .\n        OPTIONAL { ?player <http://dbpedia.org/ontology/birthDate> ?birthdate } .\n        OPTIONAL { ?player <http://dbpedia.org/property/position> ?position . ?position rdfs:label ?positionlabel . FILTER(langMatches(lang(?positionlabel), "EN")) } .\n        OPTIONAL { ?player <http://dbpedia.org/property/caps> ?caps } .\n        OPTIONAL { ?player <http://dbpedia.org/property/goals> ?goals } .\n        OPTIONAL { ?player <http://dbpedia.org/property/quote> ?quote } .\n        OPTIONAL { ?player <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .\n        OPTIONAL {\n          ?player <http://dbpedia.org/property/currentclub> ?currentclub .\n          ?currentclub <http://dbpedia.org/property/fullname> ?currentclubname .\n        }\n\n        OPTIONAL { ?player dbo:abstract ?abstract . FILTER(langMatches(lang(?abstract), "EN")) } .\n      }\n      LIMIT 1\n    ').execute();

	  var allTeams = client.query('\n      SELECT DISTINCT * WHERE {\n        ?player foaf:name "' + playerName + '"@en .\n        {\n          ?player a umbel-rc:SoccerPlayer\n        } UNION {\n          ?player a dbo:SoccerPlayer\n        } .\n\n        ?player dbo:team ?team .\n        ?team rdfs:label ?teamname .\n\n        OPTIONAL {\n          ?team rdfs:comment ?teamcomment .\n          FILTER(langMatches(lang(?teamcomment), "EN")) .\n        } .\n\n        FILTER(langMatches(lang(?teamname), "EN")) .\n      }\n    ').execute();

	  Promise.all([mainDescription, allTeams]).then(function (result) {
	    try {
	      res.end(JSON.stringify({
	        description: result[0].results.bindings[0],
	        teams: result[1].results.bindings
	      }));
	    } catch (err) {}
	  });
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("sparql-client-2");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("webpack-hot-middleware");

/***/ }
/******/ ]);