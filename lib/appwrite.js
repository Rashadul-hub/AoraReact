import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.himu.aora',
    projectId: '66eba9f7002c48c4d2ba',
    databaseId: '66ebad2c0010331d8315',
    userCollectionId: '66ebad610024871a5bf3',
    videoCollectionId: '66ebadb1002aa31a3813',
    storageId: '66ebafc300309e36b680'
};

const {
endpoint,
platform,
projectId,
databaseId,
userCollectionId,
videoCollectionId,
storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.

    
    
    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

 // Register User
export const createUser = async (email , password, username) => {
   
  try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if (!newAccount) throw Error;
    
    // set Profile Picture 
    const avatarUrl = avatars.getInitials(username)

    await signIn(email,password);

    // after sign in create the user into the Database 
    const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl,
        }
    );
    return newUser;

  } catch (error) {
    console.log(error);
    throw new Error("Registration Error: "+error);
    
  }
}

// Sign In 
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
       
        return session;
    } catch (error) {
        throw new Error(error); 
    }
}

// Get Current Sign In user 
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];


    } catch (error) {
        console.log(error);
    }
}

// Fetch All Posts From Database 
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// fetch the Tranding post
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            // userCollectionId
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// fetch the Search post
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            // userCollectionId
            [Query.search('title', query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// fetch the Current User's post
export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            // userCollectionId
            [Query.equal('creator', userId)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
