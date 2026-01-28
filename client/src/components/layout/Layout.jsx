import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DynamicSEO from './DynamicSEO';
import Breadcrumbs from './Breadcrumbs';

const Layout = () => {
    return (
        <div className="app-layout">
            <DynamicSEO />
            <Navbar />
            <Breadcrumbs />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
