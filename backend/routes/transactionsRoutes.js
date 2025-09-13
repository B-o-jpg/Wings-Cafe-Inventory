const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const transactionsFile = path.join(__dirname, '../data/transactions.json');
const inventoryFile = path.join(__dirname, '../data/inventory.json');

const readTransactions = () => JSON.parse(fs.readFileSync(transactionsFile, 'utf8'));
const writeTransactions = (data) => fs.writeFileSync(transactionsFile, JSON.stringify(data, null, 2));
const readInventory = () => JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
const writeInventory = (data) => fs.writeFileSync(inventoryFile, JSON.stringify(data, null, 2));

// GET all transactions
router.get('/', (req, res) => {
    res.json(readTransactions());
});

// POST new transaction
router.post('/', (req, res) => {
    try {
        const { productId, type, quantity } = req.body;
        if (!productId || !type || !quantity) return res.status(400).json({ message: 'Invalid transaction' });

        const inventory = readInventory();
        const product = inventory.find(p => p.id == productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.quantity = type === 'deduct' ? Math.max(product.quantity - quantity, 0) : product.quantity + quantity;
        writeInventory(inventory);

        const transactions = readTransactions();
        const newTx = { id: Date.now(), productId, type, quantity, timestamp: new Date().toISOString(), productName: product.name };
        transactions.push(newTx);
        writeTransactions(transactions);

        res.status(201).json(newTx);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create transaction' });
    }
});

module.exports = router;