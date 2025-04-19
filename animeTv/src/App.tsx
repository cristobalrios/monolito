import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CreateUser from './screens/CreateUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<HomeScreen />} />
        <Route path="/CreateUser" element={<CreateUser />} />
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
