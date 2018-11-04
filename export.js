const ssbClient = require('ssb-client');
const pull = require('pull-stream');
const fs = require('fs');

let outfile = "scuttlebutt.json";

if (process.argv.length > 2) {
  outfile = process.argv[process.argv.length - 1];
}

ssbClient(function (err, sbot) {
  let scutId;
  if (err) {
    throw err;
  }

  sbot.whoami(function (err, info) {
    const stream = sbot.createUserStream({ id: info.id });
    pull (stream, pull.collect((err, msgs) => {
      if (err) {
        sbot.close();
        throw err;
      }
      // Should probably add private messages, here.
      const json = JSON.stringify(msgs.map(m => m.value.content), null, 2);
      fs.open(outfile, 'w', (err, fd) => {
        if (err) {
          throw err;
        }
        fs.writeFileSync(fd, json);
      });
      sbot.close();
    }));
  });
});
