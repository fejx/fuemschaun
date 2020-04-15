# Fümschaun: Watch remotely with your friends

Fümschaun is a browser extension that allows people to watch a video remotely together.
The extension synchronizes video playback between all peers.
All you need to to is:
* Open a website with a video
* Decide on a username
* Share the link

## Where it works

It should work an (almost) any website that contains a video!
We are testing on the following services:

| Service     | Functional |
| ----------- | ---------- |
| Youtube     | Yes        |
| Prime Video | Yes        |
| Disney+     | Yes        |
| Netflix     | No         |

If you find a website where Fümschaun does not work, please report it by [opening an issue](https://github.com/fejx/fuemschaun/issues/new).

## How it works

The project is divided into a client and a server application.
The client is the browser extension that detects video elements in websites.
If a Fümschaun-Session is started, each one of the people in the session can play, pause or seek the video anytime.
The extension detects these actions and sends them to the server.
The server broadcasts the actions to all other peers in the session.
Therefore, everyone can be sure to watch the same thing.

## What does not work (yet)

The bare essentials are already functional. However, Fümschaun is still a work in progress.
To get a feeling on the progress, check out the [Issues](https://github.com/fejx/fuemschaun/issues) or [Projects](https://github.com/fejx/fuemschaun/projects/1) tabs.

Until now, the extension is not published anywhere yet.
However, building for yourself is very easy (see the [build section](#building-for-production) for instructions).
Expect bugs and rough edges!
If you find a bug (or have any questions), [open an issue](https://github.com/fejx/fuemschaun/issues/new).

## Contribute

Contributions are welcome!
Check out the [issues tagged with ‚good first issue’](https://github.com/fejx/fuemschaun/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
If you want to contribute, please get in touch beforehand by e.g. [opening an issue](https://github.com/fejx/fuemschaun/issues/new).

## Building for production

This section describes how to create a distributable build of the project for production.
For active development, see the section [Running for development](#running-for-development).

### How to build the client

1. If not done already, install [Node.js using these instructions](docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. `cd client`
3. `npm start`
4. You're done! You can find the `crx`-file at `client/dist/fuemschaun.crx`.

### How to run the server for production

1. If not done already, install [Node.js using these instructions](docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. `cd server`
3. `npm i`
4. `npm start`
5. Done!

## Running for development

This section describes how to create a live-reloading version of the extension.
For a production distribution, see the section [Building for production](#building-for-production).

### How to develop for the client

1. If not done already, install [Node.js using these instructions](docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. `cd client`
3. `npm i`
4. `npm run dev`
5. Load the extension in Chrome/Chromium.
    1. Navigate to `chrome://extensions`.
    2. Enable developer mode (top right corner).
    3. Click "Load unpacked"
    4. Navigate to `client/build`
6. Done! When you change the code, webpack automatically rebuilds the updated module. However, the extension has to be reloaded manually in Chrome as of now (see [#23](https://github.com/fejx/fuemschaun/issues/23) for updates on this issue).

### How to run the server for development

1. If not done already, install [Node.js using these instructions](docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. `cd server`
3. `npm i`
4. `npm run dev`
5. Done!
