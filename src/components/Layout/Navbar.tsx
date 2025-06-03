import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'SİPARİŞLER', path: '/orders' },
    { text: 'SİPARİŞ TAKİP', path: '/tracking' },
    { text: 'ÇIKIŞ', path: '/login' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          key={item.text}
          onClick={() => {
            navigate(item.path);
            handleDrawerToggle();
          }}
          sx={{
            bgcolor: isActive(item.path) ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          }}
        >
          <ListItemText 
            primary={item.text}
            sx={{
              color: isActive(item.path) ? 'primary.main' : 'inherit',
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: '#1976d2',
          boxShadow: 3
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: isMobile ? '1.1rem' : '1.25rem',
            }}
            onClick={() => navigate('/orders')}
          >
            Sipariş Takip Sistemi
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  color="inherit"
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive(item.path) ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                    borderBottom: isActive(item.path) ? '3px solid #fff' : '3px solid transparent',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderBottom: '3px solid rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: 240,
              bgcolor: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navbar; 