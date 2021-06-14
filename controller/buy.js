const swapExactTokensForTokens = require("../services/swap")

var gwei = 1000000000
var gasLimit = 310603

//function swap(accountName, fromAddress, toAddress, amountIn, amountOutMin, gasPrice, gasLimit)

buy = async () => {
    try {
        var swapResult = await swapExactTokensForTokens(
            "Tatar",    // accountName
            "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", //fromAddress =    // testnet WBNB
            "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47", //toAddress   =    //testnet BUSD
            String(1*(1000000000000000000) ),        // amountIn
            "0",      // amountOutMin
            15*gwei,     // gasPrice
            gasLimit,    // gasLimit
            "pancakeTestnet"
        )
        console.log( swapResult )
    }
    catch(err) {
        console.log(err)
    }
}


buy()