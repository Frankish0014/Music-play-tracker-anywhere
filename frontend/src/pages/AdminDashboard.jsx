export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Manage the system</p>
      </div>
      <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Admin features coming soon...</p>
          <p className="text-gray-500">System management tools will be available here.</p>
        </div>
      </div>
    </div>
  );
}

