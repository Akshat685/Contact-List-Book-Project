import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/add-contact" element={<AddContact />} />
        <Route path="/contacts/:id" element={<EditContact />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster */}
    </Router>
  );
};

export default App;
