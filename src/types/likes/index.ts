import { User } from "../auth";
import { News } from "../news";

export interface Likes {
  id: string;
  news: News;
  newsId: string;
  type: string;
  user: User;
  userId: string;
  createdAt: Date;
}
