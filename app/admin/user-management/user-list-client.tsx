"use client";

import { useState } from "react";
import { updateUserRole } from "./users";

export default function UserListClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      // Update local state to reflect change immediately
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="wrapper py-10">
      <h1 className="h1-bold mb-6">User Permissions</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex-between p-4 border rounded-xl bg-card">
            <p className="font-medium">{user.email}</p>
            
            <select 
              disabled={loading === user.id}
              defaultValue={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="bg-background border p-2 rounded-lg cursor-pointer"
            >
              <option value="client">Client</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}