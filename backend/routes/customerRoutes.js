const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const customersFilePath = path.join(__dirname, '../data/customers.json');

function readCustomers() {
    const data = fs.readFileSync(customersFilePath, 'utf8');
    return JSON.parse(data);
}

function writeCustomers(customers) {
    fs.writeFileSync(customersFilePath, JSON.stringify(customers, null, 2));
}

// GET all customers
router.get('/', (req, res) => {
    try {
        const customers = readCustomers();
        res.json(customers);
    } catch (err) {
        console.error('Error reading customers:', err);
        res.status(500).json({ message: 'Error reading customers' });
    }
});

// POST create new customer
router.post('/', (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email and phone required' });
        }

        const customers = readCustomers();
        const newCustomer = {
            id: Date.now(), // simple ID generation
            name,
            email,
            phone
        };
        customers.push(newCustomer);
        writeCustomers(customers);
        res.status(201).json(newCustomer);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ message: 'Error creating customer' });
    }
});

// PUT update a customer
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const customers = readCustomers();
        const idx = customers.findIndex(c => c.id == id);
        if (idx === -1) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const updated = {
            ...customers[idx],
            name: name !== undefined ? name : customers[idx].name,
            email: email !== undefined ? email : customers[idx].email,
            phone: phone !== undefined ? phone : customers[idx].phone
        };
        customers[idx] = updated;
        writeCustomers(customers);
        res.json(updated);
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ message: 'Error updating customer' });
    }
});

// DELETE a customer
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const customers = readCustomers();
        const filtered = customers.filter(c => c.id != id);
        if (filtered.length === customers.length) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        writeCustomers(filtered);
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ message: 'Error deleting customer' });
    }
});

module.exports = router;