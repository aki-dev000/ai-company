import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SSEEvent } from "../lib/api";
import { colors, spacing, fontSize } from "../lib/theme";

interface Props {
  events: SSEEvent[];
  isConnected: boolean;
  isDone: boolean;
}

function eventIcon(type: string): string {
  switch (type) {
    case "planning_start": return "🧠";
    case "plan_ready": return "📋";
    case "step_start": return "▶️";
    case "step_complete": return "✅";
    case "agent_start": return "🤖";
    case "agent_token": return "💬";
    case "agent_done": return "📄";
    case "tool_use": return "🔧";
    case "tool_result": return "📥";
    case "run_complete": return "🎉";
    case "error": return "❌";
    case "notification_start": return "📤";
    case "notification_done": return "✉️";
    case "screenshot": return "📸";
    default: return "•";
  }
}

function eventText(ev: SSEEvent): string {
  switch (ev.type) {
    case "planning_start":
      return "実行計画を生成中...";
    case "plan_ready": {
      const steps = ev.steps as Array<{ agents: string[] }>;
      const agentCount = steps.reduce((sum, s) => sum + s.agents.length, 0);
      return `計画完了: ${steps.length}ステップ / ${agentCount}エージェント`;
    }
    case "step_start":
      return `Step ${ev.step_index}: ${ev.label}`;
    case "step_complete":
      return `Step ${ev.step_index} 完了`;
    case "agent_start":
      return `${ev.agent_id} 実行開始`;
    case "agent_token": {
      const token = String(ev.token ?? "");
      return `${ev.agent_id}: ${token.length > 80 ? token.slice(0, 80) + "..." : token}`;
    }
    case "agent_done":
      return `${ev.agent_id} → ${ev.document}`;
    case "tool_use":
      return `🔧 ${ev.agent_id}: ${ev.tool_name}`;
    case "tool_result":
      return `📥 ${ev.agent_id}: 結果取得`;
    case "run_complete":
      return "全ステップ完了！";
    case "error":
      return `エラー: ${ev.message}`;
    case "notification_start":
      return `通知送信中: ${ev.service}`;
    case "notification_done":
      return `通知完了: ${ev.service}`;
    default:
      return ev.type;
  }
}

export default function ActivityFeed({ events, isConnected, isDone }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [events]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        {isConnected && (
          <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.badgeText}>Live</Text>
          </View>
        )}
        {isDone && (
          <View style={[styles.badge, { backgroundColor: colors.green + "22" }]}>
            <Text style={[styles.badgeText, { color: colors.green }]}>Done</Text>
          </View>
        )}
      </View>
      <ScrollView ref={scrollRef} style={styles.feed} contentContainerStyle={styles.feedContent}>
        {events.length === 0 ? (
          <Text style={styles.empty}>ディレクティブを送信すると、ここに進捗が表示されます</Text>
        ) : (
          events.map((ev, i) => (
            <View key={i} style={[styles.event, ev.type === "error" && styles.errorEvent]}>
              <Text style={styles.icon}>{eventIcon(ev.type)}</Text>
              <Text style={styles.eventText} numberOfLines={3}>
                {eventText(ev)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "700" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent + "22",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green },
  badgeText: { color: colors.accent, fontSize: fontSize.xs, fontWeight: "600" },
  feed: { flex: 1 },
  feedContent: { paddingBottom: spacing.md },
  empty: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: "center", marginTop: 40 },
  event: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  errorEvent: { backgroundColor: colors.red + "15" },
  icon: { fontSize: fontSize.sm, marginTop: 2 },
  eventText: { flex: 1, color: colors.textSecondary, fontSize: fontSize.sm },
});
