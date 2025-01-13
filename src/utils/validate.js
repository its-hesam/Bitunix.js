
function validateApiCredentials(apiKey, apiSecret) 
{
    if (!apiKey || !apiSecret) 
        throw new Error('API key and secret are required.');
}


function validateTakeProfits(takeProfits) 
{
    if (!Array.isArray(takeProfits) || takeProfits.length === 0) 
        throw new Error('Take profits must be a non-empty array.');

    takeProfits.forEach((tp, index) => 
    {
        if (typeof tp.price !== 'number' || tp.price <= 0) 
            throw new Error(`Invalid price in take profit at index ${ index }`);
        if (typeof tp.percent !== 'number' || tp.percent <= 0 || tp.percent > 100) 
            throw new Error(`Invalid percentage in take profit at index ${ index }`);
    });
}


function validateMarginMode(mode) 
{
    const validModes = ['CROSS', 'ISOLATED'];
    if (!validModes.includes(mode)) 
        throw new Error(`Invalid margin mode: ${ mode }. Valid modes are: ${ validModes.join(', ') }`);
}


function validatePositionMode(mode) 
{
    const validModes = ['ONE_WAY', 'HEDGE'];
    if (!validModes.includes(mode)) 
        throw new Error(`Invalid position mode: ${ mode }. Valid modes are: ${ validModes.join(', ') }`);
}

// اعتبارسنجی مقدار Leverage
function validateLeverage(leverage) 
{
    if (typeof leverage !== 'number' || leverage <= 0 || leverage > 100) 
        throw new Error(`Invalid leverage: ${ leverage }. Leverage must be a number between 1 and 100.`);
}

// اعتبارسنجی مقدار Margin
function validateMargin(margin) 
{
    if (typeof margin !== 'number' || margin <= 0) 
        throw new Error(`Invalid margin: ${ margin }. Margin must be a positive number.`);
}

// اعتبارسنجی مقدار Symbol
function validateSymbol(symbol) 
{
    if (typeof symbol !== 'string' || !/^[A-Z]{2,10}$/.test(symbol)) 
        throw new Error(`Invalid symbol: ${ symbol }. Symbol must be an uppercase string (e.g., BTC, ETH).`);
}


function validatePayload(payload) 
{
    if (!payload || typeof payload !== 'object') 
        throw new Error('Payload must be a valid object.');

    validateSymbol(payload.symbol);
    validateLeverage(payload.leverage);
    validateMarginMode(payload.marginType);
    validatePositionMode(payload.positionMode);
    validateMargin(payload.margin);
    validateTakeProfits(payload.take_profit);

    if (!['BUY', 'SELL'].includes(payload.side)) 
        throw new Error(`Invalid side: ${ payload.side }. Valid sides are: BUY, SELL.`);

    if (!['LIMIT', 'MARKET'].includes(payload.type)) 
        throw new Error(`Invalid order type: ${ payload.type }. Valid types are: LIMIT, MARKET.`);
}

module.exports = {
    validateApiCredentials,
    validateTakeProfits,
    validateMarginMode,
    validatePositionMode,
    validateLeverage,
    validateMargin,
    validateSymbol,
    validatePayload,
};
