default: bootstrap

dist: clean bootstrap
	NODE_ENV=production node_modules/.bin/gulp build

bootstrap:
	npm install

clean:
	rm -rf build
	rm -rf node_modules
	rm -rf semantic/dist
