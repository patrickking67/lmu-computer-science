import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigate, Routes, Route } from 'react-router-dom'; // Import useNavigate, Routes, and Route
import './App.css';

// Your Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// New Component for Courses Page
const Courses = () => {
  return <h2>Welcome to the Courses Page!</h2>;
};

function App() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate(); // Use navigate hook for routing

  const handleNameChange = (event) => setName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const addUser = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        username: username,
        password: password
      });
      console.log("Document written with ID: ", docRef.id);
      fetchUsers();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setUsers(usersData);
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on initial load
  }, []);

  const goToCourses = () => {
    navigate('/courses'); // Navigate to the Courses page
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={handleNameChange} 
      />
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={handleUsernameChange} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={handlePasswordChange} 
      />
      <input 
        type="file" 
        onChange={handleFileChange} 
      />
      {selectedFile && <p>Resume: {selectedFile.name}</p>}

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.username} - {user.password}</li>
        ))}
      </ul>

      <button onClick={addUser}>Enter</button>
      
      {/* Button to navigate to Courses page */}
      <button onClick={goToCourses}>Go to Courses</button>

      {/* Define your Routes here */}
      <Routes>
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </div>
  );
}

export default App;
