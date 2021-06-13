var fs = require('fs')
var Tx = require('ethereumjs-tx').Transaction
var Web3 = require('web3')
var Common = require('ethereumjs-common').default

var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
var BSC_FORK = Common.forCustomChain(
  'mainnet',
  {
    name: 'Binance Smart Chain Mainnet',
    networkId: 56,
    chainId: 56,
    url: 'https://bsc-dataseed.binance.org/'
  },
  'istanbul',
)

const pancakeSwapRouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'
const routerAbi = JSON.parse(fs.readFileSync('pancake-router-abi.json', 'utf-8'))

const accountInfo = JSON.parse(fs.readFileSync('accounts.json', 'utf-8'))

// account: wallet that has fromAddress coin
// Swapping fromAddress to toAddress
function swap(accountName, fromAddress, toAddress, amountIn, amountOutMin, gasPrice, gasLimit) {

  const account = accountInfo[accountName]
  
  const contract = new web3.eth.Contract(
    routerAbi, 
    pancakeSwapRouterAddress, 
    { 
      from: targetAccount.address
    }
  )

  const data = contract.methods.swapExactTokensForTokens(
    web3.utils.toHex(amountIn), // number of token we want to trade in
    web3.utils.toHex(amountOutMin), // minimum tokens we require out of this transaction
    [ fromAddress, toAddress ], // paths
    account.address, // specify account
    web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 20) // deadline transaction
  )

  const txCount = await web3.eth.getTransactionCount(account.address) 
  const rawTransaction = {
    "from": account.address,
    "gasPrice": web3.utils.toHex(gasPrice),
    "gasLimit": web3.utils.toHex(gasLimit),
    "to": pancakeSwapRouterAddress,
    "value": web3.utils.toHex(amountIn),
    "data": data.encodeABI(),
    "nonce": web3.utils.toHex(txCount)
  }

  const transaction = new Tx(
    rawTransaction, 
    {
      "common": BSC_FORK
    }
  )
  privateKey = Buffer.from(account.privateKey.slice(2), 'hex')
  transaction.sign(privateKey)

  const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
  return result

}

exports.defualt = swap