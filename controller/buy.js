const swapExactTokensForTokens = require("../services/swap")

var gwei = 1000000000
var gasLimit = 310603

//function swap(accountName, fromAddress, toAddress, amountIn, amountOutMin, gasPrice, gasLimit)

buy = async () => {
    try {
        var swapResult = await swapExactTokensForTokens(
            "Tatar",    // accountName
            "0x094616f0bdfb0b526bd735bf66eca0ad254ca81f", //fromAddress =    // testnet WBNB
            "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47", //toAddress   =    //testnet BUSD
            String(1*(1000000000000000000) ),        // amountIn
            "",      // amountOutMin
            5*gwei,     // gasPrice
            gasLimit    // gasLimit
        )
        console.log( swapResult )
    }
    catch(err) {
        console.log(err)
    }
}


buy()