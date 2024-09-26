import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'  
import { icons, images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useState, useEffect } from 'react'
import useAppwrite from '../../lib/useAppwrite'
import { getAllPosts, getLatestPosts, getUserPosts, searchPosts } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { TouchableOpacity } from 'react-native'
import InfoBox from '../../components/InfoBox'


const Profile = () => {


  const {user, setUser, setIsLoggedIn} = useGlobalContext();

  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const logout = () => {

  }
 
  return (
    <SafeAreaView className="bg-primary border-2   h-full">

     {/* Normal Posts  */}
      <FlatList
        data={posts}
         keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (

          <VideoCard
            video={item}
          />

        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
              >
              <Image source={icons.logout} resizeMode='contain' className="w-6 h-6"/>
            </TouchableOpacity>

             <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatar}}
                  className="w-[90%] h-[90%] rounded-lg"
                  resizeMode='cover'
                />

             </View>


             <InfoBox
              
             />




          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title= "No Videos"
            subtitle= "No videos found in this keyword"
          />
        )}
      
      />

    </SafeAreaView>
       
  )
}

export default Profile