import { useEffect, useState } from 'react';
import patientService from '../services/patientService';
import LoadingSpinner from '../components/LoadingSpinner';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const result = await patientService.getShipments();
        if (result.success) {
          setShipments(result.data);
        }
      } catch (error) {
        console.error('Shipments fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Shipment Tracking</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
        {shipments.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Delivery
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.trackingNumber}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.trackingNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.carrier}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        shipment.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : shipment.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : shipment.status === 'delayed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.estimatedDeliveryDate
                      ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No shipments available.</p>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;