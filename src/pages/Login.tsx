import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here
    navigate('/orders');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.grey[100],
        py: { xs: 4, sm: 6, md: 8 }
      }}
    >
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          width: isLargeScreen ? '500px' : '400px',
          maxWidth: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ 
            m: isLargeScreen ? 2 : 1, 
            bgcolor: 'primary.main',
            width: isLargeScreen ? 72 : 56,
            height: isLargeScreen ? 72 : 56
          }}>
            <LockOutlinedIcon sx={{ fontSize: isLargeScreen ? 40 : 32 }} />
          </Avatar>
          <Typography 
            component="h1" 
            variant={isLargeScreen ? "h3" : "h4"} 
            sx={{ 
              mb: 3,
              fontWeight: 500
            }}
          >
            Sipariş Takip Sistemi
          </Typography>
          <Paper 
            elevation={2} 
            sx={{ 
              p: isLargeScreen ? 6 : 4, 
              width: '100%', 
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[2]
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-posta Adresi"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    height: isLargeScreen ? '56px' : '48px',
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                  },
                  mb: 2
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Şifre"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    height: isLargeScreen ? '56px' : '48px',
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                  },
                  mb: 3
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  py: isLargeScreen ? 2 : 1.5,
                  fontSize: isLargeScreen ? '1.2rem' : '1rem',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  borderRadius: 1,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                GİRİŞ YAP
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 