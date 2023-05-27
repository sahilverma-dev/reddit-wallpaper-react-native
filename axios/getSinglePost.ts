import { api } from ".";
import { Post } from "../interfaces";
import { redditImageURL } from "../utils";

interface Type {
  ({ id }: { id: string }): Promise<Post | null>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getSinglePost: Type = async ({ id }) => {
  try {
    const { data } = await api({
      url: `/comments/${id}.json`,
    });
    if (data[0]?.data?.children[0]?.data?.thumbnail === "self") return null;
    return {
      id: data[0]?.data?.children[0]?.data?.id,
      subreddit: data[0]?.data?.children[0]?.data?.subreddit,
      author: data[0]?.data?.children[0]?.data?.author,
      authorName: data[0]?.data?.children[0]?.data?.author_fullname,
      title: data[0]?.data?.children[0]?.data?.title,
      name: data[0]?.data?.children[0]?.data?.name,
      ups: data[0]?.data?.children[0]?.data?.ups,
      downs: data[0]?.data?.children[0]?.data?.downs,
      thumbnail:
        data[0]?.data?.children[0]?.data?.thumbnail === "nsfw"
          ? data[0]?.data?.children[0]?.data?.media_metadata
            ? redditImageURL(
                Object.values(
                  data[0]?.data?.children[0]?.data?.media_metadata
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                )[0]?.s?.u
              )
            : "https://st4.depositphotos.com/1008011/25419/i/450/depositphotos_254199394-stock-photo-contemporary-dance-performance-theme-blur.jpg"
          : data[0]?.data?.children[0]?.data?.thumbnail,
      ratio: data[0]?.data?.children[0]?.data?.upvote_ratio * 100,
      flair: data[0]?.data?.children[0]?.data?.link_flair_text
        ? {
            text: data[0]?.data?.children[0]?.data?.link_flair_text,
            textColor: data[0]?.data?.children[0]?.data?.link_flair_text_color,
            bgColor:
              data[0]?.data?.children[0]?.data?.link_flair_background_color,
          }
        : null,
      over18: data[0]?.data?.children[0]?.data?.over_18,
      spoiler: data[0]?.data?.children[0]?.data?.spoiler,
      commentsNum: data[0]?.data?.children[0]?.data?.num_comments,
      permalink: data[0]?.data?.children[0]?.data?.permalink,
      url: data[0]?.data?.children[0]?.data?.url,
      isVideo: data[0]?.data?.children[0]?.data?.is_video,
      isGallery: data[0]?.data?.children[0]?.data?.is_gallery,
      gallery: data[0]?.data?.children[0]?.data?.media_metadata
        ? Object.values(data[0]?.data?.children[0]?.data?.media_metadata).map(
            (i: any) =>
              i.p?.map((p: any) => ({
                y: p.y,
                x: p.x,
                u: redditImageURL(p.u),
              }))
          )
        : null,
      preview: data[0]?.data?.children[0]?.data?.preview
        ? data[0]?.data?.children[0]?.data?.preview?.images?.[0]?.resolutions?.map(
            (i: any) => ({ url: redditImageURL(i.url), width: i?.width })
          )
        : null,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
