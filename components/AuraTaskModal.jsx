import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo"; // Import useUser
import { usePointsStore } from "@/store/pointsStore"; // Import the points store
import { useAuraTasksStore } from "@/store/auraTasksStore"; // Import the aura tasks store

const AuraTaskModal = ({ task, visible, onClose, onMarkAsDone }) => {
  const { user } = useUser(); // Get user object
  const userId = user?.id; // Extract userId from user object
  const [loading, setLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const { tasks, setTasks } = useAuraTasksStore();

  const handleConfirm = async () => {
    if (!userId) {
      console.error("User ID is required");
      return;
    }
    setLoading(true);
    try {
      // Update aura points
      await fetch(`/(api)/update-aura-points/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalPoints: task.points }), // Update points
      });

      // Update tasks
      const newTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, is_completed: true } : t
      );

      const updateTasks = await fetch(`/(api)/update-tasks/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: newTasks }), // Update the tasks array
      });

      if (updateTasks) {
        // Fetch updated tasks
        const response = await fetch(`/(api)/get-tasks/${userId}`);
        const data = await response.json();

        console.log("fetched tasks data: ", data.data);
        const updatedTasks = data.data;
        const completedTasks = updatedTasks.filter(
          (task) => !task.is_completed // Filter tasks where is_completed is false
        );
        setTasks(completedTasks);
      }

      setSuccessMessage("Task and points updated successfully!"); // Set success message
    } catch (error) {
      console.error("Error updating tasks or points:", error);
    } finally {
      setLoading(false);
      onClose(); // Close the modal after processing
    }
  };

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
              {task.title}
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
              <TouchableOpacity
                onPress={handleConfirm} // Call handleConfirm on press
                className={`bg-blue-500 py-2 px-4 rounded-full ${loading ? "opacity-50" : ""}`}
                disabled={loading} // Disable button while loading
              >
                {loading ? ( // Show loading indicator
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold">Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
            {successMessage && ( // Show success message
              <Text className="text-green-600 text-center mt-4">
                {successMessage}
              </Text>
            )}
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

export default AuraTaskModal;
