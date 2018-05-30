#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const util = require("util");
const posthtml = require("posthtml");
const inline = require(".");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readUtf8File = file => readFile(file).then(b => b.toString("utf8"));

const one = root => async filename => {
  const abs = path.join(root, filename);
  const html = await readUtf8File(abs);
  const result = await inline.process(html, { root, filename });

  await writeFile(abs, result.html);
};

const main = (root, ...files) => Promise.all(files.map(one(root)));

main(...process.argv.slice(2))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  });
