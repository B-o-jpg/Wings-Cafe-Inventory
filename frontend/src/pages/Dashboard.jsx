// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchProducts, fetchCustomers, fetchTransactions } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, custs, txns] = await Promise.all([
          fetchProducts(),
          fetchCustomers(),
          fetchTransactions()
        ]);

        setProducts(prods || []);
        setCustomers(custs || []);
        setTransactions(txns || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
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

  // Prepare chart data: stock vs sold
  const chartData = products.map(product => {
    const soldQty = transactions
      .filter(txn => txn.productId === product.id && txn.type === 'deduct')
      .reduce((sum, txn) => sum + Number(txn.quantity), 0);

    return {
      name: product.name,
      Stock: Number(product.quantity),
      Sold: soldQty
    };
  });

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col><h2>Dashboard</h2></Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Total Products</h5>
              <h2>{products.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Total Customers</h5>
              <h2>{customers.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Total Sales</h5>
              <h2>{transactions.filter(tx => tx.type === 'deduct').length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Low Stock Items</h5>
              <h2>{products.filter(p => Number(p.quantity) < 5).length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>Stock vs Sold Products</Card.Header>
            <Card.Body style={{ height: '300px' }}>
              {chartData.length === 0 ? (
                <p className="text-center">No products available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Stock" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Sold" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
