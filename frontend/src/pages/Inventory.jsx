import InventoryList from '../components/InventoryList';
import { Container } from 'react-bootstrap';

const Inventory = () => (
  <Container className="mt-4">
    <h2>Inventory</h2>
    <InventoryList />
  </Container>
);

export default Inventory;
