import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

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
    const storage = new Storage(client);

 // Register User
export const createUser = async (email , password, username) => {
   
  try {
      // Check password length before proceeding
      if (password.length < 8 || password.length > 265) {
        throw new Error('Password must be between 8 and 265 characters long.');
      }

    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if (!newAccount) throw Error;

    // Check for an existing session
    const currentUser = await getCurrentUser();

     // If there's no active session, proceed to sign in
     if (!currentUser) {
        await signIn(email, password);
      } else {
        throw new Error('An active session already exists.');
      }
    
    // set Profile Picture 
    const avatarUrl = avatars.getInitials(username)

    // await signIn(email,password);

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


// Sign out 
export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
    
        return session;
    } catch (error) {
        throw new Error(error); 
    }
}

// Get File Preview 
export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(storageId, fileId)
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error;
        return fileUrl;

    } catch (error) {
        throw new Error(error); 
    }
}

// Upload file
export const uploadFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
     const uploadedFile = await storage.createFile(
        storageId,
        ID.unique(),
        asset
     );

     const fileUrl = await getFilePreview(uploadedFile.$id, type);
     return fileUrl;

    } catch (error) {
        throw new Error(error); 
    }
}

// Create Post 
export const createVideo = async (form) => {
    try {
    
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId, videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error); 
    }
}

