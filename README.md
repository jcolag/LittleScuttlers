# LittleScuttlers
Experiments with Scuttlebutt

[Scuttlebutt](https://www.scuttlebutt.nz/) is a decentralized social network designed to operate well offline, and just _happens_ to have a nice community.  So, I've been messing around with the protocol to see what's possible and create some utilities that are useful to how I work.

## Instructions

First, clone this repository.

Second, if you're not a developer, you'll need to install [Node.js](https://nodejs.org/en/), which this uses.  And then [NPM](https://www.npmjs.com/get-npm) if you don't have _that_ (but it should come with Node).

Third, go into the LittleScuttlers folder with the command line and type `npm install`.  If nothing goes wrong, this should grab all the libraries used by the project.

Fourth, you need to run a Scuttlebutt instance.  If you have [Patchwork](https://ahdinosaur.github.io/patchwork-downloader/) or a similar client, that'll do it.

Fifth, run the scripts with `node whatever-script-you-want.js`.

## Export

The simple project is `export.js`, which exports the current user's Scuttlebutt content into a JSON file.

If you run it as `node export.js`, it puts the results in a file named `scuttlebutt.json`.  But, you can also run it with `node export.js filename.json` to name the output file to whatever you type instead of `filename`.

The flow of the program, if you want to tinker, is to create a Secure Scuttlebutt client (`ssbClient`).  If that works, get the identification for the current user.  If _that_ works, get the user's stream of data, limited to those posted by the current user.  The contents of that stream are then converted to a JSON file.

Note that the script does _not_ currently pick up private messages, because they're not part of the stream.

