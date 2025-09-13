const API_BASE = 'http://localhost:5000/api';
export async function fetchCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
}

export async function createCustomer(customer) {
    const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
}

export async function updateCustomer(id, customer) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
}

export async function deleteCustomer(id) {
    const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete customer');
    return res.json();
}

export async function fetchProducts() {
    const res = await fetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...product, price: Number(product.price), quantity: Number(product.quantity) })
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}

export async function updateProduct(id, product) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...product, price: Number(product.price), quantity: Number(product.quantity) })
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}

export async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}

export async function createTransaction(productId, type, quantity) {
    const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, type, quantity })
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
}

export async function fetchTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
}