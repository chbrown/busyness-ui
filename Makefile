BIN := node_modules/.bin

all: build/bundle.js data/times.json

data/times.json: data/times.njson
	jq -s -c '.' $< >$@

$(BIN)/tsc $(BIN)/webpack:
	npm install

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc

dev:
	PORT=2876 node webpack-dev-server.js

build/bundle.js: webpack.config.js index.jsx
	NODE_ENV=production $(BIN)/webpack --config $<
