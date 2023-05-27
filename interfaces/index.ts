import { AuthSessionResult } from "expo-auth-session";
import { User } from "firebase/auth";
import { ReactNode } from "react";

export interface IUser extends User {
  saved: string[];
}

export interface Post {
  id: string;
  subreddit: string;
  author: string;
  authorName: string;
  title: string;
  name: string;
  ups: number;
  downs: number;
  thumbnail: string;
  over18: boolean;
  spoiler: boolean;
  ratio: number;
  commentsNum: number;
  flair: {
    text: string;
    textColor: string;
    bgColor: string;
  } | null;
  permalink: string;
  url: string;
  isVideo: boolean;
  isGallery?: boolean;
  gallery?: { y: number; x: number; u: string }[][];
  preview:
    | {
        url: string;
        width: number;
      }[]
    | null;
}

export interface SubReddit {
  id: string;
  title: string;
  primaryColor: string;
  bannerBackgroundColor: string;
  keyColor: string;
  displayName: string;
  icon: string;
  subscribers: string;
  name: string;
  subreddit: string;
  description: string;
  backgroundImage: string;
  mobileBannerImage: string;
  over18: boolean;
}

export interface AuthContextReturnType {
  user: IUser | null;
  logout: () => void;
  googleLogin: () => Promise<AuthSessionResult>;
}

export interface UserType {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface AuthProviderType {
  children: ReactNode;
}
