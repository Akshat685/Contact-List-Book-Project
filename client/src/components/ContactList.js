import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./ContactList1.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    } catch (error) {
      console.error(
        "Error fetching contacts:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to fetch contacts. Please log in again.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8000/api/contacts/${userIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== userIdToDelete)
      );
      toast.success(response.data.message, { position: "top-right" });
      setModalVisible(false);
    } catch (error) {
      console.error(
        "Error deleting contact:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to delete contact. Please try again.");
      setModalVisible(false);
    }
  };

  const openModal = (contactId) => {
    setUserIdToDelete(contactId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    toast("Deletion cancelled.", { icon: "❌", position: "top-right" });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    toast.success("You have been logged out successfully!", { position: "top-right" });

    navigate("/");
  };

  return (
    <div className="userTable">
      <div className="head">
        <div>
          <button className="signOutButton" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
        <div className="header">
          {/* Displaying the username from localStorage */}
          <h1>Welcome ! You are logged in.</h1>
        </div>
      </div>
      <Link to="/add-contact" className="addButton">
        Add Contact
      </Link>
      <table>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>User Name</th>
            <th>Phone No.</th>
            <th>Email</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{index + 1}</td>
              <td>{contact.name}</td>
              <td>{contact.phone}</td>
              <td>{contact.email}</td>
              <td>{contact.city}</td>
              <td>{contact.country}</td>
              <td className="actionButtons">
                <button
                  className="delebtn"
                  onClick={() => openModal(contact._id)}
                >
                  Delete
                </button>
                <Link className="editbtn" to={`/contacts/${contact._id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this contact?</p>
            <div className="modalActions">
              <button onClick={handleDelete}>Yes, Delete</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
