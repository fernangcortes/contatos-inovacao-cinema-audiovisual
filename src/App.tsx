import { Routes, Route } from 'react-router';
import { Home } from '@/pages/Home';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminPanel } from '@/pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contato/:id" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
