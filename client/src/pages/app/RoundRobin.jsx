import { useEffect, useState } from "react";
import RoundRobinBoard from "../../components/RoundRobinBoard.jsx";
import { useAuth } from "../../lib/authProvider.jsx";
import { loadPools, savePools } from "../../lib/roundRobinStorage.js";

/**
 * RoundRobin page
 * - Reads pools from localStorage (stub)
 * - Allows managers/BDC to edit; others view-only
 * - Replace storage with Firestore later
 */
export default function RoundRobin() {
  const [pools, setPools] = useState(loadPools());
  const { user, role } = useAuth();
  const canEdit = role === "manager" || role === "bdc" || role === "admin";

  useEffect(() => {
    // In a real app, subscribe to Firestore changes here
  }, []);

  const handleChange = (next) => {
    setPools(next);
    savePools(next);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Routing & Round Robin</h1>
        <span className="text-xs text-[#9FB0C6]">
          Role: <strong className="text-[#E6F1FF]">{role}</strong>
        </span>
      </div>

      <RoundRobinBoard pools={pools} canEdit={canEdit} onChange={handleChange} />
    </div>
  );
}