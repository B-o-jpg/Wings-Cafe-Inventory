// src/components/Header/Header.jsx
import { FaBell, FaEnvelope, FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header d-flex justify-content-between align-items-center px-4 py-2 shadow-sm bg-white">
      <div className="search-bar d-flex align-items-center">
        <FaSearch className="me-2 text-muted" />
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
        />
      </div>
      <div className="icons d-flex align-items-center">
        <FaEnvelope className="me-4 text-muted" size={18} />
        <FaBell className="text-muted" size={18} />
      </div>
    </header>
  );
};

export default Header;
