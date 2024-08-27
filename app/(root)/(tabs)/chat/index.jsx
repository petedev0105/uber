import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { images } from "@/constants";

const Chat = () => {
  const router = useRouter();
  const chatbots = [
    {
      name: "StudyBuddy AI",
      icon: "school-outline",
      description: "Ace your exams with personalized study plans",
    },
    {
      name: "FitnessPal AI",
      icon: "fitness-outline",
      description: "Get custom workouts and nutrition advice",
    },
    {
      name: "MindfulMe AI",
      icon: "leaf-outline",
      description: "Manage stress with guided meditation and mindfulness",
    },
    {
      name: "CareerCoach AI",
      icon: "briefcase-outline",
      description: "Navigate your career path with expert guidance",
    },
    {
      name: "FinanceGuru AI",
      icon: "cash-outline",
      description: "Learn to budget and invest for your future",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-JakartaBold mb-5">
          Life Improvement AI
        </Text>

        <View className="mb-8">
          <Text className="text-xl font-JakartaBold mb-3">AI Assistants</Text>
          {chatbots.map((bot, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-3 border-b border-gray-200"
              onPress={() => router.push(`/(root)/(tabs)/chat/${bot.name}`)}
            >
              <Ionicons name={bot.icon} size={24} color="#4B5563" />
              <View className="ml-3">
                <Text className="text-base font-JakartaMedium">{bot.name}</Text>
                <Text className="text-sm text-gray-500">{bot.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
