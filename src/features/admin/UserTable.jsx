import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Shield, User as UserIcon } from 'lucide-react';
import api from '../../services/api';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center opacity-20 animate-pulse font-black uppercase tracking-widest text-xs">Loading User Registry...</div>;

  return (
    <div className="bg-white rounded-[40px] shadow-premium overflow-hidden border border-black/5">
      <table className="w-full text-left">
        <thead className="bg-[#fcfcfc] border-b border-black/5">
          <tr>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Identity</th>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Role</th>
            <th className="px-10 py-8 text-[9px] uppercase font-black tracking-widest text-muted italic">Timeline</th>
            <th className="px-10 py-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 text-sm">
          {users.map((user) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-black/[0.02] transition-colors"
            >
              <td className="px-10 py-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-[#f8f8f8] border border-black/5 flex items-center justify-center text-brand-dark shadow-inner">
                      {user.profile_image ? (
                        <img src={user.profile_image} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                   </div>
                   <div className="space-y-0.5">
                      <p className="font-bold luxury-font text-lg">{user.name}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-30">{user.email}</p>
                   </div>
                </div>
              </td>
              <td className="px-10 py-8 text-black font-black uppercase tracking-widest">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] ${user.is_admin ? 'bg-orange-vibrant/10 text-orange-vibrant' : 'bg-green-500/10 text-green-600'}`}>
                  {user.is_admin ? <Shield size={10} /> : <UserIcon size={10} />}
                  {user.is_admin ? 'Admin' : 'Member'}
                </div>
              </td>
              <td className="px-10 py-8 text-muted font-bold tracking-tight">
                {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </td>
              <td className="px-10 py-8 text-right">
                <button className="p-3 hover:bg-black/5 rounded-full transition-colors opacity-30 hover:opacity-100">
                   <MoreVertical size={20} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
