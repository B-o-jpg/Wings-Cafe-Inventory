const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/inventory.json');

// DELETE /api/inventory/:id  (we had earlier)
router.delete('/:id', (req, res) => { /*...*/ });

// PUT /api/inventory/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    const inventory = readInventory();
    const idx = inventory.findIndex(p => p.id == id);
    if (idx === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const updated = {
        ...inventory[idx],
        name: name !== undefined ? name : inventory[idx].name,
        category: category !== undefined ? category : inventory[idx].category,
        price: price !== undefined ? price : inventory[idx].price,
        quantity: quantity !== undefined ? quantity : inventory[idx].quantity
    };
    inventory[idx] = updated;
    writeInventory(inventory);
    res.json(updated);
});


// Utility to read and write JSON file
const readInventory = () => JSON.parse(fs.readFileSync(filePath));
const writeInventory = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// @route GET /api/inventory
router.get('/', (req, res) => {
    try {
        const inventory = readInventory();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: 'Failed to load inventory' });
    }
});

// @route POST /api/inventory
router.post('/', (req, res) => {
    try {
        const inventory = readInventory();
        const newProduct = {
            id: Date.now(),
            ...req.body
        };

        inventory.push(newProduct);
        writeInventory(inventory);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// @route PUT /api/inventory/:id
router.put('/:id', (req, res) => {
    try {
        const inventory = readInventory();
        const productIndex = inventory.findIndex(p => p.id == req.params.id);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        inventory[productIndex] = {...inventory[productIndex], ...req.body };
        writeInventory(inventory);
        res.json(inventory[productIndex]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// @route DELETE /api/inventory/:id
router.delete('/:id', (req, res) => {
    try {
        const inventory = readInventory();
        const updatedInventory = inventory.filter(p => p.id != req.params.id);

        if (inventory.length === updatedInventory.length) {
            return res.status(404).json({ message: 'Product not found' });
        }

        writeInventory(updatedInventory);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

module.exports = router;