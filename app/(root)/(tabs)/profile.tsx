import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/InputField";

const Profile = () => {
  const { user } = useUser();
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);

  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOutPress = () => {
    setIsSignOutModalVisible(true);
  };

  const handleSignOutConfirm = async () => {
    try {
      await signOut();
      router.replace("/(auth)/welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSignOutModalVisible(false);
    }
  };

  const handleSignOutCancel = () => {
    setIsSignOutModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex flex-row justify-between items-center my-5">
          <Text className="text-2xl font-JakartaBold">My profile</Text>
          <TouchableOpacity
            onPress={handleSignOutPress}
            className="justify-center items-center w-10 h-10 rounded-full bg-white"
          >
            <Image source={icons.out} className="w-4 h-4" />
          </TouchableOpacity>
        </View>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              label="First name"
              placeholder={user?.firstName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
        <View className="mt-5 w-full">
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-full flex flex-row items-center justify-center"
            onPress={() => {
              // Implement share functionality here
              // For example, you could use the Share API from react-native
              // Share.share({
              //   message: 'Check out this awesome app!',
              //   title: 'Invite a friend'
              // });
            }}
          >
            <Text className="text-white font-JakartaBold mr-2">
              Share with a friend
            </Text>
            <Ionicons name="share-social" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSignOutModalVisible}
        onRequestClose={() => setIsSignOutModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View className="bg-white p-5 rounded-lg w-4/5">
            <Text className="text-lg font-JakartaBold mb-4">
              Confirm Sign Out
            </Text>
            <Text className="mb-4">Are you sure you want to sign out?</Text>
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setIsSignOutModalVisible(false)}
                className="mr-4"
              >
                <Text className="text-blue-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSignOutConfirm}>
                <Text className="text-red-500">Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
