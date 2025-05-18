import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Spinner from "../../components/apinner";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { styles } from "../../styles/profile.styles";

export default function Profile() {
  const { userId, signOut } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const [editProfile, setEditProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });
  const [selectPost, setSelectPost] = useState<Doc<"posts"> | null>(null);
  const post = useQuery(api.posts.getPostsByUserId, {});
  const updateProfile = useMutation(api.users.updateProfile);
  const handleSaveProfile = async () => {
    await updateProfile(editProfile);
    setIsEditModalVisible(false);
  };
  if (!currentUser || post === undefined) return <Spinner />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <Image
              source={{ uri: currentUser.image }}
              style={styles.avatar}
              transition={200}
              contentFit="cover"
            />
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.followers}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.following}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
          <Text style={styles.username}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        {post.length === 0 && <NotFountPosts />}
        <FlatList
          data={post}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setSelectPost(item)}
            >
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      {/* edit profile modal */}
      <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        animationType="slide"
        transparent
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editProfile.fullname}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, fullname: text }))
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editProfile.bio}
                  onChangeText={(text) =>
                    setEditProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.white}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      {/* selectPost modal */}
      <Modal
        visible={!!selectPost}
        onRequestClose={() => setSelectPost(null)}
        animationType="fade"
        transparent
      >
        <View style={styles.modalBackdrop}>
          {selectPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectPost(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Image
                source={selectPost.imageUrl}
                style={styles.postDetailImage}
                cachePolicy={"memory-disk"}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const NotFountPosts = () => (
  <View
    style={{
      height: "100%",
      backgroundColor: COLORS.background,

      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Ionicons name="images-outline" size={48} color={COLORS.primary} />
    <Text style={{ fontSize: 20, color: COLORS.white }}>No Post yet</Text>
  </View>
);
