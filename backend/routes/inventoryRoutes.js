const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/inventory.json');

const readInventory = () => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeInventory = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET all products
router.get('/', (req, res) => {
    try {
        res.json(readInventory());
    } catch {
        res.status(500).json({ message: 'Failed to load inventory' });
    }
});

// POST create product
router.post('/', (req, res) => {
    try {
        const inventory = readInventory();
        const newProduct = { id: Date.now(), ...req.body };
        inventory.push(newProduct);
        writeInventory(inventory);
        res.status(201).json(newProduct);
    } catch {
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// PUT update product
router.put('/:id', (req, res) => {
    try {
        const inventory = readInventory();
        const idx = inventory.findIndex(p => p.id == req.params.id);
        if (idx === -1) return res.status(404).json({ message: 'Product not found' });

        inventory[idx] = {...inventory[idx], ...req.body };
        writeInventory(inventory);
        res.json(inventory[idx]);
    } catch {
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// DELETE product
router.delete('/:id', (req, res) => {
    try {
        const inventory = readInventory();
        const filtered = inventory.filter(p => p.id != req.params.id);
        if (filtered.length === inventory.length) return res.status(404).json({ message: 'Product not found' });

        writeInventory(filtered);
        res.json({ message: 'Product deleted' });
    } catch {
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

module.exports = router;