import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CircularProgress, Box } from "@mui/material";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
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
      router.push("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;