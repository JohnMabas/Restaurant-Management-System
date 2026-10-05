const COLOURS = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready:     'bg-green-100 text-green-800',
  completed: 'bg-gray-200 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Badge({ status }) {
  const colour = COLOURS[status] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colour}`}>
      {status}
    </span>
  );
}
