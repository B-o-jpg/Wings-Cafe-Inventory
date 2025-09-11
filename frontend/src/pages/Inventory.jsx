import { useState, useEffect } from 'react';
import { fetchProducts, createTransaction } from '../services/api';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [transactionType, setTransactionType] = useState('add');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!selectedProductId || qty === '') {
      alert('Select product and enter quantity');
      return;
    }
    try {
      const updated = await createTransaction(selectedProductId, transactionType, parseInt(qty,10));
      // update local state
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setQty('');
    } catch(e) {
      alert(e.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Stock Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}

      <Form onSubmit={handleTransaction} className="mb-4">
        <Row className="align-items-end">
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Product</Form.Label>
              <Form.Select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
                <option value="">-- Select Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                <option value="add">Add Stock</option>
                <option value="deduct">Deduct Stock</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity in Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className={p.quantity < 5 ? 'text-danger' : ''}>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Inventory;
