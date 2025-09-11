// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchProducts, fetchCustomers } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prods = await fetchProducts();
        const custs = await fetchCustomers();
        setProducts(prods);
        setCustomers(custs);
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <Spinner animation="border" />
      </Container>
    );
  }

  // Compute stats
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const lowStockCount = products.filter(p => p.quantity < 5).length;
  const totalStockQty = products.reduce((sum, p) => sum + p.quantity, 0);

  // Products by category for bar chart
  const categoryMap = {};
  products.forEach(p => {
    if (p.category in categoryMap) categoryMap[p.category]++;
    else categoryMap[p.category] = 1;
  });
  const categoryData = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col md={3}><Card className="stat-card"><Card.Body><h5>Total Products</h5><h2>{totalProducts}</h2></Card.Body></Card></Col>
        <Col md={3}><Card className="stat-card"><Card.Body><h5>Total Customers</h5><h2>{totalCustomers}</h2></Card.Body></Card></Col>
        <Col md={3}><Card className="stat-card"><Card.Body><h5>Low Stock Items</h5><h2>{lowStockCount}</h2></Card.Body></Card></Col>
        <Col md={3}><Card className="stat-card"><Card.Body><h5>Total Stock Qty</h5><h2>{totalStockQty}</h2></Card.Body></Card></Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Products by Category</Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Stock Distribution (Pie)</Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="category"
                    outerRadius={100}
                    fill="#82ca9d"
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][idx % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
