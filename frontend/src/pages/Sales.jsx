// src/pages/Sales.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { fetchProducts, createTransaction, fetchTransactions } from '../services/api';
import './Sales.scss';

const Sales = ({ onSaleRecorded }) => {
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await fetchProducts();
        setProducts(prods);
      } catch (err) {
        setError('Failed to load products: ' + err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Load sales history
  useEffect(() => {
    const loadSales = async () => {
      try {
        const txs = await fetchTransactions();
        setSalesHistory(txs.map(tx => ({
          id: tx.id,
          productId: tx.productId,
          productName: tx.productName || 'Unknown',
          quantity: tx.quantity,
          date: tx.timestamp || tx.date || new Date().toISOString()
        })));
      } catch (err) {
        setError('Failed to load sales history: ' + err.message);
      } finally {
        setLoadingSales(false);
      }
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
      setError('Quantity must be a positive number.');
      return;
    }

    try {
      // Send numeric ID to API
      const updatedProduct = await createTransaction(Number(selectedProductId), 'deduct', qtyNum);

      // Update local product list
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      // Append transaction to salesHistory
      const productName = updatedProduct.name;
      const newSale = {
        id: Date.now(),
        productId: updatedProduct.id,
        productName,
        quantity: qtyNum,
        date: new Date().toISOString(),
      };
      setSalesHistory((prev) => [newSale, ...prev]);

      // Reset form
      setSelectedProductId('');
      setQuantity('');

      // Notify parent to refresh totals
      if (typeof onSaleRecorded === 'function') onSaleRecorded();

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
                  onChange={(e) => setSelectedProductId(e.target.value)}
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
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="success" type="submit">
                Record Sale
              </Button>
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
                <td colSpan="4" className="text-center">
                  No sales recorded yet.
                </td>
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
