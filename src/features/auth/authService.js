import { signOut } from "firebase/auth";
import { auth } from "./firebase/config.js";

export { auth };

export async function logoutUser() {
  await signOut(auth);
}
