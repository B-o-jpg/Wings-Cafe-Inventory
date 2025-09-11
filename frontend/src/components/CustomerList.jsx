import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Container } from 'react-bootstrap';
import { fetchCustomers, deleteCustomer } from '../services/api';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete customer');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Customers</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer, idx) => (
                <tr key={customer.id}>
                  <td>{idx + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CustomersList;
