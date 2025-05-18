import { Id } from "../convex/_generated/dataModel.js";

export interface IPost {
  imageUrl: string;
  _id: Id<"posts">;
  caption?: string;
  isLiked: boolean;
  comments: number;
  likes: number;
  isBookmarked: boolean;
  _creationTime: number;
  author: {
    _id: Id<"users">;
    username: string;
    image: string;
  };
}
export interface ICommentModal {
  onClose: () => void;

  postId: Id<"posts">;
  visible: boolean;
}
export interface IComment {
  _creationTime: number;
  conten: string;
  user: {
    username: string;
    image: string;
  };
}

export interface INotification {
  _id: Id<"notifications">;
  _creationTime: number;
  type: "like" | "comment" | "follow"; // غيّر حسب الأنواع اللي عندك
  receiverId: Id<"users">;
  senderId: Id<"users">;
  postId?: Id<"posts">;
  commentId?: Id<"comments">;
  sender: {
    _id: string;
    username: string;
    image: string;
  };
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string;
    userId: Id<"users">;
    imageUrl: string;

    likes: number;
    comments: number;
  } | null;
  comment?: string;
}
