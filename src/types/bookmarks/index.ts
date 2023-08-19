import { User } from "../auth";
import { News } from "../news";
import { QueryClient, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { AlertArgs } from "../alert";

export interface Bookmark {
  id: string;
  news: News;
  newsId: string;
  user: User;
  userId: string;
  createdAt: Date;
}

export interface BookmarkArgs {
  newsId: string;
  setloading: Dispatch<SetStateAction<boolean>>;
  bookmarksMutation: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    string,
    unknown
  >;
  showAlertAndContent: ({ type, message }: AlertArgs) => void;
  setIsBookmarked: Dispatch<SetStateAction<boolean>>;
  queryClient: QueryClient;
}
