// src/pages/Layout.jsx

import Sidebar from './Sidebar';
import Header from './Header';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <div className="layout-container d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content flex-grow-1">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Container fluid className="page-body py-4">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
