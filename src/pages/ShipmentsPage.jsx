import { useEffect, useState } from 'react';
import patientService from '../services/patientService';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockShipments } from '../data/mockData';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDeliveryDate: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      try {
        const result = await patientService.getShipments();
        setShipments(result.success && result.data.length > 0 ? result.data : mockShipments);
      } catch (error) {
        console.error('Shipments fetch error:', error);
        setShipments(mockShipments);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const shipmentData = {
        ...formData,
        estimatedDeliveryDate: new Date(formData.estimatedDeliveryDate).toISOString()
      };
      const result = await patientService.addShipment(shipmentData);
      if (result.success) {
        setShipments([...shipments, result.data]);
        setFormData({ trackingNumber: '', carrier: '', estimatedDeliveryDate: '' });
      } else {
        setFormError(result.message || 'Failed to add shipment');
      }
    } catch (error) {
      setFormError('Failed to add shipment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Shipment Tracking</h2>

      {/* Add Shipment Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Shipment</h3>
        <form onSubmit={handleAddShipment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleInputChange}
              className="mt-1 text-black  block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carrier</label>
            <input
              type="text"
              name="carrier"
              value={formData.carrier}
              onChange={handleInputChange}
              className="mt-1 block text-black w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Delivery Date</label>
            <input
              type="date"
              name="estimatedDeliveryDate"
              value={formData.estimatedDeliveryDate}
              onChange={handleInputChange}
              className="mt-1 block text-black w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Shipment
          </button>
        </form>
      </div>

      {/* Shipments Table */}
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
                <tr key={shipment.trackingNumber || shipment._id}>
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