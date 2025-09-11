const express = require('express');
const router = express.Router();

let transactions = []; // Simple in-memory store for demo

// Get all transactions
router.get('/', (req, res) => {
    res.json(transactions);
});

// Create a new transaction
router.post('/', (req, res) => {
    const transaction = req.body;
    if (!transaction || !transaction.products || !transaction.customerId) {
        return res.status(400).json({ error: 'Invalid transaction data' });
    }
    transaction.id = Date.now().toString();
    transactions.push(transaction);
    res.status(201).json(transaction);
});

module.exports = router;