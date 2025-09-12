const API_BASE = 'https://wings-backend-xmdr.onrender.com/api';
/* =========================
   ✅ Customers
========================= */
export async function fetchCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
}

export async function createCustomer(customer) {
    const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
}

export async function updateCustomer(id, customer) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
}

export async function deleteCustomer(id) {
    const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete customer');
    return res.json();
}

/* =========================
   ✅ Products / Inventory
========================= */
export async function fetchProducts() {
    const res = await fetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function fetchProductById(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity),
        }),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}

export async function updateProduct(id, product) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity),
        }),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}

export async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}

/* =========================
   ✅ Transactions / Stock
========================= */

/**
 * Create a stock transaction (add/deduct)
 * @param {string | number} productId
 * @param {'add' | 'deduct'} type
 * @param {number} quantity
 * @returns Updated product
 */
export async function createTransaction(productId, type, quantity) {
    const prodRes = await fetch(`${API_BASE}/inventory/${productId}`);
    if (!prodRes.ok) throw new Error('Product not found');
    const product = await prodRes.json();

    const newQuantity = type === 'add' ?
        Number(product.quantity) + Number(quantity) :
        Math.max(Number(product.quantity) - Number(quantity), 0);

    const updateRes = await fetch(`${API_BASE}/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...product, quantity: newQuantity })
    });
    if (!updateRes.ok) throw new Error('Failed to update stock');

    const updatedProduct = await updateRes.json();

    await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId: Number(productId),
            type,
            quantity: Number(quantity),
            timestamp: new Date().toISOString()
        })
    });

    return updatedProduct; // contains id, name, quantity

} // Fetch all transactions
export async function fetchTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}