import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/theme";
import { api } from "../convex/_generated/api";
import { ICommentModal } from "../interfaces/interfaces";
import { styles } from "../styles/feed.styles";
import Spinner from "./apinner";
import Comment from "./comment";

export default function CommentModal({
  onClose,
  postId,
  visible,
}: ICommentModal) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.posts.getComments, { postId });
  const addComment = useMutation(api.posts.addComment);
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({ postId, comment: newComment });
      setNewComment("");
    } catch (error) {
      throw new Error("Failed to add comment", { cause: error });
    }
  };
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        {comments === undefined ? (
          <Spinner />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={styles.commentsList}
          />
        )}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="add a comment..."
            multiline
            value={newComment}
            onChangeText={setNewComment}
            placeholderTextColor={COLORS.grey}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !newComment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
