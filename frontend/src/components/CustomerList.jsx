import { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Container } from 'react-bootstrap';
import { fetchCustomers, deleteCustomer } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try { setCustomers(await fetchCustomers()); }
      catch { setError('Failed to load customers'); }
      finally { setLoading(false); }
    };
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try { await deleteCustomer(id); setCustomers(prev => prev.filter(c => c.id !== id)); }
    catch { setError('Failed to delete customer'); }
  };

  return (
    <Container className="mt-4">
      <h2>Customers</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner animation="border" /> :
        <Table bordered hover responsive>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.length === 0 ? <tr><td colSpan="5" className="text-center">No customers found</td></tr> :
              customers.map((c,i) => <tr key={c.id}><td>{i+1}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td>
                <td><Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Delete</Button></td></tr>)}
          </tbody>
        </Table>}
    </Container>
  );
};

export default CustomerList;
