import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
      // Show a loading spinner while the session is being validated
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (
      status === "unauthenticated" ||
      (allowedRoles.length > 0 && !allowedRoles.includes(session?.user?.role))
    ) {
      // Redirect to login if not authenticated or unauthorized
      if (typeof window !== "undefined") {
        router.push("/login");
      }
      return null; // Prevent rendering of unauthorized content
    }

    // Render the wrapped component if authenticated and authorized
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;