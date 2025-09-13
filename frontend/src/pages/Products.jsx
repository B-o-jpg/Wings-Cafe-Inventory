import { useState, useEffect } from 'react';
import { Container, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import ProductList from '../components/Product.List';
import ProductForm from '../components/ProductForm';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // ✅ empty array ensures it runs once

  const handleAdd = () => {
    setEditingProduct(null);
    setModalShow(true);
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setModalShow(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleSubmit = async product => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, product);
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(product);
        setProducts(prev => [...prev, created]);
      }
      setModalShow(false);
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Products</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Button className="mb-3" onClick={handleAdd}>Add Product</Button>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={() => setModalShow(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
