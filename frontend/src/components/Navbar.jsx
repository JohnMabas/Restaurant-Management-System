import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: '🍽️ Menu' },
  { to: '/categories', label: '📂 Categories' },
  { to: '/orders', label: '📋 Orders' },
  { to: '/orders/new', label: '➕ New Order' },
  { to: '/users', label: '👥 Users' },
];

export default function Navbar() {
  return (
    <nav className="bg-teal-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <span className="text-xl font-bold tracking-wide">🍴 RestaurantMS</span>
        <ul className="flex gap-2">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-teal-700'
                      : 'hover:bg-teal-600'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
