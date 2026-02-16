import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900">Mass Mailer</h1>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/recruiters"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Recruiters
            </Link>
            <Link
              to="/companies"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/contacts"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Email Contacts
            </Link>
            <Link
              to="/campaigns"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Campaigns
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/campaigns/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Campaign
          </Link>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <span className="text-sm text-gray-700 font-medium">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
