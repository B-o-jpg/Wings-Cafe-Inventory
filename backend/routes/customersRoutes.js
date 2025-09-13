const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const customersFile = path.join(__dirname, '../data/customers.json');

const readCustomers = () => JSON.parse(fs.readFileSync(customersFile, 'utf8'));
const writeCustomers = (data) => fs.writeFileSync(customersFile, JSON.stringify(data, null, 2));

// GET all customers
router.get('/', (req, res) => {
    try {
        res.json(readCustomers());
    } catch {
        res.status(500).json({ message: 'Error reading customers' });
    }
});

// POST create customer
router.post('/', (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) return res.status(400).json({ message: 'All fields required' });

        const customers = readCustomers();
        const newCustomer = { id: Date.now(), name, email, phone };
        customers.push(newCustomer);
        writeCustomers(customers);
        res.status(201).json(newCustomer);
    } catch {
        res.status(500).json({ message: 'Error creating customer' });
    }
});

// PUT update customer
router.put('/:id', (req, res) => {
    try {
        const customers = readCustomers();
        const idx = customers.findIndex(c => c.id == req.params.id);
        if (idx === -1) return res.status(404).json({ message: 'Customer not found' });

        customers[idx] = {...customers[idx], ...req.body };
        writeCustomers(customers);
        res.json(customers[idx]);
    } catch {
        res.status(500).json({ message: 'Error updating customer' });
    }
});

// DELETE customer
router.delete('/:id', (req, res) => {
    try {
        const customers = readCustomers();
        const filtered = customers.filter(c => c.id != req.params.id);
        if (filtered.length === customers.length) return res.status(404).json({ message: 'Customer not found' });
        writeCustomers(filtered);
        res.json({ message: 'Customer deleted' });
    } catch {
        res.status(500).json({ message: 'Error deleting customer' });
    }
});

module.exports = router;