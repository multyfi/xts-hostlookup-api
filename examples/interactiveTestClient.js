//Accessing the Interactive and WS from node-xts-interactive-api library

var XTSInteractive = require('xts-interactive-api').Interactive;
var XTSInteractiveWS = require('xts-interactive-api').WS;

var config = require('./config/config.json');

let userID = config.userID;
let password = config.password;
let publicKey = config.publicKey;
let source = config.source;
let url = config.url;


//xtsInteractive for API calls and xtsInteractiveWS for events related functionality
var xtsInteractive = null;
var xtsInteractiveWS = null;

(async () => {

    //creating the instance of XTSRest
    xtsInteractive = new XTSInteractive(url);

    //calling the logIn API
    var loginRequest = {
        userID,
        password,
        publicKey,
        source
    }
    let logIn = await xtsInteractive.logIn(loginRequest);

    // checking for valid loginRequest
    if (logIn && logIn.type == xtsInteractive.responseTypes.success) {

        //creating the instance of XTSInteractiveWS
        xtsInteractiveWS = new XTSInteractiveWS(url);

        //Instantiating the socket instance
        var socketInitRequest = {
            userID: userID,
            token: logIn.result.token   // Token Generated after successful LogIn
        }
        xtsInteractiveWS.init(socketInitRequest);

        //Registering the socket Events
        await registerEvents();

        //calling the remaining methods of the Interactive API
        testAPI();

    } else {
        //In case of failure
        console.error(logIn);
    }
})();





async function testAPI() {

    await getBalance();

    await getProfile();

    let positionRequest = {
        dayOrNet: xtsInteractive.dayOrNet.DAY
    }

    await getPositions(positionRequest);

    await getHoldings();

    await getOrderBook();

    await getTradeBook();

    let placeOrderRequest = {
        exchangeSegment: xtsInteractive.exchangeInfo.NSECM,
        exchangeInstrumentID: 22,
        productType: xtsInteractive.productTypes.MIS,
        orderType: xtsInteractive.orderTypes.Limit,
        orderSide: xtsInteractive.orderSide.BUY,
        timeInForce: xtsInteractive.dayOrNet.DAY,
        disclosedQuantity: 0,
        orderQuantity: 20,
        limitPrice: 1500.00,
        stopPrice: 1600.00,
        orderUniqueIdentifier: "45485"
    }

    await placeOrder(placeOrderRequest);

    let modifyOrderRequest = {
        appOrderID: 1991237756,
        modifiedProductType: xtsInteractive.productTypes.NRML,
        modifiedOrderType: xtsInteractive.orderTypes.Limit,
        modifiedOrderQuantity: 100,
        modifiedDisclosedQuantity: 0,
        modifiedLimitPrice: 300,
        modifiedStopPrice: 300,
        modifiedTimeInForce: xtsInteractive.dayOrNet.DAY,
        orderUniqueIdentifier: "5656"
    }

    await modifyOrder(modifyOrderRequest);

    let cancelOrderRequest = {
        appOrderID: 1828071433,
        orderUniqueIdentifier: 155151
    }

    await cancelOrder(cancelOrderRequest);

    let placeCoverOrderRequest = {
        exchangeSegment: xtsInteractive.exchangeInfo.NSECM,
        exchangeInstrumentID: 22,
        orderSide: xtsInteractive.orderSide.BUY,
        orderQuantity: 2,
        disclosedQuantity: 2,
        limitPrice: 2054,
        stopPrice: 2054,
        orderUniqueIdentifier: "45485"
    }

    await placeCoverOrder(placeCoverOrderRequest);

    await exitCoverOrder("2426016103");

    let positionConversionRequest = {
        appOrderID: 1991237756,
        executionID: 1556,
        oldProductType: xtsInteractive.productTypes.NRML,
        newProductType: xtsInteractive.productTypes.MIS
    }

    await positionConversion(positionConversionRequest);

    let squareOffRequest = {
        exchangeSegment: xtsInteractive.exchangeInfo.NSECM,
        exchangeInstrumentID: 22,
        productType: xtsInteractive.productTypes.NRML,
        squareoffMode: xtsInteractive.positionSqureOffMode.DayWise,
        positionSquareOffQuantityType: xtsInteractive.positionSquareOffQuantityType.ExactQty,
        squareOffQtyValue: 5
    }

    await squareOff(squareOffRequest);
}



var getBalance = async function () {

    let response = await xtsInteractive.getBalance();
    console.log(response);
    return response;

}

var getProfile = async function () {

    let response = await xtsInteractive.getProfile();
    console.log(response);
    return response;

}

var getPositions = async function (positionRequest) {

    let response = await xtsInteractive.getPositions(positionRequest);
    console.log(response);
    return response;

}

var getHoldings = async function () {

    let response = await xtsInteractive.getHoldings();
    console.log(response);
    return response;

}

var getOrderBook = async function () {

    let response = await xtsInteractive.getOrderBook();
    console.log(response);
    return response;

}

var getTradeBook = async function () {

    let response = await xtsInteractive.getTradeBook();
    console.log(response);
    return response;

}

var placeOrder = async function (placeOrderRequest) {

    let response = await xtsInteractive.placeOrder(placeOrderRequest);
    console.log(response);
    return response;

}

var modifyOrder = async function (modifyOrderRequest) {

    let response = await xtsInteractive.modifyOrder(modifyOrderRequest);
    console.log(response);
    return response;

}

var cancelOrder = async function (cancelOrderRequest) {

    let response = await xtsInteractive.cancelOrder(cancelOrderRequest);
    console.log(response);
    return response;

}

var placeCoverOrder = async function (placeCoverOrderRequest) {

    let response = await xtsInteractive.placeCoverOrder(placeCoverOrderRequest);
    console.log(response);
    return response;

}

var exitCoverOrder = async function (appOrderID) {

    let response = await xtsInteractive.exitCoverOrder(appOrderID);
    console.log(response);
    return response;

}

var positionConversion = async function (positionConversionRequest) {

    let response = await xtsInteractive.positionConversion(positionConversionRequest);
    console.log(response);
    return response;

}

var squareOff = async function (squareOffRequest) {

    let response = await xtsInteractive.squareOff(squareOffRequest);
    console.log(response);
    return response;

}

var registerEvents = async function () {


    //instantiating the listeners for all event related data

    //"connect" event listener
    xtsInteractiveWS.onConnect((connectData) => {
    
        console.log(connectData);
    
    });

    //"joined" event listener
    xtsInteractiveWS.onJoined((joinedData) => {
    
        console.log(joinedData);
    
    });

    //"error" event listener
    xtsInteractiveWS.onError((errorData) => {
    
        console.log(errorData);
    
    });

    //"disconnect" event listener
    xtsInteractiveWS.onDisconnect((disconnectData) => {
    
        console.log(disconnectData);
    
    });

    //"order" event listener
    xtsInteractiveWS.onOrder((orderData) => {
    
        console.log(orderData);
    
    });

    //"trade" event listener
    xtsInteractiveWS.onTrade((tradeData) => {
    
        console.log(tradeData);
    
    });

    //"position" event listener
    xtsInteractiveWS.onPosition((positionData) => {
    
        console.log(positionData);
    
    });

    //"logout" event listener
    xtsInteractiveWS.onLogout((logoutData) => {

        console.log(logoutData);
    
    });
}