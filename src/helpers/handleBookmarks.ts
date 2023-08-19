import { User } from "../types/auth";
import { Bookmark, BookmarkArgs } from "../types/bookmarks";

export async function addRemoveBookmark({
  newsId,
  bookmarksMutation,
  setIsBookmarked,
  setloading,
  showAlertAndContent,
  queryClient,
}: BookmarkArgs) {
  setloading(true);
  try {
    const response = await bookmarksMutation.mutateAsync(newsId);
    if (response && response.data.message === "News added to bookmarks") {
      setloading(false);
      showAlertAndContent({
        type: "success",
        message: "News added to bookmarks",
      });
      setIsBookmarked(true);
    } else {
      setloading(false);
      showAlertAndContent({
        type: "info",
        message: "News removed from bookmarks",
      });
      setIsBookmarked(false);
    }
    queryClient.invalidateQueries(["bookmarks"]);
  } catch (error: any) {
    setloading(false);
    showAlertAndContent({
      type: "error",
      message:
        error.response.data?.message ||
        "Something went wrong. Please try again later",
    });
  }
}

interface Args {
  bookmarks: Bookmark[];
  user: User | null;
}

export function userHasBookmarkedPost({ bookmarks, user }: Args): boolean {
  return bookmarks?.some((bookmark) => bookmark?.userId === user?.id);
}
