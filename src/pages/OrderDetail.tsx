import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid as MuiGrid,
  Divider,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Button,
  IconButton,
} from '@mui/material';
import { ArrowBack, Print } from '@mui/icons-material';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetail {
  id: string;
  orderDate: string;
  customerName: string;
  status: string;
  address: string;
  phone: string;
  items: OrderItem[];
  total: number;
}

const mockOrderDetail: OrderDetail = {
  id: '1',
  orderDate: '2024-03-20',
  customerName: 'Ahmet Yılmaz',
  status: 'Hazırlanıyor',
  address: 'Atatürk Mah. Cumhuriyet Cad. No:123 İstanbul',
  phone: '0532 123 45 67',
  items: [
    {
      id: '1',
      productName: 'iPhone 13',
      quantity: 1,
      price: 42999.99,
      total: 42999.99,
    },
    {
      id: '2',
      productName: 'AirPods Pro',
      quantity: 1,
      price: 7499.99,
      total: 7499.99,
    },
  ],
  total: 50499.98,
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    // TODO: Replace with actual API call
    setOrder(mockOrderDetail);
  }, [id]);

  if (!order) {
    return <Typography>Yükleniyor...</Typography>;
  }

  const handlePrint = () => {
    window.print();
  };

  const MobileOrderItem = ({ item }: { item: OrderItem }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {item.productName}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Adet:</Typography>
          <Typography>{item.quantity}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Birim Fiyat:</Typography>
          <Typography>
            {item.price.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Toplam:</Typography>
          <Typography fontWeight="bold">
            {item.total.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth={isTablet ? "md" : "lg"} sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Siparişlere Dön
        </Button>
        {!isMobile && (
          <IconButton onClick={handlePrint} color="primary">
            <Print />
          </IconButton>
        )}
      </Box>

      <Paper sx={{ p: isMobile ? 2 : 3 }}>
        <MuiGrid container spacing={isMobile ? 2 : 3}>
          <MuiGrid item xs={12}>
            <Box 
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 2,
                mb: 2
              }}
            >
              <Box>
                <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                  Sipariş #{order.id}
                </Typography>
                <Typography color="text.secondary">
                  Sipariş Tarihi: {order.orderDate}
                </Typography>
              </Box>
              <Chip
                label={order.status}
                color={getStatusColor(order.status) as any}
                size={isMobile ? "small" : "medium"}
                sx={{ fontSize: isMobile ? 14 : 16 }}
              />
            </Box>
          </MuiGrid>

          <MuiGrid item xs={12}>
            <Divider />
          </MuiGrid>

          <MuiGrid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Müşteri Bilgileri
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Ad Soyad
                    </Typography>
                    <Typography variant="body1">{order.customerName}</Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Telefon
                    </Typography>
                    <Typography variant="body1">{order.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Adres
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {order.address}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </MuiGrid>

          <MuiGrid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sipariş Özeti
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Toplam Ürün:</Typography>
                    <Typography>{order.items.length} adet</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Durum:</Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Toplam Tutar:</Typography>
                    <Typography variant="h6" color="primary">
                      {order.total.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                      })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </MuiGrid>

          <MuiGrid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Ürünler
            </Typography>
            {isMobile ? (
              <Box sx={{ mt: 2 }}>
                {order.items.map((item) => (
                  <MobileOrderItem key={item.id} item={item} />
                ))}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Genel Toplam:</Typography>
                      <Typography variant="h6" color="primary">
                        {order.total.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ 
                boxShadow: theme.shadows[1],
                borderRadius: theme.shape.borderRadius 
              }}>
                <Table>
                  <TableHead sx={{ bgcolor: theme.palette.grey[50] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ürün</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Adet</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Birim Fiyat</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {item.total.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Genel Toplam
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {order.total.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY',
                        })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </MuiGrid>
        </MuiGrid>
      </Paper>
    </Container>
  );
};

export default OrderDetail; 