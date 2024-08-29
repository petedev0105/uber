import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Modal } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { useAuraTasksStore } from "@/store/auraTasksStore"; // Import the aura tasks store
import AuraTaskModal from "./AuraTaskModal"; // Import AuraTaskModal

const TaskCard = ({ task, onPress }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "Mindfulness":
        return "bg-purple-100 text-purple-600";
      case "Social":
        return "bg-blue-100 text-blue-600";
      case "Personal Growth":
        return "bg-green-100 text-green-600";
      case "Health":
        return "bg-red-100 text-red-600";
      case "Digital Wellbeing":
        return "bg-yellow-100 text-yellow-600";
      case "Creativity":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 border border-stone-300 w-full mb-2"
      onPress={onPress}
    >
      <View className="mb-3">
        <View
          className={`rounded-full px-3 py-1 self-start ${getCategoryColor(task.category)}`}
        >
          <Text className="font-semibold text-xs" numberOfLines={1}>
            {task.category}
          </Text>
        </View>
      </View>
      <Text className="text-gray-800 text-lg font-bold mb-2" numberOfLines={1}>
        {task.title}
      </Text>
      <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
        {task.description || "No description available"}
      </Text>
      <Text className="text-blue-600 font-bold text-lg">
        +{task.points} aura pts
      </Text>
    </TouchableOpacity>
  );
};

const AuraTasks = () => {
  const { user } = useUser();
  const { tasks, setTasks } = useAuraTasksStore(); // Use the global state
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setIsLoading(true); // Set loading state to true
      try {
        const response = await fetchAPI(`/(api)/get-tasks/${user.id}`);
        const completedTasks = response.data.filter(
          (task) => !task.is_completed // Filter tasks where is_completed is false
        );
        setTasks(completedTasks); // Update global state with fetched completed tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchTasks();
  }, [user]);

  const handleMarkAsDone = async (taskId) => {
    try {
      console.log("calling update task api...");
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, is_completed: true } : task
      );
      setTasks(updatedTasks);

      await fetchAPI(`/(api)/update-tasks/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      setSelectedTask(null);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      console.log("update task api called successful!");
    } catch (error) {
      console.error("Error marking task as done:", error);
    }
  };

  const filterTasks = (category) => {
    setActiveFilter(category);
  };

  const filteredTasks =
    activeFilter === "All"
      ? tasks
      : tasks.filter((task) => task.category === activeFilter);

  // Get unique categories from all tasks
  const categories = ["All", ...new Set(tasks.map((task) => task.category))];

  if (isLoading) {
    return (
      <View className="flex-1 ">
        <SkeletonLoader />
        <View className="flex-row justify-center items-center mt-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="ml-2 text-gray-600">Loading tasks...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-24">
      <ScrollView className="flex-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => filterTasks(category)}
              className={`mr-2 px-4 py-2 rounded-full ${
                activeFilter === category ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <Text
                className={
                  activeFilter === category ? "text-white" : "text-black"
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-xl font-bold mb-4 mt-5">Tasks</Text>
        {Array.isArray(filteredTasks) && // Use filteredTasks instead of tasks
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => setSelectedTask(task)}
            />
          ))}
      </ScrollView>
      {selectedTask && (
        <AuraTaskModal
          task={selectedTask}
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onMarkAsDone={() => handleMarkAsDone(selectedTask.id)} // Implement this function as needed
        />
      )}
      {/* {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          ref={confettiRef}
        />
      )} */}
    </View>
  );
};

const SkeletonLoader = () => (
  <View className="mb-4">
    <View className="bg-gray-200 h-6 w-3/4 rounded-full mb-2" />
    <View className="bg-gray-200 h-24 w-full rounded-2xl mb-2" />
    <View className="bg-gray-200 h-24 w-full rounded-2xl mb-2" />
    <View className="bg-gray-200 h-24 w-full rounded-2xl" />
  </View>
);

export default AuraTasks;
