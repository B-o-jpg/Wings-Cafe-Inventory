// backend/server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
    origin: 'https://wings-cafe-inventory-qdwp.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ===== JSON file paths =====
const INVENTORY_FILE = './inventory.json';
const TRANSACTIONS_FILE = './transactions.json';
const CUSTOMERS_FILE = './customers.json';

// ===== Helper functions =====
function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ===== Welcome Routes =====
app.get("/", (req, res) => {
    res.send("Welcome to Wings Cafe Backend!");
});

app.get("/api", (req, res) => {
    res.send("Welcome to Wings Cafe");
});

// ===== Inventory / Products =====

// Get all products (inventory list)
app.get('/api/inventory', (req, res) => {
    const products = readJSON(INVENTORY_FILE);
    res.json(products);
});

// Get product by ID
app.get('/api/inventory/:id', (req, res) => {
    const products = readJSON(INVENTORY_FILE);
    const product = products.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// Update product
app.put('/api/inventory/:id', (req, res) => {
    const products = readJSON(INVENTORY_FILE);
    const index = products.findIndex(p => p.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    products[index] = {...products[index], ...req.body };
    writeJSON(INVENTORY_FILE, products);
    res.json(products[index]);
});

// Products (name + price only)
app.get('/api/products', (req, res) => {
    const products = readJSON(INVENTORY_FILE);
    res.json(products.map(p => ({ id: p.id, name: p.name, price: p.price })));
});

// ===== Transactions (Sales / Purchases) =====

// Get all transactions
app.get('/api/transactions', (req, res) => {
    const txs = readJSON(TRANSACTIONS_FILE);
    res.json(txs);
});

// Create transaction (sale/add stock)
app.post('/api/transactions', (req, res) => {
    const { productId, type, quantity } = req.body;
    if (!productId || !type || quantity <= 0)
        return res.status(400).json({ message: 'Invalid transaction' });

    const products = readJSON(INVENTORY_FILE);
    const product = products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update product quantity
    let newQuantity = product.quantity;
    if (type === 'add') newQuantity += quantity;
    else if (type === 'deduct') newQuantity -= quantity;
    if (newQuantity < 0) newQuantity = 0;

    product.quantity = newQuantity;
    writeJSON(INVENTORY_FILE, products);

    // Record transaction
    const txs = readJSON(TRANSACTIONS_FILE);
    const newTx = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        quantity,
        type,
        date: new Date().toISOString(),
    };
    txs.push(newTx);
    writeJSON(TRANSACTIONS_FILE, txs);

    res.json(newTx);
});

// Sales only
app.get('/api/sales', (req, res) => {
    const txs = readJSON(TRANSACTIONS_FILE);
    const sales = txs.filter(tx => tx.type === 'deduct');
    res.json(sales);
});

// ===== Reports =====
app.get('/api/reports', (req, res) => {
    const txs = readJSON(TRANSACTIONS_FILE);
    const products = readJSON(INVENTORY_FILE);

    const totalSales = txs
        .filter(tx => tx.type === 'deduct')
        .reduce((sum, tx) => {
            const product = products.find(p => p.id === Number(tx.productId));
            const price = Number(product ? product.price : 0);
            const qty = Number(tx.quantity || 0);
            return sum + price * qty;
        }, 0);

    const stockValue = products.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.price || 0)), 0);

    res.json({
        totalSales,
        stockValue,
        totalProducts: products.length,
        totalTransactions: txs.length
    });
});

// ===== Customers =====
app.get('/api/customers', (req, res) => {
    const customers = readJSON(CUSTOMERS_FILE);
    res.json(customers);
});

app.post('/api/customers', (req, res) => {
    const customers = readJSON(CUSTOMERS_FILE);
    const newCustomer = { id: Date.now(), ...req.body };
    customers.push(newCustomer);
    writeJSON(CUSTOMERS_FILE, customers);
    res.json(newCustomer);
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));