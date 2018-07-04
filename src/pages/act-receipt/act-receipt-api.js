
module.exports = function worker (self) {
  self.addEventListener('message', (event) => {
    let guestPaid = event.data[0].guest_paid
    let guestRefund = event.data[0].guest_refund

    self.postMessage([ guestPaid, guestRefund ])
  })
}
