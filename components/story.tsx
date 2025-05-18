import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/feed.styles";
interface StoryProps {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
}
export default function Story({ id, username, avatar, hasStory }: StoryProps) {
  return (
    <TouchableOpacity style={styles.storyWrapper}>
      <View style={[styles.storyRing, !hasStory && styles.noStory]}>
        <Image source={{ uri: avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername}>{username}</Text>
    </TouchableOpacity>
  );
}
