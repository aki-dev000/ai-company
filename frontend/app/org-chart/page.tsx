"use client";
import { useEffect, useState } from "react";
import { getOrgChart, Agent } from "@/lib/api";

const DEPT_LABELS: Record<string, string> = {
  executive: "経営陣",
  engineering: "エンジニアリング",
  product: "プロダクト",
  marketing: "マーケティング",
  sales: "セールス",
  hr: "HR",
  finance: "ファイナンス",
};

function AgentCard({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-700 rounded-xl p-3 cursor-pointer hover:border-gray-500 transition-colors bg-gray-900"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: agent.avatar_color }}
        >
          {agent.display_name[0]}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{agent.display_name}</p>
          <p className="text-xs text-gray-400">{agent.name}</p>
        </div>
      </div>
      {open && (
        <ul className="mt-2 space-y-0.5">
          {agent.responsibilities.map((r, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-1">
              <span className="text-gray-600">•</span>{r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    getOrgChart().then(setAgents);
  }, []);

  const tiers = [1, 2, 3, 4];
  const byTier = (tier: number) => agents.filter((a) => a.tier === tier);
  const byDept = (tier: number) => {
    const depts: Record<string, Agent[]> = {};
    for (const a of byTier(tier)) {
      depts[a.department] = [...(depts[a.department] || []), a];
    }
    return depts;
  };

  const tierLabels: Record<number, string> = {
    1: "C-Suite",
    2: "VP / Manager",
    3: "Lead / Specialist",
    4: "Individual Contributor",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">組織図</h1>
      <p className="text-sm text-gray-400 mb-6">TechForward Inc. — クリックで担当業務を表示</p>

      {tiers.map((tier) => {
        const depts = byDept(tier);
        if (Object.keys(depts).length === 0) return null;
        return (
          <div key={tier} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Tier {tier} — {tierLabels[tier]}
              </span>
              <div className="flex-1 border-t border-gray-800" />
            </div>
            <div className="flex flex-wrap gap-4">
              {Object.entries(depts).map(([dept, deptAgents]) => (
                <div key={dept} className="flex-1 min-w-[200px]">
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    {DEPT_LABELS[dept] || dept}
                  </p>
                  <div className="space-y-2">
                    {deptAgents.map((a) => (
                      <AgentCard key={a.id} agent={a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
