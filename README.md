<p align="center">
  <img src="https://support.bitunix.com/hc/theming_assets/01HZM57E1CK7E4CX9CH5H4ZR5J" alt="Bitunix Logo" width="200"/>
</p>

<h1 align="center">Bitunix - A Comprehensive Trading API Wrapper</h1>

**Bitunix** is an NPM package designed to simplify interactions with trading APIs. This package provides a high-level abstraction for managing accounts, positions, orders, and risk parameters while ensuring data validation and signature generation for secure API communication.

---

## Features

- **Account Management**: Fetch account details, balance, and positions.
- **Position Management**: Retrieve current positions and historical data.
- **Order Placement**: Place market orders, set leverage, margin modes, take profits, and stop losses.
- **Risk Management**: Validate inputs and enforce trading rules.
- **Secure Communication**: Generate signatures and nonces for API requests.
- **Easy Integration**: Configure and use with minimal setup.

---

## Installation

To install the package, run:
```bash
npm install bitunix
```

---

## Configuration

The package requires a configuration file for endpoints and base URL. Update `src/config/config.json` with your API details:
```json
{
  "baseUrl": "https://api.example.com",
  "endpoints": {
    "getAccount": "/v1/account",
    "getPositions": "/v1/positions",
    "getPositionHistory": "/v1/positions/history",
    "setLevrage": "/v1/leverage",
    "setMarginMode": "/v1/margin/mode",
    "setPositionMode": "/v1/position/mode",
    "takeProfit": "/v1/orders/take-profit",
    "openStopLoss": "/v1/orders/stop-loss",
    "placeOrder": "/v1/orders"
  }
}
```

---

## Usage

### 1. **Initialization**

Create an instance of the `Bitunix` class by passing your API credentials:
```javascript
const Bitunix = require('bitunix');

const bitunix = new Bitunix({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
});
```

### 2. **Fetch Account Information**
```javascript
(async () => {
  try {
    const account = await bitunix.getAccount();
    console.log(account);
  } catch (error) {
    console.error(error.message);
  }
})();
```

### 3. **Retrieve Current Positions**
```javascript
(async () => {
  try {
    const positions = await bitunix.getPositions('BTC');
    console.log(positions);
  } catch (error) {
    console.error(error.message);
  }
})();
```

### 4. **Set Leverage**
```javascript
(async () => {
  try {
    const response = await bitunix.setLevrage('BTC', 10);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
})();
```

### 5. **Place an Order**
```javascript
(async () => {
  try {
    const payload = {
      symbol: 'BTC',
      side: 'BUY',
      type: 'MARKET',
      margin: 100,
      leverage: 10,
      marginType: 'isolated',
      stop_loss: 40000,
      take_profit: [
        { price: 45000, percent: 50 },
        { price: 47000, percent: 50 },
      ],
    };

    await bitunix.openOrder(payload);
  } catch (error) {
    console.error(error.message);
  }
})();
```

---

## Methods

### **1. Constructor**
```javascript
constructor({ apiKey, apiSecret })
```
Initializes the Bitunix client.

### **2. getAccount**
```javascript
async getAccount()
```
Fetch account details.

### **3. getPositions**
```javascript
async getPositions(symbol)
```
Retrieve positions for a specific symbol. If no symbol is provided, returns all positions.

### **4. setLevrage**
```javascript
async setLevrage(symbol, leverage)
```
Set the leverage for a specific symbol.

### **5. setMarginMode**
```javascript
async setMarginMode(symbol, mode)
```
Set the margin mode (e.g., isolated or cross).

### **6. setPositionMode**
```javascript
async setPositionMode(symbol, mode)
```
Set the position mode (e.g., single or dual).

### **7. openOrder**
```javascript
async openOrder(payload)
```
Places an order and configures stop loss and take profit levels.

---

## Error Handling
All methods throw descriptive errors when operations fail. Wrap your calls in try-catch blocks to handle errors gracefully.

```javascript
try {
  const result = await bitunix.getAccount();
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Cloning the Repository
```bash
git clone https://github.com/your-repo/bitunix.git
cd bitunix
```

### Running Locally
Install dependencies:
```bash
npm install
```

Run tests (if any):
```bash
npm test
```

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with improvements or fixes.

---

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Author

**Your Name**  
Email: [your.email@example.com](mailto:your.email@example.com)  
GitHub: [your-github-profile](https://github.com/your-github-profile)  
Twitter: [your-twitter-handle](https://twitter.com/your-twitter-handle)

---

## Acknowledgments
Special thanks to the developers and the open-source community for their valuable tools and contributions.

