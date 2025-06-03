import { useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Card,
  CardContent,
  Box,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  status: string;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderDate: '2024-03-20',
    customerName: 'Ahmet Yılmaz',
    status: 'Hazırlanıyor',
    total: 1250.00,
  },
  {
    id: '2',
    orderDate: '2024-03-19',
    customerName: 'Ayşe Demir',
    status: 'Kargoda',
    total: 850.50,
  },
  {
    id: '3',
    orderDate: '2024-03-18',
    customerName: 'Mehmet Kaya',
    status: 'Teslim Edildi',
    total: 2100.75,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hazırlanıyor':
      return 'warning';
    case 'Kargoda':
      return 'info';
    case 'Teslim Edildi':
      return 'success';
    default:
      return 'default';
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery('(min-width:1920px)');

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MobileOrderCard = ({ order }: { order: Order }) => (
    <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Sipariş #{order.id}</Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status) as any}
            size="small"
          />
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {order.orderDate}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {order.customerName}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="h6" color="primary">
            {order.total.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </Typography>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/orders/${order.id}`);
            }}
          >
            <Visibility />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: theme.palette.grey[100],
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          maxWidth: isLargeScreen ? '1600px' : '1400px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: 2,
              mb: { xs: 2, sm: 3, md: 4 }
            }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1"
                sx={{ 
                  fontWeight: 500,
                  color: theme.palette.grey[800],
                  fontSize: isLargeScreen ? '2.5rem' : undefined
                }}
              >
                Siparişler
              </Typography>
              <TextField
                size={isMobile ? "small" : "medium"}
                placeholder="Sipariş veya müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  minWidth: isMobile ? '100%' : '400px',
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    height: isLargeScreen ? '56px' : undefined,
                    fontSize: isLargeScreen ? '1.1rem' : undefined,
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: isLargeScreen ? '1.5rem' : undefined }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          <Box>
            {isMobile ? (
              <Box sx={{ mt: 2 }}>
                {filteredOrders.map((order) => (
                  <MobileOrderCard key={order.id} order={order} />
                ))}
              </Box>
            ) : (
              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                  overflow: 'hidden',
                  '& .MuiTable-root': {
                    minWidth: isLargeScreen ? 1200 : 800,
                  }
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }}>Sipariş No</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }}>Tarih</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }}>Müşteri</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }}>Durum</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }} align="right">Toplam</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        fontSize: isLargeScreen ? '1.1rem' : '0.95rem',
                        py: isLargeScreen ? 3 : undefined
                      }} align="center">İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow 
                        key={order.id}
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: theme.palette.action.hover },
                          '& > td': {
                            py: isLargeScreen ? 2.5 : undefined,
                            fontSize: isLargeScreen ? '1rem' : '0.9rem'
                          }
                        }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size={isLargeScreen ? "medium" : "small"}
                            sx={{ 
                              fontSize: isLargeScreen ? '0.95rem' : '0.85rem',
                              py: isLargeScreen ? 2.5 : undefined
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {order.total.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orders/${order.id}`);
                            }}
                            sx={{ 
                              width: isLargeScreen ? 48 : 40,
                              height: isLargeScreen ? 48 : 40,
                              '&:hover': { 
                                bgcolor: theme.palette.primary.light,
                                color: theme.palette.common.white
                              }
                            }}
                          >
                            <Visibility sx={{ 
                              fontSize: isLargeScreen ? '1.5rem' : undefined 
                            }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {filteredOrders.length === 0 && (
              <Paper sx={{ 
                textAlign: 'center', 
                py: isLargeScreen ? 12 : 8,
                borderRadius: 2,
                bgcolor: 'white'
              }}>
                <Typography 
                  color="text.secondary" 
                  variant="h6"
                  sx={{
                    fontSize: isLargeScreen ? '1.5rem' : undefined
                  }}
                >
                  Sipariş bulunamadı
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Orders; 