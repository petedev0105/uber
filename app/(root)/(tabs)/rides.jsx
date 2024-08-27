import { useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuraTasks from "@/components/AuraTasks";

const AuraChallenges = () => {
  // const { user } = useUser();

  // console.log(user.id);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-5">
        <Text className="text-2xl font-JakartaBold my-5">Aura Challenges</Text>
        <AuraTasks />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuraChallenges;
