const controller = require('./controller')

exports.onBlockUpdate = async function(ctx) {
  const blockhash = ctx.request.body.blockhash
  controller.onBlock(blockhash)
  ctx.status = 200
}

exports.onWalletUpdate = async function(ctx) {
  const txid = ctx.request.body.txid
  controller.onTransaction(txid)
  ctx.status = 200

}
//receives notifications from the sh scripts
exports.routes = function(router) {
  router.post('/blocknotify', this.onBlockUpdate) //new block created
  router.post('/walletnotify', this.onWalletUpdate) //wallet has received funds
  return router
}
