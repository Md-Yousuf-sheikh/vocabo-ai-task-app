import { Component, ReactNode } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { triggerHaptic } from "./haptics";
import { colors, fontSizes, spacing } from "@theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: ""
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, message: "" });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.message}</Text>
          <TouchableOpacity
            onPress={async () => {
              await triggerHaptic();
              this.handleRetry();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: colors.background,
    paddingTop: (StatusBar.currentHeight ?? 0) + spacing.md,
  },
  title: { 
    color: colors.text,
    fontSize: 22,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  message: { 
    color: colors.textSecondary, textAlign: "center", marginBottom: spacing.lg,
    fontSize: fontSizes.sm,
  },
  button: { 
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: fontSizes.sm,
  },
});
