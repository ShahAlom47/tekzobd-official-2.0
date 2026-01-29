import toast from "react-hot-toast";


export interface IApiError {
  success?: boolean;
  message?: string;
}

export interface IErrorHandlerOptions {
  // Optional: Context to specify where the error occurred
  context?: string;

  // Optional: Action that failed, e.g., "Registration"
  action?: string;

  // Optional: Flag to determine if the error is critical (e.g., show alert or not)
  isCriticalError?: boolean;
}

export const handleApiError = (error: unknown, options?: IErrorHandlerOptions) => {
  const apiError = error as IApiError;

  // If the error is from Axios or your API utility response
  const message =
    apiError?.message ||
    (error instanceof Error && error.message) ||
    "Something went wrong";

  // Default action message
  let finalMessage = message;

  // If you have context, modify the message accordingly
  if (options?.context) {
    finalMessage = `${options.context} - ${finalMessage}`;
  }

  // If an action is provided (e.g., "Registration failed"), prepend it
  if (options?.action) {
    finalMessage = `${options.action}: ${finalMessage}`;
  }

  // If the error is marked as critical, show an alert or take other actions
  if (options?.isCriticalError) {
    alert(finalMessage);  // You could replace this with custom actions like logging to an external service
  }

  toast.error(finalMessage);  // Show the error using toast
  console.error("API Error:", finalMessage);  // Optional: Log the error to the console for debugging
};
