import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import patientService from '../services/patientService';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightProgressPage = () => {
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeightHistory = async () => {
      setLoading(true);
      try {
        const result = await patientService.getWeightHistory();
        if (result.success) {
          setWeightHistory(result.data);
        }
      } catch (error) {
        console.error('Weight history fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeightHistory();
  }, []);

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