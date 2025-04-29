const DashboardCard = ({ title, value, icon, trend, trendText, status }) => {
    const getTrendColor = () => {
      if (trend === 'down') return 'text-green-500';
      if (trend === 'up') return 'text-red-500';
      if (trend === 'good') return 'text-green-500';
      if (trend === 'warning') return 'text-yellow-500';
      return 'text-gray-500';
    };
  
    const getStatusColor = () => {
      if (status === 'processing') return 'bg-yellow-100 text-yellow-800';
      if (status === 'shipped') return 'bg-blue-100 text-blue-800';
      if (status === 'delivered') return 'bg-green-100 text-green-800';
      if (status === 'delayed') return 'bg-red-100 text-red-800';
      return 'bg-gray-100 text-gray-800';
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
            {trendText && (
              <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
                <span className="material-icons-outlined mr-1 text-base">
                  {trend === 'down' ? 'arrow_downward' : trend === 'up' ? 'arrow_upward' : 'info'}
                </span>
                {trendText}
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <span className="material-icons-outlined">{icon}</span>
          </div>
        </div>
        {status && (
          <div className={`mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status}
          </div>
        )}
      </div>
    );
  };
  
  export default DashboardCard;