import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

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
        {task.name}
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

const TaskModal = ({ task, visible, onClose, onMarkAsDone }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="bg-white p-6 rounded-t-3xl">
            <Text className="text-black text-2xl font-bold mb-2">
              {task.name}
            </Text>
            <Text className="text-blue-500 font-bold mb-4 text-lg">
              +{task.points} Aura Points
            </Text>
            <Text className="text-black text-lg mb-4">{task.description}</Text>
            <Text className="text-black text-xl font-bold mb-2">
              Tips & Tricks:
            </Text>
            <Text className="text-black text-base mb-6">{task.tips}</Text>
            <Text className="text-black text-lg font-bold mb-2">
              Difficulty:
            </Text>
            <Text className="text-black text-base mb-4">{task.difficulty}</Text>
            <Text className="text-black text-lg font-bold mb-2">Category:</Text>
            <Text className="text-black text-base mb-6">{task.category}</Text>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-black text-lg font-bold">
                Mark as done:
              </Text>
              {!showConfirm ? (
                <TouchableOpacity
                  onPress={() => setShowConfirm(true)}
                  className="w-6 h-6 border-2 border-blue-500 rounded-md flex items-center justify-center"
                >
                  {task.isDone && (
                    <Ionicons name="checkmark" size={18} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onMarkAsDone}
                  className="bg-blue-500 py-2 px-4 rounded-full"
                >
                  <Text className="text-white font-bold">Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              className="bg-blue-500 py-3 px-6 rounded-full"
              onPress={onClose}
            >
              <Text className="text-white text-center font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const AuraTasks = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const response = await fetchAPI(`/(api)/get-tasks/${user.id}`);
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleMarkAsDone = async (taskId) => {
    try {
      await fetchAPI(`/(api)/complete-task/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_completed: true }),
      });
      await fetchTasks(); // Refetch tasks to update the list
      setSelectedTask(null);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
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

  return (
    <View>
      <View className="mb-6">
        <Text className="text-xl font-bold mb-2">Your Progress</Text>
        <View className="bg-gray-200 h-4 rounded-full">
          <View
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${(tasks.length / allTasks.length) * 100}%` }}
          />
        </View>
        <Text className="text-sm text-gray-600 mt-2">
          {tasks.length} / {allTasks.length} tasks completed
        </Text>
      </View>
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
        {filteredTasks.map((item) => (
          <TaskCard
            key={item.id.toString()}
            task={{
              ...item,
              name:
                item.name.length > 30
                  ? item.name.substring(0, 30) + "..."
                  : item.name,
              description:
                item.description.length > 70
                  ? item.description.substring(0, 70) + "..."
                  : item.description,
            }}
            onPress={() => setSelectedTask(item)}
            className="mb-4 border border-gray-300"
          />
        ))}
      </ScrollView>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onMarkAsDone={() => handleMarkAsDone(selectedTask.id)}
        />
      )}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          ref={confettiRef}
        />
      )}
    </View>
  );
};

export default AuraTasks;
