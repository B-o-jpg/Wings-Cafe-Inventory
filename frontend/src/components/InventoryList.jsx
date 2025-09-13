import { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data — replace with fetch call or props when connected to backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dummyData = [
          { id: 1, name: 'Chicken Wings', category: 'Food', price: 12.99, quantity: 4 },
          { id: 2, name: 'Lemonade', category: 'Drink', price: 3.5, quantity: 20 },
          { id: 3, name: 'Burger', category: 'Food', price: 8.75, quantity: 2 }
        ];

        setProducts(dummyData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleUpdate = (id) => {
    alert(`Edit product with ID: ${id}`);
    // Navigate to edit form or show modal
  };

  return (
    <div className="inventory-list">
      <h2 className="mb-4">Inventory List</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table responsive hover bordered className="table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const isLowStock = product.quantity <= 5;

              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {isLowStock ? (
                      <Badge bg="danger">Low Stock</Badge>
                    ) : (
                      <Badge bg="success">In Stock</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdate(product.id)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default InventoryList;
