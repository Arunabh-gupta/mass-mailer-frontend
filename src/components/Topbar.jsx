export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
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
