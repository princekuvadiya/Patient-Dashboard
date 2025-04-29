import { format } from 'date-fns';

const ShipmentCard = ({ shipment }) => {
  const getStatusColor = () => {
    switch (shipment.status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">Medication Shipment</h3>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(shipment.shippedDate || shipment.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {shipment.status}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Tracking Number</p>
          <p className="font-medium">
            {shipment.trackingNumber || 'Not available'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Carrier</p>
          <p className="font-medium">
            {shipment.carrier || 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated Delivery</p>
          <p className="font-medium">
            {format(new Date(shipment.estimatedDeliveryDate), 'MMM d, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Delivered On</p>
          <p className="font-medium">
            {shipment.deliveredDate 
              ? format(new Date(shipment.deliveredDate), 'MMM d, yyyy') 
              : 'Not delivered'}
          </p>
        </div>
      </div>
      
      {shipment.trackingNumber && (
        <div className="mt-4">
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Track shipment
            <span className="material-icons-outlined ml-1 text-base">open_in_new</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;