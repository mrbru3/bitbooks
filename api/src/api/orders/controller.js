const Order = require('./model')
const Product = require('../products/model')

//For storing cached results
const request = require('request-promise-cache')

const bitcoin = require('bitcoinjs-lib')

//Environment variables
const config = require('../../configuration')


const coinservice = require('../../coinservice')
//xpub is the Account Extended public key for BIP44 you can generate on iancoleman.io/bip39
//this allows us to generate our addresses
const xpub = config.get('XPUB')

const isTestnet = config.get('TESTNET') === 'true'
const network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin

//idk bro he didnt explain in session 5
const root = bitcoin.bip32.fromBase58(xpub, bitcoin.networks.testnet)

async function getNewAddress() {

	//count is used to generate an address that hasnt been used
  const count = await Order.countDocuments()
  const node = root.derive(count)
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

async function getAmountForPrice(price) {
  const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
	//retrieve current price data and cache result
  const result = await request({
    url: url,
    cacheKey: url,
    cacheTTL: 15, //cache for 15 seconds
    cacheLimit: 24,
    resolveWithFullResponse: false
  })
  const response = JSON.parse(result)
  const rate = response["bpi"]["USD"]["rate_float"]
  return parseFloat(((price * 1e8) / (rate * 1e8)).toFixed(8))
}
//Generates a new order for a product
exports.create = async function({ price, productId } = {}) {
  const product = await Product.findById(productId)
  if (!product) { throw new Error('Invalid productId') }

	//convert USD to the crypto
  const amount = await getAmountForPrice(price)
	//generate a new address that should receive the crypto
	//using xpub instead of rpc for security reasons (rpcing to a hot wallet bad)
  const address = await getNewAddress()

  const order = await Order.create({
    paymentAddress: address,
    amount: amount,
    price: price,
    product: product
  })

  await coinservice.watchAddress({ address, order: order._id })
	//returns the order to the requester
  return order
}
