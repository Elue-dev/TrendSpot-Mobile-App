import { User } from "../auth";
import { News } from "../news";

export interface Activity {
  id: string;
  description: string;
  category: string;
  action: string;
  activityDate: Date;
  user: User;
  userId: string;
  news?: News;
}

export interface Notifications {
  id: string;
  description: string;
  category: string;
  notificationDate: Date;
  user: User;
  userId: string;
  isRead: boolean;
  news?: News;
}
