import { FaBell, FaEnvelope, FaSearch, FaBars } from 'react-icons/fa';
import './Header.scss';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header d-flex justify-content-between align-items-center px-4 py-2 shadow-sm bg-white">
      {/* Left: Hamburger + Search */}
      <div className="d-flex align-items-center">
        {/* Hamburger Menu */}
        <button
          className="hamburger-btn me-3"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

        {/* Search Bar */}
        <div className="search-bar d-flex align-items-center">
          <FaSearch className="me-2 text-muted" />
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right: Icons */}
      <div className="icons d-flex align-items-center">
        <FaEnvelope className="me-4 text-muted" size={18} />
        <FaBell className="text-muted" size={18} />
      </div>
    </header>
  );
};

export default Header;
