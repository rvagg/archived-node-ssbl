# Super Simple Blog Loader for Node.js [![Build Status](https://secure.travis-ci.org/rvagg/node-ssbl.png)](http://travis-ci.org/rvagg/node-ssbl)

Load markdown formatted blog files from a folder as a handy data structure for rendering. *Available in npm as <strong>ssbl</strong>*.

Each file represents a post. Post metadata is stored in JSON at the head of each file (complete with optional <code>```</code>'s if you want it to nicely viewable on GitHub).

## Example

Given two files in a directory:

### myfirstpost.md

```
{
    "author" : "Rod Vagg"
  , "date"   : "2012-10-01"
  , "title"  : "My first post!"
}

This is my first post on my blog! How'd you like it?

### It's in Markdown too!

You can put **Markdown** in your *posts* and [links](https://github.com/rvagg/node-ssbl) too!
```

### w00t.md

```
{
    "author" : "Rod Vagg"
  , "date"   : "2013-10-01"
  , "title"  : "Sorry..."
}

So... it turns out I'm not so great at this blogging thing and I haven't posted in a year so I might just give up eh?
```

And the following code:

```js
const ssbl = require('./')
ssbl('./example'), function (err, data) {
  if (err) throw err
  console.log(JSON.stringify(data, null, 2))
})
```

You'll see this:

```json
[
  {
    "spec": {
      "author": "Rod Vagg",
      "date": "2013-10-01T00:00:00.000Z",
      "title": "Sorry..."
    },
    "page": "<p>So... it turns out I&#39;m not so great at this blogging thing and I haven&#39;t posted in a year so I might just give up eh?</p>\n"
  },
  {
    "spec": {
      "author": "Rod Vagg",
      "date": "2012-10-01T00:00:00.000Z",
      "title": "My first post!"
    },
    "page": "<p>This is my first post on my blog! How&#39;d you like it?</p>\n<h3>It&#39;s in Markdown too!</h3>\n<p>You can put <strong>Markdown</strong> in your <em>posts</em> and <a href=\"https://github.com/rvagg/node-ssbl\">links</a> too!</p>\n"
  }
]
```

What you do with it from there is up to you. The data structure is ideal for passing through a templating engine.

This example is in the [examples](./examples/) directory.

## API

`ssbl(path, callback)` will give you a data structure representing the given path to a directory containing Markdown files. The data will be returned in order of the `date` property in the metadata of each post, descending.

Only files ending in *.md* will be considered and only one level deep will be scanned.

## Metadata

Currently your metadata must be valid JSON and have the opening `{` and `}` on separate lines by themselves. The only other restriction beyond that is that the metadata contain a `"date"` property because it's used for sorting. Generally you'd need at least an `"author"` and a `"title"` but it's totally up to you and will depend on how you need to present it. The JSON object will be placed in the `"spec"` property of each element of the returned array with the page contents below the metadata in the `"page"` property.

If a post has metadata and a `"draft"` field is truthy then it will be excluded from the list of posts.

## Markdown

The markdown is processed with [Brucedown](https://github.com/rvagg/node-brucedown) which used [Marked](https://github.com/chjj/marked) to parse the Markdown (in GFM by default) and [Pygments](http://pygments.org/) for syntax highlighting in exactly the same manner as GitHub.

## Licence

Super Simple Blog Loader for Node.js is Copyright (c) 2015 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
