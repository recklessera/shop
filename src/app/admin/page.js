export default function AdminDashboardOverview() {
  // We will wire these up to the database in Week 4 when we build the Analytics engine.
  // For now, we establish the structural layout.
  const kpis = [
    { name: 'Total Revenue', value: '₦0.00' },
    { name: 'Total Orders', value: '0' },
    { name: 'Average Order Value', value: '₦0.00' },
    { name: 'Total Customers', value: '0' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-left">Dashboard Overview</h2>
      
      {/* KPI Tracker */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-background border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 text-left">{kpi.name}</h3>
            <p className="mt-2 text-3xl font-semibold text-foreground text-left">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Data Visualizations (Week 4) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background border border-gray-200 rounded-lg p-6 h-96 flex flex-col justify-center items-center shadow-sm">
          <h3 className="text-lg font-medium text-foreground w-full text-left mb-4">Sales Trends</h3>
          <p className="text-gray-400 text-sm">Chart will be implemented in Week 4 (Recharts)</p>
        </div>
        
        <div className="bg-background border border-gray-200 rounded-lg p-6 h-96 flex flex-col justify-center items-center shadow-sm">
          <h3 className="text-lg font-medium text-foreground w-full text-left mb-4">Inventory Alerts</h3>
          <p className="text-gray-400 text-sm">Low stock items will populate here.</p>
        </div>
      </div>
    </div>
  )
}