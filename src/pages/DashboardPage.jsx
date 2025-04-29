import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import patientService from '../services/patientService';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [weightHistory, setWeightHistory] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [weightResult, shipmentResult] = await Promise.all([
          patientService.getWeightHistory(),
          patientService.getShipments()
        ]);
        if (weightResult.success) setWeightHistory(weightResult.data);
        if (shipmentResult.success) setShipments(shipmentResult.data);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || currentUser?.currentWeight;
  const nextShipment = shipments.find(s => s.status === 'processing' || s.status === 'shipped') || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Current Weight Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Current Weight</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {latestWeight ? `${latestWeight} kg` : 'N/A'}
          </p>
          {currentUser?.bmi && (
            <p className="mt-1 text-sm text-gray-600">BMI: {currentUser.bmi}</p>
          )}
        </div>

        {/* Progress Snapshot */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Progress</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {currentUser?.progressPercentage ? `${currentUser.progressPercentage}%` : '0%'}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Toward goal of {currentUser?.goalWeight || 'N/A'} kg
          </p>
        </div>

        {/* Next Shipment */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Next Shipment</h3>
          <p className="mt-2 text-sm text-gray-600">
            {nextShipment.estimatedDeliveryDate
              ? new Date(nextShipment.estimatedDeliveryDate).toLocaleDateString()
              : 'No upcoming shipments'}
          </p>
          {nextShipment.trackingNumber && (
            <p className="mt-1 text-sm text-gray-600">
              Tracking: {nextShipment.trackingNumber}
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats or Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">Recent Weight Entries</h3>
        {weightHistory.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {weightHistory.slice(-3).reverse().map((entry) => (
              <li key={entry.date} className="text-sm text-gray-600">
                {new Date(entry.date).toLocaleDateString()}: {entry.weight} kg
                {entry.notes && ` - ${entry.notes}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-600">No weight entries yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;