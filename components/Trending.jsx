import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  
  Image,
  
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { icons } from "../constants";



const zoomIn ={
  0: {
    scale: 0.9
  },
  1: {
    scale: 1,
  },
}
const zoomOut ={
  0: {
    scale: 1
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
      <Text className="text-white">Playing</Text>


    ):(
      <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
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
 
  const [activeItem, setActiveItem] = useState(posts[0]);


  return (
    <FlatList
    data={posts}
    keyExtractor={(item) => item.$id}
    renderItem={({ item }) => (
       <TrandingItem
        activeItem= {activeItem} 
        item= {item}
       />

        )}
       horizontal
    />



  )
}

export default Trending