const tape       = require('tape')
    , ssbl       = require('./')
    , mkfiletree = require('mkfiletree')

tape('single file blog', function (t) {
  t.plan(3)

  mkfiletree.makeTemp(
      'singlefile'
    , { 'foobar.md': '{\n"name":"foo","date":"2013-01-02","title":"bar"\n}\nThis\n\nis\n\ncontent' }
    , function (err, dir) {
        t.notOk(err, 'no error')

        ssbl(dir, function (err, data) {
          t.notOk(err, 'no error')

          t.deepEqual(data, [{
              spec: { name: 'foo', date: new Date('2013-01-02'), title: 'bar' }
            , page: '<p>This</p>\n<p>is</p>\n<p>content</p>\n'
          }], 'parsed page data equal')

          t.end()
        })
      }
  )
})

tape('sorted multi-file blog', function (t) {
  t.plan(3)

  mkfiletree.makeTemp(
      'multifile'
    , {
          'a.md': '{\n"name":"foo1","date":"2013-01-02","title":"bar1"\n}\nThis\n\nis\n\ncontent 1'
        , 'b.md': '{\n"name":"foo2","date":"2012-01-02","title":"bar2"\n}\nThis\n\nis\n\ncontent 2'
        , 'c.md': '{\n"name":"foo3","date":"2013-02-02","title":"bar3"\n}\nThis\n\nis\n\ncontent 3'
      }
    , function (err, dir) {
        t.notOk(err, 'no error')

        ssbl(dir, function (err, data) {
          t.notOk(err, 'no error')

          t.deepEqual(data, [
              {
                  spec: { name: 'foo3', date: new Date('2013-02-02'), title: 'bar3' }
                , page: '<p>This</p>\n<p>is</p>\n<p>content 3</p>\n'
              }
            , {
                  spec: { name: 'foo1', date: new Date('2013-01-02'), title: 'bar1' }
                , page: '<p>This</p>\n<p>is</p>\n<p>content 1</p>\n'
              }
            , {
                  spec: { name: 'foo2', date: new Date('2012-01-02'), title: 'bar2' }
                , page: '<p>This</p>\n<p>is</p>\n<p>content 2</p>\n'
              }
          ], 'parsed page data equal')

          t.end()
        })
      }
  )
})