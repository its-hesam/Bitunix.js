const axios = require('axios');

const {  
    validateApiCredentials,
    validateTakeProfits,
    validateMarginMode,
    validatePositionMode,
    validateLeverage,
    validateMargin,
    validateSymbol,
    validatePayload,
} = require('./utils/validate');
const { generateSignature , generateNonce } = require('./utils/signature');
const  delay  = require('./utils/delay');

const config = require('./config/config.json');

class Bitunix 
{
    constructor({ apiKey, apiSecret }) 
    {
        validateApiCredentials(apiKey, apiSecret);
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseUrl = config.baseUrl;
        this.api = axios.create({
            baseURL: this.baseUrl,
            headers:
                {
                    'api-key': this.apiKey,
                    'Content-Type': 'application/json',
                    'language': 'en-US',
                }
        });
    }
    
    async getAccount() 
    {
        try 
        {
            const endpoint = `${ config.endpoints.getAccount }`;
            const queryParams = {
                marginCoin : 'USDT' 
            };
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams,'', this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, {
                params: queryParams,
                headers: {
                    'sign': sign,
                    'timestamp': timestamp,
                    'nonce': nonce,
                },
            });
    
            return response.data;
        } 
        catch (error) 
        {
            throw new Error(`Failed to fetch balance: ${ error.message }`);
        }
    }
    async getPositions(symbol) 
    {
        try 
        {
            const endpoint = `${ config.endpoints.getPositions }`;
            const queryParams = {};
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams,'', this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, {
                params: queryParams,
                headers: {
                    'sign': sign,
                    'timestamp': timestamp,
                    'nonce': nonce,
                },
            });
    
            if (response.data.code === 0) 
            {
                if(symbol == null) 
                    return response.data.data;
                else
                {
                    const positions = response.data.data || [];
                    const position = positions.find(p => p.symbol === `${ symbol }USDT`);
                    return position?.positionId || null; 
                }
            } 
            else 
            {
                console.error('Error fetching positions:', response.data);
                return null;
            }
        } 
        catch (error) 
        {
            throw new Error(`Failed to fetch balance: ${ error.message }`);
        }
    }

    async getPositionHistory(symbol) 
    {
        try 
        {
            const endpoint = `${ config.endpoints.getPositionHistory }`;
            const queryParams = {};
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams,'', this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, {
                params: queryParams,
                headers: {
                    'sign': sign,
                    'timestamp': timestamp,
                    'nonce': nonce,
                },
            });
    
            if (response.data.code === 0) 
            {
                if(symbol == null) 
                    return response.data.data;
                else
                {
                    const positions = response.data.data || [];
                    const position = positions.find(p => p.symbol === `${ symbol }USDT`);
                    return position?.positionId || null; 
                }
            } 
            else 
            {
                console.error('Error fetching positions:', response.data);
                return null;
            }
        } 
        catch (error) 
        {
            throw new Error(`Failed to fetch balance: ${ error.message }`);
        }
    }

    async setLevrage(symbol , leverage) 
    {
        try 
        {
            validateSymbol(symbol);
            validateLeverage(leverage);
            const endpoint = `${ config.endpoints.setLevrage }`;
            const queryParams = {};
            const body = {
                symbol: `${ symbol }USDT`,
                leverage: leverage,
                marginCoin:'USDT'
            };
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams, body , this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            return response.data;
        } 
        catch (error) 
        {
            throw new Error(`Failed to Set Leverage: ${ error.message }`);
        }
    }

    async setMarginMode(symbol , mode) 
    {
        try 
        {
            validateSymbol(symbol);
            validateMarginMode(mode);
            const endpoint = `${ config.endpoints.setMarginMode }`;
            const queryParams = {};
            const body = {
                symbol: `${ symbol }USDT`,
                marginMode: `${ mode }`,
                marginCoin:'USDT'
            };
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams, body , this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            return response.data;
        } 
        catch (error) 
        {
            throw new Error(`Failed to Set Margin Mode: ${ error.message }`);
        }
    }

    async setPositionMode(symbol , mode) 
    {
        try 
        {
            validateSymbol(symbol);
            validatePositionMode(mode);
            const endpoint = `${ config.endpoints.setPositionMode }`;
            const queryParams = {};
            const body = {
                positionMode: `${ mode }`,
            };
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, queryParams, body , this.apiKey, this.apiSecret);


            const response = await this.api.get(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            return response.data;
        } 
        catch (error) 
        {
            throw new Error(`Failed to Set Position Mode: ${ error.message }`);
        }
    }

    async openTakeProfit(payload, takeProfit, index, inPositionQuantity, positionId) 
    {
        try 
        {
            const percentage = takeProfit.percent;
            if (typeof percentage !== 'number' || percentage <= 0) throw new Error(`Invalid percentage for take profit at index ${ index }`);
    
            const qty = (inPositionQuantity * (percentage / 100)).toFixed(6);
    
            const endpoint = `${ config.endpoints.takeProfit }`;
            const body = {
                symbol: `${ payload.symbol }USDT`,
                positionId: `${ positionId }`,
                tpPrice: `${ takeProfit.price }`, 
                tpQty: qty                    
            };
    
       
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, {}, body , this.apiKey, this.apiSecret);
    
           
            const response = await this.api.post(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            if (response.data.code === 0) 
            
                console.log(`Take Profit ${ index } set successfully`);
            else 
                console.log(response.data);
            
        } 
        catch (error) 
        {
            throw new Error(`Failed to Set Take Profits: ${ error.message }`);
        }
    }
    async openStopLoss(payload, inPositionQuantity, positionId) 
    {
        try 
        {
            const endpoint = `${ config.endpoints.openStopLoss }`;
            const body = {
                symbol: `${ payload.symbol }USDT`,
                positionId: `${ positionId }`,
                slPrice: `${ payload.stop_loss }`,   
                slQty: `${ inPositionQuantity }`     
            };
    
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, {}, body , this.apiKey, this.apiSecret);
           
            const response = await this.api.post(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            if (response.data.code === 0) 
                console.log('Stop Loss set successfully');
            else 
                console.log(response.data);
            
        } 
        catch (error) 
        {
            throw new Error(`Failed to Set Take Profits: ${ error.message }`);
        }
    }
    
    async placeOrder(payload , position_quantity) 
    {
        try 
        {
            const endpoint = `${ config.endpoints.placeOrder }`;
            const body = {
                symbol: `${ payload.symbol }USDT`,
                side: `${ payload.side }`,
                qty: `${ position_quantity }`,
                orderType: `${ payload.type }`,
                effect: 'GTC',
            };
    
            const nonce = generateNonce();
            const timestamp = new Date().getTime().toString();
            const sign = generateSignature(nonce, timestamp, {}, body , this.apiKey, this.apiSecret);
           
            const response = await this.api.post(endpoint, body, {
                headers: {
                    'time': timestamp,
                    'nonce': nonce,
                    'timestamp': timestamp,
                    'sign': sign,
                },
            });
    
            if (response.data.code === 0) 
                console.log('Order placed successfully');
            else 
                console.log(response.data);
            
        } 
        catch (error) 
        {
            throw new Error(`Failed to Place Order: ${ error.message }`);
        }
    }

    async openOrder(payload) 
    {
        try 
        {
            validatePayload(payload);
            await this.setLevrage(payload.symbol, payload.leverage);
            await this.setMarginMode(payload.symbol, payload.marginType);
            const marketPrice = await this.getMarketPrice(`${ payload.symbol }USDT`);
    
            if (!marketPrice)
            {
                console.error(`${ marketPrice }`);
                return;
            }
            const position_quantity = payload.margin / marketPrice;
            const order = await this.placeOrder(payload , position_quantity);
            if(order.code !== 0)
            {
                console.log(order);
                return;
            }
            else
            {
                await delay(5000);
                const position_Id = await this.getPositions(`${ payload.symbol }`);
       
                let index = 0; 
                for (const takeProfit of payload.take_profit) 
                {   
                    await this.openTakeProfit(payload, takeProfit, index, position_quantity, position_Id);
                    index++; 
                }
      
                await this.openStopLoss(payload, position_quantity, position_Id);
       
                console.log('Order placed successfully');
            }
        } 
        catch (error) 
        {
            throw new Error(`Failed to Place Order: ${ error.message }`);
        }
    }

}

module.exports = Bitunix;
