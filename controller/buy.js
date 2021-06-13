const swapExactTokensForTokens = require("../services/swap")

buy = async () => {
    try {
        await swapExactTokensForTokens(
            accountName = "top", 
            fromAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
            toAddress = "0xb899db682e6d6164d885ff67c1e676141deaaa40", // Onlyone
            amountIn = 300,
            amountOutMin = 50000,
            gasPrice = 5000000000,
            gasLimit = 290000
        )
    }
    catch(err) {
        console.log(err)
    }
}

buy()