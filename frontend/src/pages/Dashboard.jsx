import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { fetchProducts, fetchTransactions, fetchCustomers } from '../services/api';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setProducts(await fetchProducts());
        setTransactions(await fetchTransactions());
        setCustomers(await fetchCustomers());
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalSales = transactions.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <Container>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={4}><Card className="p-3">Products: {products.length}</Card></Col>
        <Col md={4}><Card className="p-3">Customers: {customers.length}</Card></Col>
        <Col md={4}><Card className="p-3">Total Sales: {totalSales}</Card></Col>
      </Row>
      <Row className="mt-4">
        <Col><Card className="p-3">Total Stock: {totalStock}</Card></Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
