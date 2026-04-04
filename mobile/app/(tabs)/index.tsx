import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Markdown from "react-native-markdown-display";
import DirectiveInput from "../../components/DirectiveInput";
import ActivityFeed from "../../components/ActivityFeed";
import { useSSE } from "../../lib/useSSE";
import { listDocuments, getDocument } from "../../lib/api";
import { colors, spacing, fontSize } from "../../lib/theme";

export default function DashboardScreen() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { events, isConnected, isDone } = useSSE(sessionId);

  const [docs, setDocs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [docContent, setDocContent] = useState("");
  const [view, setView] = useState<"feed" | "docs">("feed");

  // Poll documents while running
  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const list = await listDocuments(sessionId);
        setDocs(list);
      } catch {
        /* ignore */
      }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [sessionId, isDone]);

  // Fetch selected document
  useEffect(() => {
    if (!sessionId || !selectedFile) return;
    getDocument(sessionId, selectedFile).then(setDocContent).catch(() => {});
  }, [sessionId, selectedFile]);

  const handleSubmit = useCallback((sid: string) => {
    setSessionId(sid);
    setDocs([]);
    setSelectedFile(null);
    setDocContent("");
    setView("feed");
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <DirectiveInput onSubmit={handleSubmit} />

        {sessionId && (
          <>
            {/* View toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, view === "feed" && styles.toggleActive]}
                onPress={() => setView("feed")}
              >
                <Text style={[styles.toggleText, view === "feed" && styles.toggleTextActive]}>
                  Activity
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, view === "docs" && styles.toggleActive]}
                onPress={() => setView("docs")}
              >
                <Text style={[styles.toggleText, view === "docs" && styles.toggleTextActive]}>
                  Documents ({docs.length})
                </Text>
              </TouchableOpacity>
            </View>

            {view === "feed" ? (
              <View style={styles.feedContainer}>
                <ActivityFeed events={events} isConnected={isConnected} isDone={isDone} />
              </View>
            ) : (
              <View style={styles.docsContainer}>
                {/* Document list */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.docChips}>
                  {docs.map((doc) => (
                    <TouchableOpacity
                      key={doc}
                      style={[styles.docChip, selectedFile === doc && styles.docChipActive]}
                      onPress={() => setSelectedFile(doc)}
                    >
                      <Text
                        style={[styles.docChipText, selectedFile === doc && styles.docChipTextActive]}
                        numberOfLines={1}
                      >
                        {doc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Document content */}
                {selectedFile && docContent ? (
                  <View style={styles.docViewer}>
                    <Markdown style={markdownStyles}>{docContent}</Markdown>
                  </View>
                ) : (
                  <Text style={styles.placeholder}>
                    {docs.length === 0
                      ? "ドキュメント生成中..."
                      : "ドキュメントを選択してください"}
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 100 },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleActive: { backgroundColor: colors.accent },
  toggleText: { color: colors.textMuted, fontWeight: "600", fontSize: fontSize.sm },
  toggleTextActive: { color: "#fff" },
  feedContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    minHeight: 300,
  },
  docsContainer: { gap: spacing.md },
  docChips: { flexGrow: 0 },
  docChip: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    maxWidth: 180,
  },
  docChipActive: { backgroundColor: colors.accent },
  docChipText: { color: colors.textSecondary, fontSize: fontSize.xs },
  docChipTextActive: { color: "#fff" },
  docViewer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
  },
  placeholder: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 40,
    fontSize: fontSize.sm,
  },
});
