import { api } from ".";
import { Post } from "../interfaces";
import { redditImageURL } from "../utils";

interface Type {
  ({
    subreddit,
    before,
    limit,
    after,
  }: {
    subreddit: string;
    limit?: number;
    before?: string | undefined;
    after?: string | undefined;
  }): Promise<{
    images: Post[];
    before: string | null;
    after: string | null;
  } | null>;
}

export const getSubreddit: Type = async ({
  subreddit,
  before,
  after,
  limit = 6,
}) => {
  try {
    const {
      data: { data },
    } = await api({
      url: `r/${subreddit}/new.json`,
      params: {
        limit,
        before,
        after,
        over18: true,
      },
    });

    return {
      images: data?.children?.map(
        ({ data }: any): Post => ({
          id: data?.id,
          subreddit: data?.subreddit,
          author: data?.author,
          authorName: data?.author_fullname,
          title: data?.title,
          name: data?.name,
          ups: data?.ups,
          downs: data?.downs,
          thumbnail:
            data?.thumbnail === "nsfw"
              ? "https://st4.depositphotos.com/1008011/25419/i/450/depositphotos_254199394-stock-photo-contemporary-dance-performance-theme-blur.jpg"
              : data?.thumbnail === "self"
              ? "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
              : data?.thumbnail,
          ratio: data?.upvote_ratio * 100,
          flair: data?.link_flair_text
            ? {
                text: data?.link_flair_text,
                textColor: data?.link_flair_text_color,
                bgColor: data?.link_flair_background_color,
              }
            : null,
          over18: data?.over_18,
          spoiler: data?.spoiler,
          commentsNum: data?.num_comments,
          permalink: `https://www.reddit.com${data?.permalink}`,
          url: data?.url,
          isVideo: data?.is_video,
          preview: data?.preview
            ? data?.preview?.images?.[0]?.resolutions?.map((i: any) =>
                redditImageURL(i.url)
              )
            : null,
        })
      ),
      before: data?.before,
      after: data?.after,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
