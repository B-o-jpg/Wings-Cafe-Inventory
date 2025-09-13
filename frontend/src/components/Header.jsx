import { Navbar } from 'react-bootstrap';
const Header = ({ toggleSidebar }) => (
  <Navbar bg="light" expand="lg" className="mb-3">
    <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>☰</button>
    <Navbar.Brand>Wings Cafe Inventory</Navbar.Brand>
  </Navbar>
);
export default Header;
