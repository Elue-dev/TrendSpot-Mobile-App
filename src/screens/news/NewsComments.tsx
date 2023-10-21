import {
  Text,
  ScrollView,
  Platform,
  View,
  Image,
  TextInput,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { useSheet } from "../../context/bottom_sheet/BottomSheetContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../common/colors";
import { styles } from "../home/styles";
import { useAuth } from "../../context/auth/AuthContext";
import { DEFAULT_AVATAR } from "../../utils";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../../components/loader";
import { AddComment, Comment, News, UpdateComment } from "../../types/news";
import { useAlert } from "../../context/alert/AlertContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "../../services";
import ServerError from "../../components/custom_news/server_error";
import { FlatList } from "react-native";
import CommentLayout from "../../components/news/comments/CommentLayout";

interface NewsParams {
  newsId: string;
  newsAuthorEmail: string;
  newsAuthorId: string;
}

export default function NewsComments() {
  const { newsId, newsAuthorEmail, newsAuthorId } = useRoute()
    .params as NewsParams;
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [heightAdjust, setHeightAdjust] = useState(false);
  const [commentType, setCommentType] = useState("new");
  const [commentId, setCommentId] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [commentIsAReply, setCommentIsAReply] = useState(false);
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const inputRef = useRef<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const {
    state: { user },
    setPreviousRoute,
  } = useAuth();
  const queryClient = useQueryClient();
  const authHeaders = {
    headers: { authorization: `Bearer ${user?.token}` },
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{ fontFamily: "rubikSB" }}
          className="font-semibold text-[18px] text-primaryColorSec dark:text-gray300"
        >
          Comments
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="closecircle" size={23} color={COLORS.gray200} />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  const queryFn = async (): Promise<Comment[]> => {
    return httpRequest.get(`/comments/${newsId}`).then((res) => {
      return res.data.comments;
    });
  };

  const {
    data: comments,
    isLoading,
    error,
    refetch,
  } = useQuery<Comment[]>([`comments-${newsId}`], queryFn, {
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  const editCommentMutation = useMutation(
    (updatedComment: UpdateComment) => {
      return httpRequest.patch(
        `/comments/${commentId}`,
        updatedComment,
        authHeaders
      );
    },
    {
      onSuccess: () => {
        setLoading(false);
        queryClient.invalidateQueries(["customNews"]);
        queryClient.invalidateQueries([`comments-${newsId}`]);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  const addCommentMutation = useMutation(
    (newComment: AddComment) => {
      return httpRequest.post(`/comments`, newComment, authHeaders);
    },
    {
      onSuccess: () => {
        setLoading(false);
        queryClient.invalidateQueries(["customNews"]);
        queryClient.invalidateQueries([`comments-${newsId}`]);
      },
      onError: () => {
        setLoading(false);
      },
    }
  );

  async function addCommentToNews() {
    setLoading(true);
    try {
      const response = await addCommentMutation.mutateAsync({
        message: isReplying
          ? `@${commentAuthor} ${comment.trim()}`
          : comment.trim(),
        newsId,
        authorEmail: isReplying ? commentAuthor : newsAuthorEmail,
        authorId: newsAuthorId,
        path: "path",
        parentId: isReplying ? commentId : null,
        replyerName: `${user?.firstName!} ${user?.lastName!}`,
      });
      if (response) {
        setComment("");
        setLoading(false);
        setCommentAuthor("");
        setIsReplying(false);
        inputRef.current.blur();
      }
    } catch (error: any) {
      console.log("ERROR FROM COMMENT", error.response.data.message);
      setLoading(false);
      if (error.response.data.message.includes("expired")) {
      } else {
        navigation.goBack();
        showAlertAndContent({
          type: "error",
          message:
            error.response.data.message ||
            "Something went wrong. Please try again later",
        });
      }
    }
  }

  async function editComment() {
    setLoading(true);
    const response = await editCommentMutation.mutateAsync({
      message: commentIsAReply
        ? `${replyAuthorName} ${comment.trim()}`
        : comment.trim(),
      isEdited: true,
      newsId,
    });
    if (response) {
      setComment("");
      setLoading(false);
      setCommentIsAReply(false);
      setReplyAuthorName("");
      inputRef.current.blur();
    }
    try {
      setLoading(false);
    } catch (error: any) {
      console.log(error.response.data.message);
      setLoading(false);
      navigation.goBack();
      showAlertAndContent({
        type: "error",
        message:
          error.response.data.message ||
          "Something went wrong. Please try again later",
      });
    }
  }

  if (isLoading)
    return (
      <View className="flex-1 bg-transparent dark:bg-darkNeutral">
        <View className="mt-24">
          <Loader />
        </View>
      </View>
    );

  if (error) return <ServerError refetch={refetch} />;

  const rootComments = comments?.filter(
    (comment: Comment) => comment.parentId === null
  );

  function getReplies(commentId: string) {
    return comments?.filter((comment) => comment.parentId === commentId);
  }

  function initiateEditAction(comment: Comment) {
    let authorNames;
    let messageText: string | undefined;
    const parts = comment.message.split(" ");
    if (parts.length > 2 && parts[0].startsWith("@")) {
      authorNames = parts.slice(0, 2).join(" ");
      messageText = parts.slice(2).join(" ");
      setCommentIsAReply(true);
      setReplyAuthorName(authorNames);
    } else messageText = comment.message;

    setComment(messageText);
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
    <View
      style={styles.container}
      className="bg-white dark:bg-darkNeutral flex-1"
    >
      <ScrollView
        style={[styles.scrollView]}
        showsVerticalScrollIndicator={false}
      >
        {rootComments?.length === 0 ? (
          <View className="flex-col justify-center items-center pt-56">
            <Text className="text-2xl font-bold text-darkNeutral dark:text-lightText">
              No comments yet
            </Text>
            <Text className="text-base text-center text-darkNeutral dark:text-lightText">
              Be the first to add a comment to this news
            </Text>
          </View>
        ) : (
          <View className="">
            <View className="mt-5 mx-2 ">
              <FlatList
                keyExtractor={(rootComments) => rootComments.id}
                showsHorizontalScrollIndicator={false}
                data={rootComments}
                scrollEnabled={false}
                renderItem={({ item: comment }) => (
                  <View className="border-b border-b-lightText dark:border-b-lightBorder">
                    <CommentLayout
                      allComments={comments}
                      comment={comment}
                      initiateEditAction={initiateEditAction}
                      initiateReplyAction={initiateReplyAction}
                      replies={getReplies(comment.id)}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {user ? (
        <View>
          {isReplying && (
            <Text className="text-center text-darkNeutral dark:text-authDark">
              Replying to {commentAuthor}
            </Text>
          )}
          <View
            style={[
              styles.addCommentwrap,
              heightAdjust && Platform.OS === "ios"
                ? styles.adjustedHeight
                : null,
            ]}
            className="border-t border-t-lightGray dark:border-t-lightBorder"
          >
            <Image
              source={{ uri: user?.avatar || DEFAULT_AVATAR }}
              style={styles.avatarStyle}
            />
            <TextInput
              ref={inputRef}
              style={styles.input}
              className="text-darkNeutral dark:text-lightText"
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={(newComment) => setComment(newComment)}
              onFocus={() => setHeightAdjust(true)}
              onBlur={() => {
                setHeightAdjust(false);
                setCommentAuthor("");
                setIsReplying(false);
              }}
            />

            {comment.length === 0 ? (
              <Text style={[styles.disabledtext, { fontFamily: "rubikREG" }]}>
                Send
              </Text>
            ) : loading ? (
              <Text style={[styles.disabledtext, { fontFamily: "rubikREG" }]}>
                Sending...
              </Text>
            ) : (
              <>
                {!loading && (
                  <TouchableOpacity
                    onPress={
                      commentType === "new" ? addCommentToNews : editComment
                    }
                  >
                    <Text
                      style={[styles.activeText, { fontFamily: "rubikSB" }]}
                      className="text-primaryColor dark:text-primaryColorTheme"
                    >
                      Send
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.noUserwrap,
            heightAdjust && Platform.OS === "ios"
              ? styles.adjustedHeight
              : null,
          ]}
          className="border-t border-t-lightGray dark:border-t-lightBorder"
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              setPreviousRoute("Comments");
              navigation.navigate("AuthSequence", { state: "Sign In" });
            }}
            className="flex-row justify-center items-center gap-2 pt-2"
          >
            <Text className="text-darkNeutral dark:text-lightText text-center text-base">
              Login to add a comment
            </Text>
            <AntDesign name="doubleright" size={17} color={COLORS.authDark} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
