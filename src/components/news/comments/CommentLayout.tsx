import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { formatTimeAgo } from "../../../helpers";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { useAuth } from "../../../context/auth/AuthContext";
import { Comment } from "../../../types/news";
import { useState } from "react";
import { parseText } from "../../../utils";

export default function CommentLayout({
  allComments,
  comment,
  replies,
  initiateEditAction,
  initiateReplyAction,
}: any) {
  const { isDarkMode } = useSheet();
  const {
    state: { user },
  } = useAuth();
  const [showReplies, setShowReplies] = useState(false);

  function getReplies(commentId: string) {
    return allComments?.filter(
      (comment: Comment) => comment.parentId === commentId
    );
  }

  function formatCommentMessage(message: string) {
    const words = message.split(/\s/g);
    return words.map((word, index) => {
      if (index === 0 && word.startsWith("@")) {
        return (
          <Text key={index} className="text-primaryColorDisabled">
            {word}{" "}
          </Text>
        );
      } else if (index === 1 && words[index - 1].startsWith("@")) {
        return (
          <Text key={index} className="text-primaryColorDisabled">
            {word}{" "}
          </Text>
        );
      } else {
        return <Text key={index}>{word} </Text>;
      }
    });
  }

  return (
    <View className="">
      <View className="flex-row justify-between mb-3">
        <View className="flex-row items-start gap-2">
          <Image
            source={{ uri: comment.author.avatar }}
            className="h-9 w-9 rounded-full bg-primaryColorLighter"
          />
          <View>
            <View className="flex-row items-center gap-1">
              <Text className="text-darkNeutral dark:text-lightGray font-normal text-[15px]">
                {comment.author.firstName} {comment.author.lastName}
              </Text>
              {comment?.author.isAdmin ? (
                <MaterialIcons
                  name="verified"
                  size={14}
                  color={
                    isDarkMode ? COLORS.primaryColorTheme : COLORS.primaryColor
                  }
                />
              ) : null}
            </View>
            <Text className="text-gray-500 dark:text-authDark text-[13px] font-normal">
              {formatTimeAgo(comment.createdAt)}{" "}
              {comment.isEdited && <Text>. Edited</Text>}
            </Text>

            <Text className="text-darkNeutral dark:text-lightText text-base w-72">
              {formatCommentMessage(comment.message)}
            </Text>

            <View className="mt-2">
              {getReplies(comment.id)?.length !== 0 && (
                <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
                  {showReplies ? (
                    <Text className="font-light text-darkNeutral dark:text-lightText text-[12px]">
                      Hide Replies
                    </Text>
                  ) : (
                    <>
                      {replies?.length > 0 && (
                        <Text className="font-light text-darkNeutral dark:text-lightText text-[12px]">
                          Show Replies ({replies?.length})
                        </Text>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View className="flex-row items-center">
          {comment.authorId !== user?.id ? (
            <TouchableOpacity
              onPress={() => initiateReplyAction(comment)}
              className="mr-1"
            >
              <MaterialCommunityIcons
                name="reply-outline"
                size={20}
                color={isDarkMode ? COLORS.lightGray : COLORS.authDark}
              />
            </TouchableOpacity>
          ) : null}

          {comment.authorId === user?.id ? (
            <TouchableOpacity
              onPress={() => initiateEditAction(comment)}
              className="mr-16"
            >
              <AntDesign
                name="edit"
                size={18}
                color={isDarkMode ? COLORS.lightGray : COLORS.authDark}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {showReplies && (
        <View className="ml-2">
          <FlatList
            keyExtractor={(replies) => replies.id}
            showsHorizontalScrollIndicator={false}
            data={replies}
            scrollEnabled={false}
            renderItem={({ item: reply }) => (
              <CommentLayout
                allComments={allComments}
                comment={reply}
                initiateEditAction={initiateEditAction}
                initiateReplyAction={initiateReplyAction}
                replies={getReplies(reply.id)}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}
