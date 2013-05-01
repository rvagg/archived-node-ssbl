const fs        = require('fs')
    , path      = require('path')
    , brucedown = require('brucedown')

    // for each file contents, split out the JSON header and return that
    // as a parsed spec and a body
var processOne = function (content, callback) {
      var json = ''

      // expect the header to contain a JSON block
      content = content.split('\n')
      if (/^```/.test(content[0]))
        content.shift() // optional && extraneous ```
      if (!/^\{/.test(content[0]))
        return callback(new Error('Not a JSON header: ' + content[0]))
      while (content.length && !/^\}/.test(content[0]))
        json += content.shift()
      json += content.shift()
      if (content.length && /^```/.test(content[0]))
        content.shift() // optional & extraneous ```

      try {
        json = JSON.parse(json)
      } catch (e) {
        return callback(new Error('JSON error: ' + e))
      }

      if (!json.date)
        return callback(new Error('no "date" property in spec'))
      json.date = new Date(json.date)

      brucedown(content.join('\n'), function (err, content) {
        if (err) return callback(err)
        callback(null, { spec: json, page: content })
      })
    }

    // for each file contents, process and return them all as a bunch
  , processAll = function (contents, callback) {
      var r = 0
      contents.forEach(function (content, i) {
        processOne(content, function (err, data) {
          if (err) {
            callback && callback(err)
            callback = null
            return
          }
          contents[i] = data
          if (++r == contents.length && callback) {
            contents = contents.sort(function (c1, c2) {
              return c1.spec.date < c2.spec.date ? 1 : -1
            })
            callback(null, contents)
          }
        })
      })
    }

    // load the contents of each file
  , load = function (files, callback) {
      var contents = []
      files.forEach(function (file) {
        fs.readFile(file, 'utf-8', function (err, content) {
          if (err) {
            callback && callback(err)
            callback = null
            return
          }
          contents.push(content.toString())
          if (contents.length == files.length && callback)
            processAll(contents, callback)
        })
      })
    }

  , builder = function (newsDir, callback) {
      // start off by listing files in the news directory
      fs.readdir(newsDir, function (err, list) {
        if (err) return callback(err)

        var files = []
          , r     = 0

        list.forEach(function (file) {
          file = path.join(newsDir, file)
          fs.stat(file, function (err, stat) {
            if (err) {
              callback && callback(err)
              callback = null
              return
            }
            if (stat.isFile() && /\.md$/.test(file))
              files.push(file)
            if (++r == list.length && callback)
              load(files, callback)
          })
        })
      })
    }

module.exports = builder