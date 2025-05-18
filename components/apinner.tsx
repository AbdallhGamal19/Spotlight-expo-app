import React from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function Spinner() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
