
import { Table, Button } from 'react-bootstrap';

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.category}</td>
            <td>{p.price.toFixed(2)}</td>
            <td className={p.quantity < 5 ? 'text-danger' : ''}>{p.quantity}</td>
            <td>
              <Button size="sm" variant="info" className="me-2" onClick={() => onEdit(p)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(p.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
