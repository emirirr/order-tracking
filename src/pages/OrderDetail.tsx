import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface OrderDetail {
  id: string;
  orderDate: string;
  customerName: string;
  status: string;
  shippingAddress: string;
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const mockOrderDetail: OrderDetail = {
  id: '1',
  orderDate: '2024-03-20',
  customerName: 'Ahmet Yılmaz',
  status: 'Hazırlanıyor',
  shippingAddress: 'Atatürk Mah. Cumhuriyet Cad. No:123 Daire:4 Kadıköy/İstanbul',
  total: 1250.00,
  items: [
    {
      id: '1',
      name: 'iPhone 15 Pro Silikon Kılıf',
      quantity: 2,
      price: 450.00,
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Cam Ekran Koruyucu',
      quantity: 1,
      price: 350.00,
    },
  ],
};

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

const OrderDetail = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  
  const [order] = useState<OrderDetail>(mockOrderDetail);

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
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/orders')}
              sx={{ 
                mb: 3,
                fontSize: isLargeScreen ? '1.1rem' : '1rem',
                '& .MuiSvgIcon-root': {
                  fontSize: isLargeScreen ? '1.5rem' : '1.25rem'
                }
              }}
            >
              Siparişlere Dön
            </Button>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3
            }}>
              <Box>
                <Typography 
                  variant={isLargeScreen ? "h3" : "h4"} 
                  component="h1"
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.grey[800],
                    mb: 1
                  }}
                >
                  Sipariş #{order.id}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: isLargeScreen ? '1.1rem' : '1rem'
                  }}
                >
                  {order.orderDate}
                </Typography>
              </Box>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
                sx={{ 
                  fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                  height: isLargeScreen ? '40px' : '32px',
                  px: isLargeScreen ? 3 : 2
                }}
              />
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <Paper 
                sx={{ 
                  p: isLargeScreen ? 4 : 3,
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography 
                  variant={isLargeScreen ? "h5" : "h6"} 
                  sx={{ 
                    mb: 2,
                    fontWeight: 500
                  }}
                >
                  Müşteri Bilgileri
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1,
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                    fontWeight: 500
                  }}
                >
                  {order.customerName}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{
                    fontSize: isLargeScreen ? '1.1rem' : '1rem',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {order.shippingAddress}
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Paper 
                sx={{ 
                  p: isLargeScreen ? 4 : 3,
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography 
                  variant={isLargeScreen ? "h5" : "h6"} 
                  sx={{ 
                    mb: 3,
                    fontWeight: 500
                  }}
                >
                  Sipariş Özeti
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell 
                          sx={{ 
                            fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                            fontWeight: 600,
                            py: isLargeScreen ? 2 : 1.5
                          }}
                        >
                          Ürün
                        </TableCell>
                        <TableCell 
                          align="center"
                          sx={{ 
                            fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                            fontWeight: 600,
                            py: isLargeScreen ? 2 : 1.5
                          }}
                        >
                          Adet
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                            fontWeight: 600,
                            py: isLargeScreen ? 2 : 1.5
                          }}
                        >
                          Fiyat
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell
                            sx={{ 
                              fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                              py: isLargeScreen ? 2 : 1.5
                            }}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ 
                              fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                              py: isLargeScreen ? 2 : 1.5
                            }}
                          >
                            {item.quantity}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ 
                              fontSize: isLargeScreen ? '1.1rem' : '0.875rem',
                              py: isLargeScreen ? 2 : 1.5
                            }}
                          >
                            {item.price.toLocaleString('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell 
                          colSpan={2}
                          sx={{ 
                            fontSize: isLargeScreen ? '1.2rem' : '1rem',
                            fontWeight: 600,
                            py: isLargeScreen ? 3 : 2
                          }}
                        >
                          Toplam
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ 
                            fontSize: isLargeScreen ? '1.2rem' : '1rem',
                            fontWeight: 600,
                            py: isLargeScreen ? 3 : 2,
                            color: theme.palette.primary.main
                          }}
                        >
                          {order.total.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderDetail; 