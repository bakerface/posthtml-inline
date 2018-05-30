const fs = require("fs");
const path = require("path");
const util = require("util");
const posthtml = require("posthtml");

const readFile = util.promisify(fs.readFile);
const readUtf8File = file => readFile(file).then(b => b.toString("utf8"));

const visitors = {
  _: () => () => Promise.resolve(),

  link: options => async node => {
    if (node.attrs.rel === "stylesheet" && node.attrs.href) {
      const abs = path.join(options.root, node.attrs.href);
      const content = await readUtf8File(abs);

      delete node.attrs.rel;
      delete node.attrs.href;

      node.tag = "style";
      node.content = [content];
    }
  },

  script: options => async node => {
    if (node.attrs.src) {
      const abs = path.join(options.root, node.attrs.src);
      const content = await readUtf8File(abs);

      delete node.attrs.src;
      node.content = [content];
    }
  }
};

const visit = options => node => {
  const custom = (options && options.visitors) || {};
  const fn = custom[node.tag] || visitors[node.tag] || custom._ || visitors._;

  return fn(options)(node);
};

const inline = options => tree => {
  const visitor = visit(options);
  const promises = [];

  tree.walk(node => {
    promises.push(visitor(node));
    return node;
  });

  return Promise.all(promises).then(() => tree);
};

inline.process = (html, options) => posthtml([inline(options)]).process(html);

module.exports = inline;
