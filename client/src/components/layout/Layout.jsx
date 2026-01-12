import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DynamicSEO from './DynamicSEO';

const Layout = () => {
    return (
        <div className="app-layout">
            <DynamicSEO />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
