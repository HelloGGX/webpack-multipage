
module.exports = function worker (self) {
  self.addEventListener('message', (event) => {
    let num = 0
    let guestPaid = event.data[0].user_club_info
    let len = guestPaid.length
    for (let i = 0; i < len; i++) {
      num += guestPaid[i].club_star
    }
    self.postMessage([num])
  })
}
