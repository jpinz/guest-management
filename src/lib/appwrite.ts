import { Appwrite } from "appwrite";

// Init your Web SDK
export const appwrite = new Appwrite();

appwrite
  .setEndpoint("http://localhost/v1") // Your Appwrite Endpoint
  .setProject("623be1f03554c0454b90"); // Your project ID
