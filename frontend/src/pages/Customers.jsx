import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { FaEye, FaTrash } from 'react-icons/fa';
import axios from 'axios'; // ✅ import axios
import './Tables.scss';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // For add modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // ✅ Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/customers"); 
        setCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleView = (id) => alert(`Viewing customer ${id}`);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleShowAdd = () => {
    setFormData({ name: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setCustomers([...customers, res.data]); // ✅ Add new customer from backend response
      setShowModal(false);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="customers-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer List</h2>
        <Button variant="primary" onClick={handleShowAdd}>Add Customer</Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table responsive bordered hover className="table-custom">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.totalOrders || 0}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleView(customer.id)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(customer.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Customer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCustomer}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">Cancel</Button>
              <Button type="submit" variant="primary">Add</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Customers;
