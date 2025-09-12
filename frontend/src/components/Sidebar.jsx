import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaChartBar, FaShoppingCart, FaTimes } from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Products', path: '/products', icon: <FaBoxOpen /> },
    { name: 'Inventory', path: '/inventory', icon: <FaBoxOpen /> },
    { name: 'Sales', path: '/sales', icon: <FaShoppingCart /> },
    { name: 'Customers', path: '/customers', icon: <FaUsers /> },
    { name: 'Reports', path: '/reports', icon: <FaChartBar /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header d-flex justify-between align-items-center">
        <h4>Wings Cafe</h4>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.name} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path} onClick={toggleSidebar}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
