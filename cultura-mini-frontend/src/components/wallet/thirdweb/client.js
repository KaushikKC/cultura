// First, create your Thirdweb client (this should be in a separate client.ts file)
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID,
});
