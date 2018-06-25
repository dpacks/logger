var dpackLogger = require('..')
var result = require('../result')
var chalk = require('chalk')

var views = [dLogHeaderView, dLogProgressView]
var dlog = dpackLogger(views)
dlog.use(trackDLogProgress)
dlog.render()

function dLogHeaderView (state) {
  return result(`
    Greetings Martian!
  `)
}

function dLogProgressView (state) {
  if (!state.seconds) return 'Not counting yet...'
  return result(`
    ${chalk.blue(state.seconds)} ${state.seconds === 1 ? 'second' : 'seconds'} (This line is going to be longer so we can test breaks.)
  `)
}

function trackDLogProgress (state, bus) {
  state.seconds = 0
  setInterval(function () {
    state.seconds++
    bus.emit('render')
    if (state.seconds === 5) {
      dlog.clear()
      console.log('All done')
      process.exit(0)
    }
  }, 1000)
}
