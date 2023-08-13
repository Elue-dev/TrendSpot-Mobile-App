import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Comment, CommentProps } from "../../../types/news";
import { formatDate } from "../../../helpers";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useSheet } from "../../../context/bottom_sheet/BottomSheetContext";
import { COLORS } from "../../../common/colors";
import { useAuth } from "../../../context/auth/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function Comments({
  comments,
  setComment,
  setHeightAdjust,
  inputRef,
  setCommentType,
  setCommentId,
}: CommentProps) {
  const { isDarkMode } = useSheet();
  const {
    state: { user },
  } = useAuth();

  function initiateEditAction(comment: Comment) {
    setComment(comment.comment);
    // setHeightAdjust(true);
    inputRef.current.focus();
    setCommentType("edit");
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
          <View className="mb-3 border-b border-b-lightText dark:border-b-lightBorder">
            <View className="flex-row justify-between mb-3">
              <View className="flex-row items-start gap-2">
                <Image
                  source={{ uri: comment.userAvatar }}
                  className="h-9 w-9 rounded-full bg-primaryColorLighter"
                />
                <View>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-darkNeutral dark:text-lightGray font-normal text-[15px]">
                      {comment.username}
                    </Text>
                    {comment?.userIsAdmin ? (
                      <MaterialIcons
                        name="verified"
                        size={14}
                        color={
                          isDarkMode
                            ? COLORS.primaryColorTheme
                            : COLORS.primaryColor
                        }
                      />
                    ) : null}
                  </View>
                  <Text className="text-gray-500 dark:text-authDark text-[13px] font-normal">
                    {formatDate(comment?.date)}{" "}
                    {comment.isEdited && <Text>. Edited</Text>}
                  </Text>
                  <Text className="text-darkNeutral dark:text-lightText text-base w-72">
                    {comment.comment}
                  </Text>
                </View>
              </View>

              {comment.userId === user?.id ? (
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
        )}
      />
    </View>
  );
}
