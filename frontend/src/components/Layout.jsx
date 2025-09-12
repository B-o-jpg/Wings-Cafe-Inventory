import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Container } from 'react-bootstrap';
import './Layout.scss';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-container d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`main-content flex-grow-1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <Container fluid className="page-body py-4">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
