import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Forms.scss';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', quantity: '' });

  useEffect(() => {
    if (product) setForm({ ...product });
  }, [product]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.category || form.price === '' || form.quantity === '') return alert('Fill all fields');
    onSubmit({ ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity, 10) });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control name="name" value={form.name} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control name="description" value={form.description} onChange={handleChange} as="textarea" rows={2} /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Control name="category" value={form.category} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Price</Form.Label><Form.Control name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Quantity</Form.Label><Form.Control name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">Cancel</Button>
        <Button variant="primary" type="submit">{product ? 'Update' : 'Add'}</Button>
      </div>
    </Form>
  );
}
