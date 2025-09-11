const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const productsFile = path.join(__dirname, 'data', 'products.json');

// Helper to read and write JSON file
function readProducts() {
    const content = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(content);
}

function writeProducts(data) {
    fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
}

// CRUD for products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: Date.now().toString(),
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const updated = {...products[index], ...req.body };
    products[index] = updated;
    writeProducts(products);
    res.json(updated);
});

app.delete('/api/products/:id', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(index, 1);
    writeProducts(products);
    res.json({ message: 'Deleted successfully' });
});

// Stock transactions endpoint
app.post('/api/products/:id/transaction', (req, res) => {
    // body: { type: 'add'|'deduct', qty: number }
    const { type, qty } = req.body;
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    let product = products[index];
    if (type === 'deduct') {
        if (product.quantity < qty) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        product.quantity -= qty;
    } else if (type === 'add') {
        product.quantity += qty;
    } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }
    products[index] = product;
    writeProducts(products);
    res.json(product);
});

// maybe routes for sales, customers ... you can implement later similarly

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

app.post('/api/transactions', (req, res) => {
    const { productId, type, quantity } = req.body;

    if (!productId || !type || quantity === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const products = readJSON(PRODUCTS_FILE);
    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (type === 'deduct') {
        if (product.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock' });
        }
        product.quantity -= quantity;
    } else if (type === 'add') {
        product.quantity += quantity;
    }

    writeJSON(PRODUCTS_FILE, products);

    const transactions = readJSON(TRANSACTIONS_FILE);
    const newTransaction = {
        id: Date.now().toString(),
        productId: product.id.toString(),
        productName: product.name,
        type,
        quantity,
        date: new Date().toISOString()
    };
    transactions.push(newTransaction);
    writeJSON(TRANSACTIONS_FILE, transactions);

    return res.status(201).json(newTransaction); // ✅ JSON response
});