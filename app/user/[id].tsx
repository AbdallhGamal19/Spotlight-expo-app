import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spinner from "../../components/apinner";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { styles } from "../../styles/profile.styles";

export default function UserProfilescreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const profile = useQuery(api.users.getUserprofile, {
    id: id as Id<"users">,
  });
  const posts = useQuery(api.posts.getPostsByUserId, {
    userId: id as Id<"users">,
  });
  const isFollowing = useQuery(api.users.isFowllowed, {
    followingId: id as Id<"users">,
  });
  const toggleFollow = useMutation(api.users.toggleFollowing);
  const handleCallBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };
  if (profile === undefined || posts === undefined || isFollowing === undefined)
    return <Spinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCallBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <Image
              source={profile.image}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <Pressable
            style={[styles.followButton, isFollowing && styles.followButton]}
            onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followButtonText,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.postsGrid}>
          {posts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={styles.noPostsText}>No posts yet</Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Image
                    source={item.imageUrl}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy={"memory-disk"}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.postsGrid}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
