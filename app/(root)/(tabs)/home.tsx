import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchAPI } from "@/lib/fetch";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import CheckAura from "../../../components/CheckAura";
import AuraTasks from "../../../components/AuraTasks";
import AuraStats from "../../../components/AuraStats";
import DailyAuraTasks from "@/components/DailyAuraTasks";
import { useAuraTasksStore } from "@/store/auraTasksStore";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const { tasks, setTasks } = useAuraTasksStore();
  const [isLoading, setIsLoading] = useState(true);

  // const { setUserLocation, setDestinationLocation } = useLocationStore();

  const handleSignOutPress = () => {
    setIsSignOutModalVisible(true);
  };

  const handleSignOutConfirm = () => {
    signOut();
    router.replace("/(auth)/sign-in");
    setIsSignOutModalVisible(false);
  };

  const handleSignOutCancel = () => {
    setIsSignOutModalVisible(false);
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/(api)/get-tasks/${user.id}`);
        const data = await response.json();
        const incompleteTasks = data.data.filter(
          (task: { is_completed: boolean }) => !task.is_completed
        );
        setTasks(incompleteTasks); // Get only the first 5 incomplete tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  if (isLoading) {
    return <Text>Loading tasks...</Text>;
  }

  return (
    <SafeAreaView className="bg-general-500 h-full">
      <ScrollView className="">
        <View className="flex items-center justify-center">
          <Image
            source={images.auralogo}
            resizeMode="contain"
            style={{ width: 35, height: 35 }}
            className="my-5"
          />
        </View>
        <View className="flex flex-col items-center justify-center mb-5">
          <Text className="text-2xl text-center font-JakartaExtraBold">
            Welcome back, {user?.firstName?.split(" ")[0]}👋
          </Text>
        </View>

        <AuraStats />

        <CheckAura />

        <DailyAuraTasks />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
