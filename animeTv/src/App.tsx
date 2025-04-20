import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CreateUser from './screens/CreateUser';
import AnimeInfo from './screens/AnimeInfo';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<HomeScreen />} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route path="/AnimeInfo/:id" element={<AnimeInfo />} />
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
