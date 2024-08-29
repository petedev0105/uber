import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

const CompletedTasksHistory = () => {
  const { user } = useUser();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!user) return;
      try {
        const response = await fetchAPI(
          `/(api)/get-completed-tasks/${user.id}`
        );
        setCompletedTasks(response.data);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Loading completed tasks...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-4">Completed Tasks History</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg shadow mb-2">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-600">{item.description}</Text>
            <Text className="text-gray-500">{item.completedAt}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CompletedTasksHistory;
