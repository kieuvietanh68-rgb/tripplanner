import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./config";
import { signOut } from "firebase/auth";

// ✅ khởi tạo auth
const auth = getAuth(app);

// ✅ provider Google
const provider = new GoogleAuthProvider();

// ✅ hàm login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
  }
};

// ✅ export auth
export { auth };
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};