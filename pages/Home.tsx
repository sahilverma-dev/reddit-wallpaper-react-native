// react
import { useState } from "react";

// react native
import { View } from "react-native";

// api + react query
import { useInfiniteQuery } from "react-query";
import { getSubreddit } from "../axios/getSubredditPosts";
import { subReddits } from "../constants/subReddits";

// masonry
import MasonryList from "@react-native-seoul/masonry-list";

// component
import ImageCard from "../components/ImageCard";
import Loading from "../components/Loading";
import Header from "../components/Header";

const Home = () => {
  const [subReddit, setSubReddit] = useState(subReddits[0]);
  const fetchPosts = async ({ pageParam }: { pageParam?: string }) =>
    await getSubreddit({
      subreddit: subReddit,
      limit: 30,
      after: pageParam,
    });

  const images = useInfiniteQuery([subReddit, subReddit], fetchPosts, {
    getNextPageParam: (lastPage) => lastPage?.after,
  });

  return (
    <View className="flex-1">
      <Header
        showBottomBar={true}
        subReddit={subReddit}
        setSubReddit={setSubReddit}
      />
      {images.isLoading && <Loading />}
      {images.data && !images.isLoading && (
        <MasonryList
          containerStyle={{
            padding: 5,
          }}
          onRefresh={images.refetch}
          // @ts-ignore
          data={images.data.pages[0]?.images}
          keyExtractor={(item) => item.id}
          // @ts-ignore
          renderItem={({ item, i }) => <ImageCard image={item} index={i} />}
        />
      )}
    </View>
  );
};

export default Home;
