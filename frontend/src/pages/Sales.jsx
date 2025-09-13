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

  useEffect(() => { const load = async () => { try { setProducts(await fetchProducts()); } catch (err) { setError(err.message); } finally { setLoadingProducts(false); } }; load(); }, []);
  useEffect(() => { const load = async () => { try { setSalesHistory(await fetchTransactions()); } catch (err) { setError(err.message); } finally { setLoadingSales(false); } }; load(); }, []);

  const handleSale = async e => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return setError('Select product and quantity');
    const qtyNum = parseInt(quantity,10);
    if (qtyNum <=0) return setError('Quantity must be positive');

    try {
      const updated = await createTransaction(Number(selectedProductId), 'deduct', qtyNum);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setSalesHistory(prev => [{ ...updated, quantity: qtyNum, date: new Date().toISOString() }, ...prev]);
      setSelectedProductId(''); setQuantity(''); setError(null);
    } catch (err) { setError('Error recording sale: '+err.message); }
  };

  return (
    <Container className="mt-4">
      <h2>Sales</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loadingProducts ? <Spinner animation="border"/> :
      <Form onSubmit={handleSale} className="mb-4">
        <Row className="align-items-end">
          <Col md={5}>
            <Form.Group>
              <Form.Label>Product</Form.Label>
              <Form.Select value={selectedProductId} onChange={e=>setSelectedProductId(e.target.value)}>
                <option value="">-- Select Product --</option>
                {products.map(p=><option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/>
            </Form.Group>
          </Col>
          <Col md={2}><Button variant="success" type="submit">Record Sale</Button></Col>
        </Row>
      </Form>}

      <h4>Sales History</h4>
      {loadingSales ? <Spinner animation="border"/> :
      <Table responsive bordered hover>
        <thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Date</th></tr></thead>
        <tbody>
          {salesHistory.length===0?<tr><td colSpan="4" className="text-center">No sales recorded</td></tr> :
            salesHistory.map((s,i)=><tr key={i}><td>{i+1}</td><td>{s.name || s.productName}</td><td>{s.quantity}</td><td>{new Date(s.date || s.timestamp).toLocaleString()}</td></tr>)}
        </tbody>
      </Table>}
    </Container>
  );
};

export default Sales;
