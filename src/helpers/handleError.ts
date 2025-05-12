import { FirebaseError } from "firebase/app";
import { getFriendlyErrorMessage } from "./parseFirebaseError";

export const handleError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      return {
        error: {
          code: error.code,
          message: getFriendlyErrorMessage(error.code),
        },
      };
    }
  
    if (error instanceof Error) {
      return {
        error: {
          message: error.message,
          code: (error as any).code || "unknown",
        },
      };
    }
  
    return { error: { message: "Unknown error occurred", code: "unknown" } };
  };
  