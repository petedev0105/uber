import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useLocalSearchParams } from "expo-router";

const Page = () => {
  const { isSignedIn } = useAuth();
  const { showOnboarding } = useLocalSearchParams();

  console.log("signed in state: ", isSignedIn);

  if (isSignedIn && !showOnboarding)
    return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
