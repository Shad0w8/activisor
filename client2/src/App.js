import './App.css';
import Post from './Post';
import Header from './Header';
import {Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Indexpage from './pages/Indexpage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Createnewpost from './pages/Createnewpost';
import { UserContextProvider } from './UserContext';
import Postpage from './pages/Postpage';
import Editpost from './pages/Editpost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout/>} >
        <Route index element={<Indexpage/>} />
        <Route path="/login" element={<Loginpage/>} />
        <Route path="/register" element={<Registerpage/>} />
        <Route path="/create" element={<Createnewpost/>} />
        <Route path="/post/:id" element={<Postpage/>} />
        <Route path="/edit/:id" element={<Editpost/>} />
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
