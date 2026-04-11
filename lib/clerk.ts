type ClerkErrorShape = {
  errors?: Array<{
    longMessage?: string;
    message?: string;
  }>;
};

export function getClerkErrorMessage(error: unknown) {
  const clerkError = error as ClerkErrorShape;

  return (
    clerkError?.errors?.[0]?.longMessage ??
    clerkError?.errors?.[0]?.message ??
    "Something went wrong while talking to Clerk. Please try again."
  );
}
