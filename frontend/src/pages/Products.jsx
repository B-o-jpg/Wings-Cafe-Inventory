import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import { fetchProducts, createProduct, deleteProduct } from '../services/api';  // note: deleteProduct, fetchProducts
import { FaTrash, FaEdit } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '' });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleShowAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '', quantity: '' });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      };
      if (editingProduct) {
        // If you build backend update route, call updateProduct here
        // For now, maybe just delete + re-add or modify
        // Example: await updateProduct(editingProduct.id, payload);
        // Then update state accordingly
      } else {
        const created = await createProduct(payload);
        setProducts([...products, created]);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', quantity: '' });
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col><h2>Products</h2></Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleShowAdd}>Add Product</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(p)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">Cancel</Button>
              <Button variant="primary" type="submit">{editingProduct ? 'Update' : 'Add'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
