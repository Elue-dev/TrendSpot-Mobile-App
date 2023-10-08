import { Dispatch, SetStateAction } from "react";
import { AlertArgs } from "../alert";

export interface NewsI {
  id: string;
  title: string;
  image?: string;
  content: string;
  category: string;
  readTime: number;
  date: Date;
  isVerified: boolean;
  upvotes: string[];
  sources: string[];
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorVerified: boolean;
}
export interface SavedNews {
  id: string;
  title: string;
  image?: string;
  content: string;
  category: string;
  readTime: number;
  date: Date;
  isVerified: boolean;
  upvotes: number;
  sources: string[];
  userID: string;
}

export interface SearchNews {
  location?: string;
  newsFromComponent?: News[];
  setNewsData: Dispatch<SetStateAction<News[] | undefined>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchInitiated: boolean;
  setSearchIntiated: Dispatch<SetStateAction<boolean>>;
}

export interface NewsFilter {
  selectedOption: string;
  selectedInterest: string;
  dataToUse: News[];
  setDataToUse: Dispatch<SetStateAction<News[]>>;
  toggleBottomSheet: () => void;
  toggleOverlay: () => void;
}

export interface VerificationStartProps {
  newsData: News[];
  nextStep: () => void;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  setVerificationResults: Dispatch<SetStateAction<News[]>>;
}

export interface VerificationResultsProps {
  prevStep: () => void;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  verificationResults: News[];
  setVerificationResults: Dispatch<SetStateAction<News[]>>;
}

interface Values {
  title: string;
  readTime: string;
}

export interface StepOneProps {
  values: Values;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  handleTextChange: (name: string, text: string) => void;
  nextStep: () => void;
  resetFields: () => void;
}

export interface StepTwoProps {
  values: Values;
  image: string | null;
  category: string;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  richText: any;
  setCategory: Dispatch<SetStateAction<string>>;
  previousStep: () => void;
  resetFields: () => void;
}

export interface Comment {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  newsId: string;
  parentId: string | null;
  isEdited: boolean;
  author: {
    id: string;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
  };
}

export interface UpdateComment {
  message: string;
  isEdited: boolean;
  newsId: string;
}
export interface AddComment {
  message: string;
  newsId: string;
  path: string;
  authorEmail: string;
  authorId: string;
  replyerName: string;
  parentId: string | null;
}

export interface CommentProps {
  comments: Comment[];
  setComment: Dispatch<SetStateAction<string>>;
  setHeightAdjust: Dispatch<SetStateAction<boolean>>;
  inputRef: any;
  setCommentType: Dispatch<SetStateAction<string>>;
  setCommentId: Dispatch<SetStateAction<string>>;
  setIsReplying: Dispatch<SetStateAction<boolean>>;
  setCommentAuthor: Dispatch<SetStateAction<string>>;
}

export interface ExternalNewsI {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface Author {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  joinedAt: string;
  isAdmin: boolean;
}

export interface News {
  id: string;
  image: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  category: string;
  authorId: string;
  actionTaken?: boolean;
  isAccepted?: boolean;
  status?: string;
  author: Author;
  likes: any[];
  bookmarks: any[];
  comments: any[];
}

export interface AddNews {
  title: string;
  content: string;
  image: string | null;
  readTime: number;
  category: string;
}
