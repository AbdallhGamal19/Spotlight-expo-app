import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import Spinner from "../../components/apinner";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/feed.styles";

export default function BookMarks() {
  const bookMarks = useQuery(api.posts.getBookmarks);
  if (bookMarks === undefined) return <Spinner />;

  if (bookMarks?.length === 0) return <NotFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BookMarks</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookMarks?.map((post) => {
          if (!post) return null;
          return (
            <View key={post._id} style={{ width: "33.33%", padding: 1 }}>
              <Image
                source={post.imageUrl}
                style={{ width: "100%", aspectRatio: 1 }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const NotFound = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background,
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>Not posts yet</Text>
  </View>
);
