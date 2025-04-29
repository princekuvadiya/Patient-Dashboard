import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import patientService from '../services/patientService';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockWeightData } from '../data/mockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightProgressPage = () => {
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    weight: '',
    date: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchWeightHistory = async () => {
      setLoading(true);
      try {
        const result = await patientService.getWeightHistory();
        setWeightHistory(result.success && result.data.length > 0 ? result.data : mockWeightData);
      } catch (error) {
        console.error('Weight history fetch error:', error);
        setWeightHistory(mockWeightData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeightHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const weightData = {
        weight: Number(formData.weight),
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        notes: formData.notes || undefined
      };
      const result = await patientService.addWeightEntry(weightData);
      if (result.success) {
        setWeightHistory([...weightHistory, result.data]);
        setFormData({ weight: '', date: '', notes: '' });
      } else {
        setFormError(result.message || 'Failed to add weight entry');
      }
    } catch (error) {
      setFormError('Failed to add weight entry');
    }
  };

  if (loading) return <LoadingSpinner />;

  const chartData = {
    labels: weightHistory.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightHistory.map((entry) => entry.weight),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weight Progress Over Time' }
    },
    scales: {
      y: {
        title: { display: true, text: 'Weight (kg)' },
        beginAtZero: false
      },
      x: {
        title: { display: true, text: 'Date' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Weight Progress</h2>

      {/* Add Weight Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Weight Entry</h3>
        <form onSubmit={handleAddWeight} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </div>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Weight
          </button>
        </form>
      </div>

      {/* Weight Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {weightHistory.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p className="text-gray-600">No weight data available.</p>
        )}
      </div>
    </div>
  );
};

export default WeightProgressPage;