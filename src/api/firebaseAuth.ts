import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  phone?: string;
  doctorId?: string; // Link to doctor profile if role is 'doctor'
  createdAt?: any;
}

// ==================== AUTHENTICATION ====================

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'doctor' | 'patient' = 'patient',
  doctorId?: string
): Promise<UserData> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      role,
      doctorId,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw new Error(error.message || 'Failed to register user');
  }
};

/**
 * Sign in user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

/**
 * Sign out current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserData>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });

    // Update Firebase Auth profile if name is being updated
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (newEmail: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
    
    await updateEmail(auth.currentUser, newEmail);
    
    // Update email in Firestore
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { email: newEmail }, { merge: true });
  } catch (error: any) {
    console.error('Error updating email:', error);
    throw new Error(error.message || 'Failed to update email');
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
    
    await updatePassword(auth.currentUser, newPassword);
  } catch (error: any) {
    console.error('Error updating password:', error);
    throw new Error(error.message || 'Failed to update password');
  }
};

/**
 * Subscribe to authentication state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if user is admin
 */
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userData = await getCurrentUserData(uid);
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
