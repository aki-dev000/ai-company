import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import {
  Schedule,
  listSchedules,
  createSchedule,
  deleteSchedule,
  toggleSchedule,
  runNow,
} from "../../lib/api";
import { colors, spacing, fontSize } from "../../lib/theme";

const PRESETS = [
  { label: "毎時", cron: "0 * * * *" },
  { label: "毎日 9:00", cron: "0 9 * * *" },
  { label: "毎週月曜", cron: "0 9 * * 1" },
  { label: "毎月1日", cron: "0 9 1 * *" },
];

export default function DispatchScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDirective, setNewDirective] = useState("");
  const [newCron, setNewCron] = useState("0 9 * * *");

  const fetchSchedules = async () => {
    try {
      const list = await listSchedules();
      setSchedules(list);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSchedules();
    setRefreshing(false);
  };

  const handleCreate = async () => {
    if (!newLabel.trim() || !newDirective.trim()) {
      Alert.alert("入力エラー", "ラベルとディレクティブを入力してください");
      return;
    }
    try {
      await createSchedule({ label: newLabel, directive: newDirective, cron: newCron });
      setShowModal(false);
      setNewLabel("");
      setNewDirective("");
      setNewCron("0 9 * * *");
      fetchSchedules();
    } catch {
      Alert.alert("エラー", "スケジュール作成に失敗しました");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("削除確認", "このスケジュールを削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await deleteSchedule(id);
          fetchSchedules();
        },
      },
    ]);
  };

  const handleToggle = async (id: string) => {
    await toggleSchedule(id);
    fetchSchedules();
  };

  const handleRunNow = async (id: string) => {
    try {
      await runNow(id);
      Alert.alert("実行開始", "スケジュールを即座に実行しました");
    } catch {
      Alert.alert("エラー", "実行に失敗しました");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Schedules</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
              <Text style={styles.addBtnText}>+ 新規</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>スケジュールがありません</Text>}
        renderItem={({ item }) => (
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={[styles.statusDot, { backgroundColor: item.enabled ? colors.green : colors.textMuted }]} />
              <Text style={styles.scheduleLabel}>{item.label}</Text>
              <Text style={styles.cronBadge}>{item.cron}</Text>
            </View>
            <Text style={styles.scheduleDirective} numberOfLines={2}>
              {item.directive}
            </Text>
            {item.next_run && (
              <Text style={styles.nextRun}>次回: {item.next_run}</Text>
            )}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggle(item.id)}>
                <Text style={styles.actionText}>{item.enabled ? "停止" : "有効化"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleRunNow(item.id)}>
                <Text style={[styles.actionText, { color: colors.green }]}>今すぐ実行</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                <Text style={[styles.actionText, { color: colors.red }]}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Create Schedule Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新規スケジュール</Text>

            <Text style={styles.inputLabel}>ラベル</Text>
            <TextInput
              style={styles.input}
              placeholder="例: 週次レポート"
              placeholderTextColor={colors.textMuted}
              value={newLabel}
              onChangeText={setNewLabel}
            />

            <Text style={styles.inputLabel}>ディレクティブ</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
              multiline
              placeholder="CEOディレクティブ..."
              placeholderTextColor={colors.textMuted}
              value={newDirective}
              onChangeText={setNewDirective}
            />

            <Text style={styles.inputLabel}>Cron式</Text>
            <View style={styles.presets}>
              {PRESETS.map((p) => (
                <TouchableOpacity
                  key={p.cron}
                  style={[styles.presetChip, newCron === p.cron && styles.presetChipActive]}
                  onPress={() => setNewCron(p.cron)}
                >
                  <Text style={[styles.presetText, newCron === p.cron && styles.presetTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="0 9 * * *"
              placeholderTextColor={colors.textMuted}
              value={newCron}
              onChangeText={setNewCron}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createText}>作成</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: "800" },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: fontSize.sm },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 60, fontSize: fontSize.md },
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  scheduleLabel: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: "600", flex: 1 },
  cronBadge: {
    backgroundColor: colors.cardAlt,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  scheduleDirective: { color: colors.textSecondary, fontSize: fontSize.sm },
  nextRun: { color: colors.textMuted, fontSize: fontSize.xs },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
  actionBtn: { paddingVertical: spacing.xs },
  actionText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: "85%",
  },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: "800" },
  inputLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: "600" },
  input: {
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  presetChip: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  presetChipActive: { backgroundColor: colors.accent },
  presetText: { color: colors.textSecondary, fontSize: fontSize.xs },
  presetTextActive: { color: "#fff" },
  modalActions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cancelText: { color: colors.textSecondary, fontWeight: "600" },
  createBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  createText: { color: "#fff", fontWeight: "700" },
});
