import { Dispatch, SetStateAction } from "react";
import { AlertArgs } from "../alert";

export interface News {
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
  setValues: Dispatch<SetStateAction<Values>>;
  verificationStatus: string;
  setVerificationStatus: Dispatch<SetStateAction<string>>;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
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
  date: Date;
  updatedAt: string;
  comment: string;
  newsId: string;
  username: string;
  userAvatar: string;
  userId: string;
  userIsAdmin: boolean;
  isEdited: boolean;
}

export interface CommentProps {
  comments: Comment[];
  setComment: Dispatch<SetStateAction<string>>;
  setHeightAdjust: Dispatch<SetStateAction<boolean>>;
  inputRef: any;
  setCommentType: Dispatch<SetStateAction<string>>;
  setCommentId: Dispatch<SetStateAction<string>>;
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
