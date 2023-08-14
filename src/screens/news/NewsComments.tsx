import {
  Text,
  ScrollView,
  Platform,
  View,
  Image,
  TextInput,
  Keyboard,
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
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../home/styles";
import { useAuth } from "../../context/auth/AuthContext";
import { DEFAULT_AVATAR } from "../../utils";
import { AntDesign } from "@expo/vector-icons";
import Loader from "../../components/loader";
import Comments from "../../components/news/comments";
import { Comment } from "../../types/news";
import { useAlert } from "../../context/alert/AlertContext";

export default function NewsComments() {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [heightAdjust, setHeightAdjust] = useState(false);
  const [commentType, setCommentType] = useState("new");
  const [commentId, setCommentId] = useState("");
  const inputRef = useRef<any>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isDarkMode } = useSheet();
  const { showAlertAndContent } = useAlert();
  const {
    state: { user },
  } = useAuth();
  const { newsId } = useRoute().params as NewsParams;
  const [data, setData] = useState([]);

  interface NewsParams {
    newsId: string;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="font-semibold text-[18px] text-primaryColorSec dark:text-gray300">
          Comments
        </Text>
      ),

      headerLeft: () =>
        Platform.OS === "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-circle"
              size={29}
              color={COLORS.gray200}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [isDarkMode]);

  async function addCommentToNews() {}

  async function editComment() {}

  const comments = data.filter((comment: Comment) => comment.newsId === newsId);

  return (
    <View style={styles.container} className="bg-white dark:bg-darkNeutral">
      <ScrollView
        style={[styles.scrollView]}
        showsVerticalScrollIndicator={false}
      >
        {comments.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text className="text-2xl font-bold text-darkNeutral dark:text-lightText">
              No comments yet
            </Text>
            <Text className="text-base text-center text-darkNeutral dark:text-lightText">
              Be the first to add a comment to this news
            </Text>
          </View>
        ) : (
          <Comments
            comments={comments}
            setComment={setComment}
            setHeightAdjust={setHeightAdjust}
            inputRef={inputRef}
            setCommentType={setCommentType}
            setCommentId={setCommentId}
          />
        )}
      </ScrollView>

      {user ? (
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
            // onFocus={() => setHeightAdjust(true)}
            // onBlur={() => setHeightAdjust(false)}
          />

          {comment.length === 0 ? (
            <Text style={styles.disabledtext}>Send</Text>
          ) : loading ? (
            <Text style={styles.disabledtext}>Sending...</Text>
          ) : (
            <>
              {!loading && (
                <TouchableOpacity
                  onPress={
                    commentType === "new" ? addCommentToNews : editComment
                  }
                >
                  <Text
                    style={styles.activeText}
                    className="text-primaryColor dark:text-primaryColorTheme"
                  >
                    Send
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
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
