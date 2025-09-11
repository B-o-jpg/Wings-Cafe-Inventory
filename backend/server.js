const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const inventoryRoutes = require('./routes/inventoryRoutes');
const customersRoutes = require('./routes/customersRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customersRoutes);

app.get('/', (req, res) => {
    res.send('Wings Cafe Inventory + Customers API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});