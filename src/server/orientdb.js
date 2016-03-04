import OrientDB from 'orientjs';

// Credentials should be stored in a hidden config file, or in environment variables.
// As this is a student project, for simplicity, they will reside here.
const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'admin',
});

const dbName = 'footballers12';

const makeClassFromObject = (db, object) => {
	return makeClass(db, object.name, object.superclass, object.properties)	
}

const makeClass = (db, name, superclass, properties) => {
	db.class.create(name, superclass)
	.then((clazz) => {
		const transformedProperties = properties.map((input) => {
			return {'name': input[0], 'type': input[1]}
		});

		clazz.property.create(transformedProperties);
	});
}

const makeClasses = (db) => {
	makeClassFromObject(db, {
		'name': 'Tweet',
		'superclass': 'V',
		'properties': [
			['content', 'String'],
			['date', 'Datetime'],
			['likes', 'Integer'],
			['retweets', 'Integer']
		]
	});
}

export const generateDatabase = (res) => {
	server.list().then((dbs) => {
		let foundDb = false;
		let dub = null;
		for (let i = 0; i < dbs.length; i++) {
			const db = dbs[i];
			if (db.name === dbName) {
				foundDb = true;
				dub = db;
				console.log("Found!");
			}
		}

		console.log("okay")

		if (dub === null) {
			server.create(dbName).then((db) => {
				//console.log(db);
				//res.end(`Created: ${db}`)
				console.log("Making db");

				// Generate classes
				makeClasses(db);
				

				// db.class.create('Tweet')
				// .then((clazz)=>{
				// 	console.log("clazz1");
				// 	clazz.property.create([
				// 		{'name': 'content',	'type': 'String'},
				// 		// {'name': 'date', 'type':'Datetime'},
				// 		// {'name': 'likes', 'type': 'Integer'},
				// 		// {'name': 'retweets', 'type': 'Integer'}
				// 	]);
				// 	console.log("clazz2", clazz);
				// })
				// .error((e) => {
				// 	console.log("ERRRRRROR:", e);
				// })
				// ;

				// db.close().then(() => { server.close(); });
				res.end("done");
			})
		} else {
			console.log("duba");	
			
			makeClasses(dub);
			// .then((clazz)=>{
			// 		console.log("clazz1");
			// 		clazz.property.create([
			// 			{'name': 'content',	'type': 'String'},
			// 			{'name': 'date', 'type':'Datetime'},
			// 			{'name': 'likes', 'type': 'Integer'},
			// 			{'name': 'retweets', 'type': 'Integer'}
			// 		]);
					// console.log("clazz2", clazz);
				// });		

			res.end(`Found: ${foundDb}`);
		}
	});
}

export const db = server.use(dbName);
console.log("TRYING");