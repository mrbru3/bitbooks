# ./bitcoind -testnet -walletnotify="~/./walletnotify.sh $s" -blocknotify="~/./blocknotify.sh $s"
data="{\"blockhash\":\"$1\"}"
curl -H "Accept: application/json" -H "Content-Type: application/json" -d $data -X POST http://localhost:3000/api/blockchain/blocknotify

#testnet.coinfaucet.eu for testingg the sending of crypto to an address
#electrum wallet apparently supports testnet bitcoin aswell