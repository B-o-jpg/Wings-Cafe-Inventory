import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = ({ isOpen, toggleSidebar }) => (
  <div className={`sidebar ${isOpen ? 'open' : ''}`}>
    <button className="btn-toggle" onClick={toggleSidebar}>
      ☰
    </button>
    <Nav className="flex-column mt-4">
      <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/products">Products</Nav.Link>
      <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
      <Nav.Link as={Link} to="/sales">Sales</Nav.Link>
      <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
      <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
    </Nav>
  </div>
);

export default Sidebar;
