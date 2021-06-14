var fs = require('fs')
var Tx = require('ethereumjs-tx').Transaction
var Web3 = require('web3')
var Common = require('ethereumjs-common').default


const routerAbi = JSON.parse(fs.readFileSync('./config/pancake-router-abi.json', 'utf-8'))
const accountInfo = JSON.parse(fs.readFileSync('./config/accounts.json', 'utf-8'))

// account: wallet that has fromAddress coin
// Swapping fromAddress to toAddress
async function swapExactTokensForTokens(accountName, fromAddress, toAddress, amountIn, amountOutMin, gasPrice, gasLimit, network) {
  let web3
  let pancakeSwapRouterAddress
  let BSC_FORK


  if(network == 'pancake'){
    pancakeSwapRouterAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e'
    web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
    BSC_FORK = Common.forCustomChain(
      'mainnet',
      {
        name: 'Binance Smart Chain Mainnet',
        networkId: 56,
        chainId: 56,
        url: 'https://bsc-dataseed.binance.org/'
      },
      'istanbul',
    )
  }
  else if(network == 'pancakeTestnet'){
    pancakeSwapRouterAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
    web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'))
    BSC_FORK = Common.forCustomChain(
     'mainnet',
     {
       name: 'BSC testnet',
       networkId: 97,
       chainId: 97,
       url: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
     },
     'istanbul',
   )
  }
  else{
    console.err("WRONG NETWORK")
  }


  const account = accountInfo[accountName]

  const contract = new web3.eth.Contract(
    routerAbi,

    pancakeSwapRouterAddress,
    { 
      from: account.address
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
      "common": BSC_FORK  // CHECK THIS
    }
  )
  let privateKeyBuffer = Buffer.from(account.privateKey, 'hex')
  transaction.sign(privateKeyBuffer)
  const result = await web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
  return result

}

module.exports = swapExactTokensForTokens