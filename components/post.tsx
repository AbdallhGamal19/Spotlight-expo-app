import { useUser } from "@clerk/clerk-react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/theme";
import { api } from "../convex/_generated/api";
import { IPost } from "../interfaces/interfaces";
import { styles } from "../styles/feed.styles";
import CommentModal from "./commentModal";
export default function Post({ post }: { post: IPost }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const [showComments, setShowComments] = useState(false);
  const toggeleLike = useMutation(api.posts.toogleLike);
  const toogelBookmark = useMutation(api.posts.toogleBookmark);
  const deletePost = useMutation(api.posts.deletePost);
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );
  const handleLike = async () => {
    try {
      const newLike = await toggeleLike({ postId: post._id });
      setIsLiked(newLike);
    } catch (error) {
      throw new Error("Failed to toggle like", { cause: error });
    }
  };

  const handleBookmark = async () => {
    try {
      // Attempt to toggle the bookmark status of the current post
      const newBookmark = await toogelBookmark({ postId: post._id });

      // Update the isBookmarked state with the result
      setIsBookmarked(newBookmark);
    } catch (error) {
      // Throw an error with a descriptive message if the operation fails
      throw new Error("Failed to toggle bookmark", { cause: error });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      throw new Error("Failed to delete post", { cause: error });
    }
  };
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link
          href={
            currentUser?._id === post.author._id
              ? `/(tabs)/profile`
              : `/user/${post.author._id}`
          }
          asChild
        >
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>
        {post.author._id === currentUser?._id ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy={"memory-disk"}
      />
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmarked ? COLORS.primary : COLORS.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {post.likes > 0
            ? `${post.likes.toLocaleString()} likes`
            : "be the first to like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Text style={styles.commentText}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>
      <CommentModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}
