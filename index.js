var Diffy = require('diffy')
var trim = require('diffy/trim')
var nanobus = require('nanobus')
var throttle = require('lodash.throttle')

module.exports = dpackLogger

function dpackLogger (views, dLogOpts) {
  if (!views) throw new Error('dpack-logger: view required')
  if (!Array.isArray(views)) views = [views]
  if (!dLogOpts) dLogOpts = {}

  var dlogpace = dLogOpts.dlogpace || 250
  var dlogstatus = dLogOpts.dlogstatus || {}
  var clientful = Diffy(dLogOpts)
  var bus = nanobus()

  var dpackEntry = require('diffy/input')(dLogOpts)

  bus.on('render', throttle(render, dlogpace))
  bus.render = render
  bus.clear = clear

  clientful.on('resize', render)
  dpackEntry.on('ctrl-c', function () {
    render()
    if (bus.listeners('exit').length === 0) return process.exit()
    bus.emit('exit')
  })

  return {
    dpackEntry: dpackEntry,
    trim: trim,
    render: render,
    clear: clear,
    use: function (cb) {
      cb(dlogstatus, bus)
    }
  }

  function clear () {
    clientful.render(function () { return '' })
    process.nextTick(render)
  }

  function render () {
    if (dLogOpts.quiet) return
    clientful.render(function () {
      if (views.length === 1) return views[0](dlogstatus)
      return views.map(function (view) {
        return view(dlogstatus)
      }).join('\n')
    })
  }
}
