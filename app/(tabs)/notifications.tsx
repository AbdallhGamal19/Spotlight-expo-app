import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import { FlatList, Text, View } from "react-native";
import Spinner from "../../components/apinner";
import NotificationsItem from "../../components/notificationsItem";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/notifications.styles";

export default function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Spinner />;
  if (notifications.length === 0) return <NoFoundNotifications />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationsItem notification={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const NoFoundNotifications = () => (
  <View style={[styles.container, styles.centered]}>
    <Ionicons name="notifications-off" size={48} color={COLORS.primary} />
    <Text style={{ fontSize: 20, color: COLORS.white }}>
      No notification yet
    </Text>
  </View>
);
