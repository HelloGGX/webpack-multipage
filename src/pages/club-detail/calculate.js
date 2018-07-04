module.exports = function worker (self) {
  self.addEventListener('message', (event) => {
    let num = 0
    let acts = event.data[0].club_acts
    let len = acts.length
    for (let i = 0; i < len; i++) {
      num += acts[i].apply_num
    }
    self.postMessage([num])
  })
}
