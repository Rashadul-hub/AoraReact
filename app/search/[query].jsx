import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'  
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useState, useEffect } from 'react'
import useAppwrite from '../../lib/useAppwrite'
import { getAllPosts, getLatestPosts, searchPosts } from '../../lib/appwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'


const Search = () => {

  const {query} = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
 
  useEffect(() => {
    refetch()
  }, [query])
  

  console.log(query); // Code until here 
  
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
          <View className="my-6 px-4">
            
            <Text className="font-pmedium text-sm text-gray-100">
                Search Results
            </Text>
             <Text className="text-2xl font-psemibold text-white">
                {query}
             </Text>

             <View className="mt-6 mb-8">

              {/* Search Bar */}
             <SearchInput initialQuery={query}/>

             </View>
           
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

export default Search