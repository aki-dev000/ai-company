import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { getOrgChart, Agent } from "../../lib/api";
import { colors, spacing, fontSize } from "../../lib/theme";

const TIER_LABELS: Record<number, string> = {
  1: "C-Suite",
  2: "VP / Manager",
  3: "Lead / Specialist",
  4: "Individual Contributor",
};

const DEPT_LABELS: Record<string, string> = {
  executive: "経営層",
  engineering: "エンジニアリング",
  product: "プロダクト",
  marketing: "マーケティング",
  finance: "ファイナンス",
  operations: "オペレーション",
  hr: "人事",
  design: "デザイン",
  sales: "セールス",
  research: "リサーチ",
};

export default function OrgChartScreen() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgents = async () => {
    try {
      const data = await getOrgChart();
      setAgents(data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAgents();
    setRefreshing(false);
  };

  // Group by tier, then by department
  const tiers = [1, 2, 3, 4].filter((t) => agents.some((a) => a.tier === t));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      {tiers.map((tier) => {
        const tierAgents = agents.filter((a) => a.tier === tier);
        const depts = [...new Set(tierAgents.map((a) => a.department))];

        return (
          <View key={tier} style={styles.tierSection}>
            <Text style={styles.tierTitle}>{TIER_LABELS[tier] ?? `Tier ${tier}`}</Text>
            {depts.map((dept) => (
              <View key={dept} style={styles.deptGroup}>
                <Text style={styles.deptLabel}>
                  {DEPT_LABELS[dept] ?? dept}
                </Text>
                {tierAgents
                  .filter((a) => a.department === dept)
                  .map((agent) => (
                    <TouchableOpacity
                      key={agent.id}
                      style={styles.agentCard}
                      onPress={() =>
                        setExpanded(expanded === agent.id ? null : agent.id)
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.agentRow}>
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: agent.avatar_color },
                          ]}
                        >
                          <Text style={styles.avatarText}>
                            {agent.display_name.charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.agentInfo}>
                          <Text style={styles.agentName}>
                            {agent.display_name}
                          </Text>
                          <Text style={styles.agentId}>{agent.id}</Text>
                        </View>
                      </View>
                      {expanded === agent.id && (
                        <View style={styles.expandedContent}>
                          <Text style={styles.expandedLabel}>Output:</Text>
                          <Text style={styles.expandedValue}>
                            {agent.output_document}
                          </Text>
                          {agent.reports_to && (
                            <>
                              <Text style={styles.expandedLabel}>Reports to:</Text>
                              <Text style={styles.expandedValue}>
                                {agent.reports_to}
                              </Text>
                            </>
                          )}
                          <Text style={styles.expandedLabel}>System Prompt:</Text>
                          <Text style={styles.systemPrompt} numberOfLines={6}>
                            {agent.system_prompt}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, gap: spacing.xl, paddingBottom: 100 },
  tierSection: { gap: spacing.md },
  tierTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: "800",
  },
  deptGroup: { gap: spacing.sm },
  deptLabel: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  agentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  agentRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: fontSize.lg },
  agentInfo: { flex: 1 },
  agentName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600" },
  agentId: { color: colors.textMuted, fontSize: fontSize.xs },
  expandedContent: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  expandedLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: "600" },
  expandedValue: { color: colors.textSecondary, fontSize: fontSize.sm },
  systemPrompt: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: "italic" },
});
