import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import Navbar from './components/Layout/Navbar';
import Login from './pages/Login';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
