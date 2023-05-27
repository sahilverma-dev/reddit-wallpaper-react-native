import { api } from ".";
import { SubReddit } from "../interfaces";
// import { redditImageURL } from "../util";

interface Type {
  (subreddit: string): Promise<SubReddit | null>;
}

export const getSubredditInfo: Type = async (subreddit) => {
  try {
    const {
      data: { data },
    } = await api({
      url: `r/${subreddit}/about.json`,
    });

    return {
      id: data?.id,
      title: data?.title,
      primaryColor: data?.primary_color,
      bannerBackgroundColor: data?.banner_background_image,
      keyColor: data?.key_color,
      displayName: data?.display_name,
      icon: data?.community_icon,
      subscribers: data?.subscribers,
      name: data?.name,
      subreddit,
      description: data?.description,
      backgroundImage: data?.background_image,
      mobileBannerImage: data?.mobile_banner_image,
      over18: data?.over18,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
