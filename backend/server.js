const cors = require('cors');
app.use(cors({
    origin: 'https://wings-cafe-inventory-qdwp.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const INVENTORY_FILE = './inventory.json';
const TRANSACTIONS_FILE = './transactions.json';

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all products
app.get('/api/inventory', (req, res) => {
    const products = readJSON(INVENTORY_FILE);
    res.json(products);
});

// ✅ Get single product by ID
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

// Transactions
app.get('/api/transactions', (req, res) => {
    const txs = readJSON(TRANSACTIONS_FILE);
    res.json(txs);
});

app.post('/api/transactions', (req, res) => {
    const { productId, type, quantity } = req.body;
    if (!productId || !type || quantity <= 0) return res.status(400).json({ message: 'Invalid transaction' });

    const products = readJSON(INVENTORY_FILE);
    const product = products.find(p => p.id === Number(productId));
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let newQuantity = product.quantity;
    if (type === 'add') newQuantity += quantity;
    else if (type === 'deduct') newQuantity -= quantity;
    if (newQuantity < 0) newQuantity = 0;

    // Update product
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
        date: new Date().toISOString()
    };
    txs.push(newTx);
    writeJSON(TRANSACTIONS_FILE, txs);

    res.json(newTx);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));