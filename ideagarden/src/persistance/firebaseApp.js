import { initializeApp } from "firebase/app";
import firebaseConfig from "@/persistance/firebaseConfig";

console.log("initializing Firebase ...");
const app = initializeApp(firebaseConfig);

export default app;
