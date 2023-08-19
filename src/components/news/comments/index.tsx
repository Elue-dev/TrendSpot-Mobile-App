import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Comment, CommentProps } from "../../../types/news";
import { formatTimeAgo } from "../../../helpers";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { useAuth } from "../../../context/auth/AuthContext";
import CommentLayout from "./CommentLayout";

export default function Comments({
  comments,
  setComment,
  setHeightAdjust,
  inputRef,
  setCommentType,
  setCommentId,
  setIsReplying,
  setCommentAuthor,
}: CommentProps) {
  const { isDarkMode } = useSheet();
  const {
    state: { user },
  } = useAuth();

  function initiateEditAction(comment: Comment) {
    setComment(comment.message);
    setHeightAdjust(true);
    inputRef.current.focus();
    setCommentType("edit");
    setCommentId(comment.id);
  }

  function initiateReplyAction(comment: Comment) {
    setHeightAdjust(true);
    inputRef.current.focus();
    setCommentType("new");
    setIsReplying(true);
    setCommentAuthor(`${comment.author.firstName} ${comment.author.lastName}`);
    setCommentId(comment.id);
  }

  return (
    <View className="mt-5 mx-2">
      <FlatList
        keyExtractor={(comments) => comments.id}
        showsHorizontalScrollIndicator={false}
        data={comments}
        scrollEnabled={false}
        renderItem={({ item: comment }) => (
          <CommentLayout
            comment={comment}
            initiateEditAction={initiateEditAction}
            initiateReplyAction={initiateReplyAction}
          />
        )}
      />
    </View>
  );
}
