const ssbClient = require('ssb-client');
const pull = require('pull-stream');

ssbClient(function (err, sbot) {
  if (err) {
    throw err;
  }

  pull(
    sbot.messagesByType({ type: 'contact' }),
    pull.collect(function (err, msgs) {
      if (err) {
        throw err;
      }

      const blocks = {};
      console.log(`${new Date()} - ${msgs.length}`);
      const blockMsgs = msgs.forEach(function(m) {
        const content = m.value.content;
        const who = content.contact;
        
        if (!blocks[who]) {
          blocks[who] = {
            follow: 0,
            block: 0,
          };
        }

        if (content.blocking) {
          blocks[who].block += 1;
        } else if (content.following) {
          blocks[who].follow += 1;
        }
      });
      const sorted = Object.keys(blocks)
        .filter(b => blocks[b].block > 0)
        .sort((a, b) => {
          return blocks[b].block / (blocks[b].follow + 1) - blocks[a].block / (blocks[a].follow + 1);
        })
        .forEach(function(u) {
          console.log(`${blocks[u].block} / ${blocks[u].follow} times, ${u}`);
          try {
            pull(
              sbot.links({
                source: u,
                dest: u,
                rel: 'about',
                values: true,
              }),
              pull.collect((err, profiles) => {
                const names = [];
                if (err) {
                  return;
                }

                profiles.forEach(function(p) {
                  const content = p.value.content;
                  if (content.name) {
                    names.push(content.name);
                  }
                });
                blocks[u].names = names;
                console.log(`${blocks[u].block} / ${blocks[u].follow} times, ${u}:`);
                console.log(` --> [${names.join(', ')}]`);
              }));
          } catch(e) {
            console.log(` --> ${blocks[u].block} / ${blocks[u].follow} times, ${u}`);
          }
      });
    })
  );
//  sbot.close();
});

