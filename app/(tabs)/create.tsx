import { useUser } from "@clerk/clerk-react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/create.styles";
export default function CreatePost() {
  const { user } = useUser();
  const router = useRouter();
  const [postDetails, setPostDetails] = useState({
    caption: "",
    selectedImage: "",
  });
  const [isSharing, setisSharing] = useState(false);
  const { selectedImage, caption } = postDetails;
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  const handelShare = async () => {
    if (!selectedImage) return;
    try {
      setisSharing(true);
      const uploadUrl = await generateUploadUrl();
      const uploadFileResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        }
      );
      if (uploadFileResult.status !== 200)
        throw new Error("Image upload failed");
      const { storageId } = JSON.parse(uploadFileResult.body);
      await createPost({ storageId, caption });
      setPostDetails({ caption: "", selectedImage: "" });
      router.push("/(tabs)");
    } catch (error) {
      console.log("error sharing post", error);
    } finally {
      setisSharing(false);
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPostDetails({ ...postDetails, selectedImage: result.assets[0].uri });
    }
  };
  if (!selectedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>
        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={() => pickImage()}
        >
          <Ionicons name="image-outline" size={48} color={COLORS.grey} />
          <Text style={styles.emptyImageText}>Tab to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 40}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setPostDetails({ caption: "", selectedImage: "" })}
            disabled={isSharing}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              isSharing && styles.shareButtonDisabled,
            ]}
            disabled={isSharing || !selectedImage}
            onPress={handelShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentOffset={{ x: 0, y: 100 }}
        >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => pickImage()}
                disabled={isSharing}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputSection}>
            <View style={styles.captionContainer}>
              <Image
                source={user?.imageUrl || ""}
                style={styles.userAvatar}
                contentFit="cover"
                transition={200}
              />
              <TextInput
                style={styles.captionInput}
                value={caption}
                placeholder="Wright a caption..."
                placeholderTextColor={COLORS.grey}
                multiline
                onChange={(e) =>
                  setPostDetails({
                    ...postDetails,
                    caption: e.nativeEvent.text,
                  })
                }
                editable={!isSharing}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
