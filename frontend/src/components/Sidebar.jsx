// src/components/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaChartBar, FaShoppingCart } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Products', path: '/products', icon: <FaBoxOpen /> },
    { name: 'Customers', path: '/customers', icon: <FaUsers /> },
    { name: 'Sales', path: '/sales', icon: <FaShoppingCart /> },
    { name: 'Reports', path: '/reports', icon: <FaChartBar /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4>Wings Cafe</h4>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.name}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path}>
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
