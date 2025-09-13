import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Container } from 'react-bootstrap';
import './Layout.scss';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-container d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content flex-grow-1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <Container fluid className="page-body py-4">{children}</Container>
      </div>
    </div>
  );
};

export default Layout;
