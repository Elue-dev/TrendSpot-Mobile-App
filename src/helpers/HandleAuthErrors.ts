export function handleAuthErrors(error: string) {
  let errorMessage;

  switch (error) {
    case "Firebase: Error (auth/invalid-email).":
      errorMessage = "Invalid credentials provided";
      break;
    case "Firebase: Error (auth/user-not-found).":
      errorMessage = "Invalid credentials provided";
      break;
    case "Firebase: Error (auth/wrong-password).":
      errorMessage = "Invalid credentials provided";
      break;
    case "Firebase: Error (auth/missing-password).":
      errorMessage = "Invalid credentials provided";
      break;
    case "Firebase: Error (auth/email-already-in-use).":
      errorMessage = "Email already in use";
      break;
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      errorMessage = "Password should be at least 6 characters";
      break;
    case "Firebase: Error (auth/network-request-failed).":
      errorMessage =
        "Network failure. Please ensure you have a stable internet connection";
      break;
    case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).":
      errorMessage =
        "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later";
      break;
    default:
      errorMessage = "Something went wrong. Please try again";
  }

  return errorMessage;
}

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
