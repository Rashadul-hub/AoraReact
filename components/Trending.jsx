import { useState } from "react";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";



const zoomIn ={
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1,
  },
}
const zoomOut ={
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9,
  },
}

const TrandingItem = ({ activeItem, item }) => {

  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
    {play ? (
      <Video
        source={{ uri: item.video}}
        className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        useNativeControls
        shouldPlay
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onError={(error) => console.error("Video error:", error)}  // Logs the error
        onPlaybackStatusUpdate={(status) => console.log("Playback Status:", status)}  // Track playback status
      />
    ) : (
      <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}>
        
          <ImageBackground
          source={{
            uri: item.thumbnail
          }}
          className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
          resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
    )}

    </Animatable.View>
  )
}

const Trending = ({posts}) => {
 
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanges =({ viewableItems }) =>{
    if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].key)
      
    }
  }
  return (
    <FlatList
    data={posts}
    keyExtractor={(item) => item.$id}
    renderItem={({ item }) => (
      <TrandingItem activeItem= {activeItem} 
        item= {item} />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{ x: 170}}
      horizontal
    />



  )
}

export default Trending