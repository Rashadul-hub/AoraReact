import { View, Text ,ScrollView, Image, Alert} from 'react-native'
 import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setform] = useState({
    username:'',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () =>{
    if(form.username === "" || form.email === "" || form.password === ""){
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

     // Check password length before proceeding
     if (form.password.length < 8 || form.password.length > 265) {
      Alert.alert('Error', 'Password must be between 8 and 265 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/home')

    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false);
    }
 
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View 
        className='w-full justify-center min-h-[83vh] px-4 my-6' >
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]" />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold"> Sign Up to explore  </Text>

          <FormField
            title ="Username"
            value={form.username}
            handleChangeText={(e) => setform({...form, username: e})}
            otherStyles="mt-10"
            keyboardType="email-address"
          />
          <FormField
            title ="Email"
            value={form.email}
            handleChangeText={(e) => setform({...form, email: e})}
            otherStyles="mt-7"
           />
          <FormField
            title ="Password"
            value={form.password}
            handleChangeText={(e) => setform({...form, password: e})}
            otherStyles="mt-7"
           />

           <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
           />


           <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-ig text-gray-100 font-pregular">Already have an account? </Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary" >Sign In</Link>
           </View>

    


        </View>
      </ScrollView>
       
    </SafeAreaView>
  )
}

export default SignUp