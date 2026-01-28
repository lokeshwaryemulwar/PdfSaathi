import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import MergePdf from './pages/MergePdf';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Security from './pages/Security';
import HelpCenter from './pages/HelpCenter';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import GenericTool from './components/tools/GenericTool';
import { tools } from './data/tools';

const NotFound = () => <div className="container" style={{ padding: '2rem', textAlign: 'center' }}><h1>404 - Page Not Found</h1></div>;

import ScrollToTop from './components/layout/ScrollToTop'; import PdfEditor from './pages/PdfEditor';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<AllTools />} />
          <Route path="merge-pdf" element={<MergePdf />} />
          <Route path="edit-pdf" element={<PdfEditor />} />


          {tools.filter(t => t.id !== 'merge-pdf' && t.id !== 'edit-pdf').map(tool => {
            // Define specific inputs for tools
            let specificInputs = tool.inputs || [];
            if (specificInputs.length === 0) {
              if (tool.id === 'split-pdf') {
                specificInputs = [
                  { name: 'startPage', label: 'Start Page', type: 'number', placeholder: 'e.g. 1', required: true },
                  { name: 'endPage', label: 'End Page', type: 'number', placeholder: 'e.g. 5', required: true }
                ];
              } else if (tool.id === 'protect-pdf') {
                specificInputs = [
                  { name: 'password', label: 'Set Password', type: 'password', placeholder: 'Enter password', required: true }
                ];
              } else if (tool.id === 'unlock-pdf') {
                specificInputs = [
                  { name: 'password', label: 'Enter Password', type: 'password', placeholder: 'Unlock password', required: true }
                ];
              }
            }

            return (
              <Route
                key={tool.id}
                path={tool.path.substring(1)}
                element={
                  <GenericTool
                    title={tool.title}
                    description={tool.description}
                    endpoint={tool.id}
                    accept={tool.accept || (tool.id === 'word-to-pdf' ? '.doc,.docx' : '.pdf')}
                    multiple={tool.id === 'img-to-pdf'}
                    icon={tool.icon}
                    inputs={specificInputs}
                    downloadFileName={`processed${tool.outputExtension || '.pdf'}`}
                  />
                }
              />
            )
          })}

          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="cookies" element={<CookiePolicy />} />
          <Route path="security" element={<Security />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
