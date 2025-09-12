// src/pages/Reports.jsx

import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Button, Alert } from 'react-bootstrap';
import { fetchProducts, fetchCustomers } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prods = await fetchProducts();
        const custs = await fetchCustomers();

        // Ensure quantities are numbers
        const normalizedProducts = prods.map(p => ({
          ...p,
          quantity: Number(p.quantity),
        }));

        setProducts(normalizedProducts);
        setCustomers(custs);
      } catch (err) {
        console.error('Reports load error:', err);
        setError('Failed to load products or customers: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Dummy stock trend data (replace with backend history if available)
  const stockTrendData = [
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
            <LineChart data={stockTrendData}>
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
          <Row>
            <Col md={4}>
              <p><strong>Total Products:</strong> {products.length}</p>
            </Col>
            <Col md={4}>
              <p><strong>Total Customers:</strong> {customers.length}</p>
            </Col>
            <Col md={4}>
              <p><strong>Low Stock Items:</strong> {products.filter(p => p.quantity < 5).length}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button variant="primary">Download Report (PDF/CSV)</Button>
    </Container>
  );
};

export default Reports;
