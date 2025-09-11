const API_BASE = 'http://localhost:5000/api';

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
    const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: 'DELETE',
    });
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

export async function createProduct(product) {
    const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}

export async function updateProduct(id, product) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}

export async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}

/* =========================
   ✅ Transactions / Sales
========================= */

export async function fetchTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
}

export async function createTransaction(transaction) {
    const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });

    if (!res.ok) {
        const text = await res.text(); // Capture raw error text
        throw new Error(`Error recording sale: ${text}`);
    }

    return res.json();
}