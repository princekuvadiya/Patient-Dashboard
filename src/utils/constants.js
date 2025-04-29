export const mockWeightData = [
    { date: '2023-01-01', weight: 95 },
    { date: '2023-01-08', weight: 94.5 },
    { date: '2023-01-15', weight: 93.8 },
    { date: '2023-01-22', weight: 93.2 },
    { date: '2023-01-29', weight: 92.5 },
    { date: '2023-02-05', weight: 91.8 },
    { date: '2023-02-12', weight: 91.2 },
    { date: '2023-02-19', weight: 90.5 },
    { date: '2023-02-26', weight: 89.8 },
    { date: '2023-03-05', weight: 89.2 },
    { date: '2023-03-12', weight: 88.5 },
    { date: '2023-03-19', weight: 87.8 },
    { date: '2023-03-26', weight: 87.2 },
    { date: '2023-04-02', weight: 86.5 },
    { date: '2023-04-09', weight: 85.8 },
    { date: '2023-04-16', weight: 85.2 },
    { date: '2023-04-23', weight: 84.5 },
  ];
  
  export const mockShipments = [
    {
      _id: '1',
      trackingNumber: 'UPS123456789',
      carrier: 'UPS',
      status: 'delivered',
      shippedDate: '2023-03-01',
      estimatedDeliveryDate: '2023-03-05',
      deliveredDate: '2023-03-04'
    },
    {
      _id: '2',
      trackingNumber: 'FEDEX987654321',
      carrier: 'FedEx',
      status: 'delivered',
      shippedDate: '2023-04-01',
      estimatedDeliveryDate: '2023-04-05',
      deliveredDate: '2023-04-04'
    },
    {
      _id: '3',
      trackingNumber: 'USPS567891234',
      carrier: 'USPS',
      status: 'shipped',
      shippedDate: '2023-05-01',
      estimatedDeliveryDate: '2023-05-07'
    }
  ];