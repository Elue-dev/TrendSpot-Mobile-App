import { User } from "../auth";
import { News } from "../news";

export interface Bookmark {
  id: string;
  news: News;
  newsId: string;
  user: User;
  userId: string;
  createdAt: Date;
}
