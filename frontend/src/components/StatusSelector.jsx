import './StatusSelector.css';

const StatusSelector = ({ value, onChange }) => {
  const statuses = [
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'reading', label: 'Reading' },
    { value: 'complete', label: 'Complete' },
  ];

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="status-selector">
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
};

export default StatusSelector;
