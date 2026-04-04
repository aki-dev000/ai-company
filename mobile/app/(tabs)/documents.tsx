import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { listDirectives, listDocuments, getDocument, Session } from "../../lib/api";
import { colors, spacing, fontSize } from "../../lib/theme";

const STATUS_COLORS: Record<string, string> = {
  running: colors.yellow,
  completed: colors.green,
  error: colors.red,
};

export default function DocumentsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    try {
      const list = await listDirectives();
      setSessions(list);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    listDocuments(selectedSession).then(setDocs).catch(() => {});
    setSelectedFile(null);
    setContent("");
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession || !selectedFile) return;
    getDocument(selectedSession, selectedFile).then(setContent).catch(() => {});
  }, [selectedSession, selectedFile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  };

  // Show document content
  if (selectedFile && content) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedFile(null); setContent(""); }}>
          <Text style={styles.backText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.fileName}>{selectedFile}</Text>
        <ScrollView style={styles.contentScroll} contentContainerStyle={{ padding: spacing.lg }}>
          <Markdown style={markdownStyles}>{content}</Markdown>
        </ScrollView>
      </View>
    );
  }

  // Show document list for session
  if (selectedSession) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setSelectedSession(null); setDocs([]); }}>
          <Text style={styles.backText}>← セッション一覧</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Documents</Text>
        {docs.length === 0 ? (
          <Text style={styles.empty}>ドキュメントがありません</Text>
        ) : (
          <FlatList
            data={docs}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.docItem} onPress={() => setSelectedFile(item)}>
                <Text style={styles.docIcon}>📄</Text>
                <Text style={styles.docName}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // Show sessions list
  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.session_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListEmptyComponent={<Text style={styles.empty}>セッションがありません</Text>}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.sessionCard} onPress={() => setSelectedSession(item.session_id)}>
            <View style={styles.sessionHeader}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] ?? colors.textMuted }]} />
              <Text style={styles.sessionStatus}>{item.status}</Text>
              <Text style={styles.sessionDate}>
                {new Date(item.created_at).toLocaleString("ja-JP")}
              </Text>
            </View>
            <Text style={styles.sessionDirective} numberOfLines={2}>
              {item.directive}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const markdownStyles = StyleSheet.create({
  body: { color: colors.textPrimary, fontSize: fontSize.sm },
  heading1: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: "800", marginVertical: spacing.md },
  heading2: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: "700", marginVertical: spacing.sm },
  heading3: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: "600", marginVertical: spacing.sm },
  code_inline: { backgroundColor: colors.cardAlt, color: colors.accent, borderRadius: 4, paddingHorizontal: 4 },
  fence: { backgroundColor: colors.cardAlt, borderRadius: 8, padding: spacing.md, color: colors.textPrimary },
  link: { color: colors.accent },
  blockquote: { backgroundColor: colors.cardAlt, borderLeftColor: colors.accent, borderLeftWidth: 3, paddingLeft: spacing.md },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  backBtn: { padding: spacing.lg, paddingBottom: 0 },
  backText: { color: colors.accent, fontSize: fontSize.md, fontWeight: "600" },
  fileName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: "700",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  contentScroll: { flex: 1 },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: "700",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 60, fontSize: fontSize.md },
  sessionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  sessionStatus: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sessionDate: { color: colors.textMuted, fontSize: fontSize.xs, marginLeft: "auto" },
  sessionDirective: { color: colors.textPrimary, fontSize: fontSize.md },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
  },
  docIcon: { fontSize: 20 },
  docName: { color: colors.textPrimary, fontSize: fontSize.md, flex: 1 },
});
