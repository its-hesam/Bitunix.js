const Bitunix = require('../src');

// Initialize the Bitunix client with your API credentials
const client = new Bitunix({ 
    apiKey: 'YOUR_API_KEY', 
    apiSecret: 'YOUR_API_SECRET' 
});

// Function to getAccount
async function GetAccount() 
{
    console.log('getAccount...');
    try 
    {
        const account = await client.getAccount();
        console.log('Account Info:', account);
    } 
    catch (error) 
    {
        console.error('Error in getAccount:', error.message);
    }
}

// Function to setting leverage
async function SetLeverage(symbol, leverage) 
{
    console.log(`setLevrage for ${ symbol } with leverage ${ leverage }...`);
    try 
    {
        const result = await client.setLevrage(symbol, leverage);
        console.log('Leverage set successfully:', result);
    } 
    catch (error) 
    {
        console.error('Error in setLevrage:', error.message);
    }
}

// Function to placing an order
async function OpenOrder() 
{
    console.log('openOrder...');
    const payload = {
        symbol: 'BTC',
        leverage: 10,
        marginType: 'CROSS', // or 'ISOLATED'
        margin: 100, // Margin in USDT
        side: 'BUY', // or 'SELL'
        type: 'MARKET', // or 'LIMIT'
        take_profit: [
            { price: 50000, percent: 50 },
            { price: 55000, percent: 50 },
        ],
        stop_loss: 45000, // Stop loss price
    };

    try 
    {
        await client.openOrder(payload);
        console.log('Order placed successfully!');
    }
    catch (error) 
    {
        console.error('Error in openOrder:', error.message);
    }
}

async function runTests() 
{
    console.log('Starting...');
    
    await GetAccount();
    await SetLeverage('BTC', 10);
    await OpenOrder();
    
    console.log('All completed.');
}


runTests().catch((error) => 
{
    console.error('Unexpected error:', error.message);
});
