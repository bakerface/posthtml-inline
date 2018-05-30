# posthtml-inline
**Inline assets via CLI or PostHTML**

Just `npm install posthtml posthtml-inline` and add the following to your package.json:

``` json
{
  "scripts": {
    "build": "... your build command ...",
    "postbuild": "posthtml-inline dist index.html"
  }
}
```

You can also use as a PostHTML plugin like this:

``` javascript
const path = require('path');
const posthtml = require('posthtml');
const inline = require('posthtml-inline');

posthtml([
  inline({
    root: path.join(__dirname, 'dist')
  })
]).process(html);
```
