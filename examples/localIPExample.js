// Example of using the XTS Interactive API with a specific local IP address
// This uses axios with httpAgent/httpsAgent to ensure requests are bound to the specified local IP

var XTSInteractive = require('../lib/interactiveRestAPI');
var XTSInteractiveWS = require('../lib/interactiveSocket');
var config = require('./config/config.json');

let secretKey = config.secretKey;
let appKey = config.appKey;
let source = config.source;

// Specify your local IP address here
// This will bind all outgoing requests to this specific network interface
let localIP = '192.168.1.6'; // Replace with your actual local IP

var xtsInteractiveWS = null;

(async () => {
    // Create the instance of XTSRest with URL and localIP
    console.log(`Using local IP: ${localIP} for all requests`);
    console.log('All requests will be sent through this network interface\n');
    let accessToken = "4012:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI0OTc5NzU5NF8yOUY1ODE3QzE2RkExMTgxNDI5Mzc3IiwicHVibGljS2V5IjoiMjlmNTgxN2MxNmZhMTE4MTQyOTM3NyIsInVuaXF1ZUtleSI6Ijl1cjlDWkRzdHI1Ly9tMnM0QWR0NnlsNWFMNGRuSVhJa3gxbDFxSnZGcWxCSUY5YUtQZ2FkQkFGV2NsaW5qNm13ZFZ5YWVLbDNKVT0iLCJpc0ludGVyYWN0aXZlIjp0cnVlLCJpYXQiOjE3NjM1Nzk1NzUsImV4cCI6MTc2MzY2NTk3NX0.o9ePmPA2-qbbxnaNXd5J2n6ltqyxuMvQFcO0ESvNLsA"
    let userID = "49797594";
    let hostLookUpPort = accessToken.split(":")[0];
    accessToken = accessToken.split(":")[1];
    let url = `https://ttblaze.iifl.com:${hostLookUpPort}`;
    
    // Create REST API instance with local IP
    let xtsInteractive = new XTSInteractive(url, localIP);
    xtsInteractive.userID = userID;
    xtsInteractive.source = "WEBAPI";
    xtsInteractive.token = accessToken;
    xtsInteractive.isLoggedIn = true;        

    try {
        let resp = await xtsInteractive.getPositions({ dayOrNet: 'NetWise', clientID: userID, });
        console.log('✅ Fetched positions via local IP:', localIP);
        console.log('Positions:', resp);
    } catch (error) {
        console.error('❌ Error fetching positions via local IP:', localIP);
        console.error(error);
    }

    // Initialize WebSocket connection with local IP
    console.log('\n--- Initializing WebSocket with Local IP ---');
    xtsInteractiveWS = new XTSInteractiveWS(url, localIP);
    
    var socketInitRequest = {
      userID: userID,
      token: accessToken,
    };
    xtsInteractiveWS.init(socketInitRequest);

    // Register socket events
    await registerEvents();

//     let placeOrderRequest = {
//       exchangeSegment: 'NSECM',
//       exchangeInstrumentID: 22,
//       productType: 'NRML',
//       orderType: 'MARKET',
//       orderSide: 'BUY',
//       timeInForce: 'DAY',
//       disclosedQuantity: 0,
//       orderQuantity: 20,
//       limitPrice: 1500.0,
//       stopPrice: 1600.0,
//       orderUniqueIdentifier: '45485',
//       clientID: logIn.result.userID,
//     };

//     let orderResponse = await xtsInteractive.placeOrder(placeOrderRequest);
//     console.log('Order placed via local IP:', localIP);
//     console.log('Order response:', orderResponse);

//     // Logout
//     await xtsInteractive.logOut();
//     console.log('✅ Logged out');

})();

var registerEvents = async function () {
  console.log('Registering WebSocket event listeners...\n');

  //"connect" event listener
  xtsInteractiveWS.onConnect((connectData) => {
    console.log('✅ WebSocket connected via local IP:', localIP);
    console.log('Connect data:', connectData);
  });

  //"joined" event listener
  xtsInteractiveWS.onJoined((joinedData) => {
    console.log('✅ WebSocket joined successfully');
    console.log('Joined data:', joinedData);
  });

  //"error" event listener
  xtsInteractiveWS.onError((errorData) => {
    console.log('❌ WebSocket error:', errorData);
  });

  //"disconnect" event listener
  xtsInteractiveWS.onDisconnect((disconnectData) => {
    console.log('⚠️  WebSocket disconnected:', disconnectData);
  });

  //"order" event listener
  xtsInteractiveWS.onOrder((orderData) => {
    console.log('📦 Order update received:', orderData);
  });

  //"trade" event listener
  xtsInteractiveWS.onTrade((tradeData) => {
    console.log('💰 Trade update received:', tradeData);
  });

  //"position" event listener
  xtsInteractiveWS.onPosition((positionData) => {
    console.log('📊 Position update received:', positionData);
  });

  //"logout" event listener
  xtsInteractiveWS.onLogout((logoutData) => {
    console.log('👋 WebSocket logout:', logoutData);
  });
};

