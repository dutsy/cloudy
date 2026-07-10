"use client";

import { useState } from "react";
import { updateUserRole } from "./users";
import { Profile } from "@/types"; // 1. Import your global Profile type!

// 2. Define the props interface
interface UserListClientProps {
  initialUsers: Profile[];
}

// 3. Apply the interface to the component
export default function UserListClient({ initialUsers }: UserListClientProps) {
  // 4. (Optional but good) explicitly type the state just in case
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      // Update local state to reflect change immediately
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch { 
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
              defaultValue={user.role || "client"} // Added fallback just in case role is null in DB
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