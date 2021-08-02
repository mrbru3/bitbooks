const controller = require('./controller')

exports.createOrder = async function(ctx) {
  ctx.body = await controller.create(ctx.request.body)
}
//ROUTE FOR CREATING AN ORDER
exports.routes = function(router) {
  router.post('/', this.createOrder)
  return router
}

