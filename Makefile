BIN := node_modules/.bin

all: build/bundle.js data/times.json

$(BIN)/webpack:
	npm install

dev:
	PORT=2876 node webpack-dev-server.js

build/bundle.js: webpack.config.js index.jsx
	NODE_ENV=production $(BIN)/webpack --config $<
