import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { submitDirective } from "../lib/api";
import { colors, spacing, fontSize } from "../lib/theme";

const EXAMPLES = [
  "AIを活用した新規プロダクトの事業計画を策定してください",
  "2025年Q1の全社業績レビューを行い、改善提案を出してください",
  "note向けにAIエージェントの技術記事を書いてください",
];

interface Props {
  onSubmit: (sessionId: string) => void;
}

export default function DirectiveInput({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  const handleSubmit = async () => {
    const directive = text.trim();
    if (!directive || loading) return;
    setLoading(true);
    try {
      const res = await submitDirective(directive, autoMode);
      onSubmit(res.session_id);
      setText("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "送信に失敗しました";
      Alert.alert("エラー", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CEO Directive</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={3}
        placeholder="ディレクティブを入力..."
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        editable={!loading}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examples}>
        {EXAMPLES.map((ex, i) => (
          <TouchableOpacity
            key={i}
            style={styles.exampleChip}
            onPress={() => setText(ex)}
          >
            <Text style={styles.exampleText} numberOfLines={1}>
              {ex}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.autoToggle}
          onPress={() => setAutoMode(!autoMode)}
        >
          <View style={[styles.checkbox, autoMode && styles.checkboxOn]} />
          <Text style={styles.autoText}>Auto Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || !text.trim()}
        >
          <Text style={styles.submitText}>{loading ? "送信中..." : "送信"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.border,
  },
  examples: { flexGrow: 0 },
  exampleChip: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    maxWidth: 220,
  },
  exampleText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  autoToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  checkboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  autoText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: fontSize.md,
  },
});
