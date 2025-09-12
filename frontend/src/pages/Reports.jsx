// src/pages/Reports.jsx

import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Button } from 'react-bootstrap';
import { fetchProducts, fetchCustomers } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await fetchProducts();
        const custs = await fetchCustomers();
        setProducts(prods);
        setCustomers(custs);
      } catch (err) {
        console.error('Reports load error:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  // Example: product quantity trend data (you might need to keep history in backend to supply this)
  // For demonstration, create dummy time series data
  const dummyData = [
    { date: '2025-09-01', stock: 100 },
    { date: '2025-09-05', stock: 80 },
    { date: '2025-09-10', stock: 60 },
    { date: '2025-09-15', stock: 120 },
    { date: '2025-09-20', stock: 90 },
  ];

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col><h2>Reports</h2></Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>Stock Level Over Time (Example)</Card.Header>
        <Card.Body style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid stroke="#eee" />
              <Tooltip />
              <Line type="monotone" dataKey="stock" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <p><strong>Total Products:</strong> {products.length}</p>
          <p><strong>Total Customers:</strong> {customers.length}</p>
          <p><strong>Low Stock Items:</strong> {products.filter(p => p.quantity < 5).length}</p>
        </Card.Body>
      </Card>

      <Button variant="primary">Download Report (PDF/CSV)</Button>
    </Container>
  );
};

export default Reports;
