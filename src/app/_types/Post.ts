import { CoverImage } from "./CoverImage";

export type Post = {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  createdAt: string;
  updateAt: string;
  coverImage: CoverImage;
};
