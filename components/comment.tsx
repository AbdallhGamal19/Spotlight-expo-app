import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { IComment } from "../interfaces/interfaces";
import { styles } from "../styles/feed.styles";
export default function Comment({ comment }: { comment: IComment }) {
  return (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user.image }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user.username}</Text>
        <Text style={styles.commentText}>{comment.conten}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
