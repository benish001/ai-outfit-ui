import React from 'react';
import { BarChart3, LayoutDashboard, Link2, MousePointerClick, Package, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Canonical Products', value: '1,284', icon: Package, color: 'text-blue-600' },
    { label: 'Affiliate Clicks (24h)', value: '432', icon: MousePointerClick, color: 'text-green-600' },
    { label: 'Active Platform APIs', value: '5/5', icon: ShieldCheck, color: 'text-purple-600' },
    { label: 'Broken Links Detected', value: '0', icon: Link2, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Affiliate Engine Control Panel</h1>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              API Status: Systems Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-400 font-medium">+12.5% vs yesterday</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Recent Click Logs (PostgreSQL Sink)</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Product Slug</th>
                    <th className="px-6 py-4">Platform</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { slug: 'iphone-15-pro-blue', platform: 'Amazon India', time: '2 mins ago', status: '302 Redirect' },
                    { slug: 'nike-air-max-270', platform: 'Myntra', time: '14 mins ago', status: '302 Redirect' },
                    { slug: 'sony-wh-1000xm5', platform: 'Flipkart', time: '28 mins ago', status: '302 Redirect' },
                    { slug: 'levis-501-jeans', platform: 'Ajio', time: '1h ago', status: '302 Redirect' },
                  ].map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-700">{log.slug}</td>
                      <td className="px-6 py-4 text-gray-500">{log.platform}</td>
                      <td className="px-6 py-4 text-gray-400">{log.time}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-6">API & Credentials Config</h2>
            <div className="space-y-6">
              {[
                { name: 'Amazon PA-API 5.0', status: 'Connected', bg: 'bg-blue-500' },
                { name: 'vCommission REST', status: 'Pending Approval', bg: 'bg-yellow-500' },
                { name: 'Flipkart Affiliate Feed', status: 'Connected', bg: 'bg-blue-600' },
                { name: 'Myntra Content API', status: 'Active', bg: 'bg-pink-500' },
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${api.bg}`}></div>
                    <span className="text-sm font-medium text-gray-700">{api.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${api.status === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {api.status}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Internal Engine ID</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">TR-128053-SINK-V2</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
