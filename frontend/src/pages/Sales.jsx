// src/pages/Sales.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { fetchProducts, createTransaction, fetchTransactions } from '../services/api';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await fetchProducts();
        setProducts(prods);
      } catch (err) {
        setError('Failed to load products: ' + err.message);
      }
      setLoadingProducts(false);
    };
    loadProducts();
  }, []);

  // Load sales history on mount
  useEffect(() => {
    const loadSales = async () => {
      try {
        const txs = await fetchTransactions();
        setSalesHistory(txs);
      } catch (err) {
        setError('Failed to load sales history: ' + err.message);
      }
      setLoadingSales(false);
    };
    loadSales();
  }, []);

  const handleSale = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProductId || !quantity) {
      setError('Please select a product and enter a quantity.');
      return;
    }

    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    try {
      // call backend
      const newSale = await createTransaction({
        productId: selectedProductId,
        type: 'deduct',
        quantity: qtyNum,
      });

      // Update product list locally
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id.toString() === newSale.productId.toString()
            ? { ...p, quantity: p.quantity - newSale.quantity }
            : p
        )
      );

      // Insert the new sale at top of salesHistory
      setSalesHistory(prev => [newSale, ...prev]);

      // Reset form
      setSelectedProductId('');
      setQuantity('');
    } catch (err) {
      setError('Error recording sale: ' + err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Sales</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {loadingProducts ? (
        <Spinner animation="border" />
      ) : (
        <Form onSubmit={handleSale} className="mb-4">
          <Row className="align-items-end">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Product</Form.Label>
                <Form.Select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.quantity})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="success" type="submit">Record Sale</Button>
            </Col>
          </Row>
        </Form>
      )}

      <h4>Sales History</h4>
      {loadingSales ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No sales recorded yet.</td>
              </tr>
            ) : (
              salesHistory.map((sale, idx) => (
                <tr key={sale.id}>
                  <td>{idx + 1}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.quantity}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Sales;
