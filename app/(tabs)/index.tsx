import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useQuery } from "convex/react";
import Spinner from "../../components/apinner";
import Post from "../../components/post";
import Stories from "../../components/stories";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/feed.styles";

export default function Index() {
  const [refrshing, setRefrshing] = useState(false);
  const posts = useQuery(api.posts.getFeedPosts);
  const { signOut } = useAuth();
  if (posts?.length === 0) {
    return <NotFound />;
  }
  if (posts === undefined) {
    return <Spinner />;
  }
  const handelOnrefresh = () => {
    setRefrshing(true);
    setTimeout(() => {
      setRefrshing(false);
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={() => <Stories />}
        refreshControl={
          <RefreshControl
            refreshing={refrshing}
            onRefresh={handelOnrefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const NotFound = () => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.background,
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>Not posts yet</Text>
  </View>
);
