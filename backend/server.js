const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const customersRouter = require('./routes/customersRoutes');
const inventoryRouter = require('./routes/inventoryRoutes');
const transactionsRouter = require('./routes/transactionsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/transactions', transactionsRouter);

// Default route
app.get('/', (req, res) => {
    res.send('Wings Inventory API is running');
});

app.listen(PORT, () => {
    console.log(`Wings Inventory API running on port ${PORT}`);
});