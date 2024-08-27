import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";

const mockDailyTasks = [
  {
    id: `1`,
    title: `Morning Meditation`,
    description: `Start your day with a 10-minute meditation session.`,
    points: 20,
    category: `Mindfulness`,
  },
  {
    id: `2`,
    title: `Gratitude Journaling`,
    description: `Write down three things you're grateful for today.`,
    points: 15,
    category: `Mental Health`,
  },
  {
    id: `3`,
    title: `Random Act of Kindness`,
    description: `Do something nice for someone without expecting anything in return.`,
    points: 25,
    category: `Social`,
  },
  {
    id: `4`,
    title: `Digital Detox Hour`,
    description: `Spend one hour completely free from screens and digital devices.`,
    points: 30,
    category: `Wellness`,
  },
  {
    id: `5`,
    title: `Learn Something New`,
    description: `Spend 15 minutes learning about a topic you're curious about.`,
    points: 20,
    category: `Personal Growth`,
  },
];

const TaskCard = ({ task, onPress }) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-5 mr-4 w-52 h-48"
    onPress={onPress}
  >
    <View className="mb-3">
      <View className="bg-blue-100 rounded-full px-3 py-1 self-start">
        <Text className="text-blue-600 font-semibold text-xs" numberOfLines={1}>
          {task.category}
        </Text>
      </View>
    </View>
    <Text className="text-gray-800 text-lg font-bold mb-2" numberOfLines={1}>
      {task.title}
    </Text>
    <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
      {task.description}
    </Text>
    <Text className="text-blue-600 font-bold text-lg">
      +{task.points} aura pts
    </Text>
  </TouchableOpacity>
);

const TaskDetailModal = ({ task, visible, onClose, onMarkAsDone }) => {
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
              {task.title}
            </Text>
            <Text className="text-blue-500 font-bold mb-4 text-lg">
              +{task.points} Aura Points
            </Text>
            <Text className="text-black text-lg mb-4">{task.description}</Text>
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

const DailyAuraTasks = () => {
  const [tasks, setTasks] = useState(mockDailyTasks);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // In a real app, you'd fetch the daily tasks here
    setTasks(mockDailyTasks);
  }, []);

  const handleCompleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && !completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      setTotalPoints(totalPoints + task.points);
    }
    setSelectedTask(null);
  };

  const progress = tasks.length > 0 ? completedTasks.length / tasks.length : 0;

  return (
    <View className="mt-5">
      <Text className="px-5 text-xl font-bold my-4">
        Daily Aura Tasks ({mockDailyTasks.length})
      </Text>

      {/* <View className="rounded-xl  mb-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="s font-semibold">Today's Progress</Text>
          <Text className="text-blue-500 font-bold">{totalPoints} pts</Text>
        </View>
        <Progress.Bar
          progress={progress}
          width={null}
          height={10}
          color="#3B82F6"
          unfilledColor="#E5E7EB"
          borderWidth={0}
        />
        <Text className="text-gray-600 mt-2">
          {completedTasks.length} of {tasks.length} tasks completed
        </Text>
      </View> */}
      <View style={{ position: "relative" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
          // contentContainerStyle={{ paddingRight: 20, paddingLeft: 20 }}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => setSelectedTask(task)}
            />
          ))}
        </ScrollView>
      </View>
      {/* </ScrollView> */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onMarkAsDone={() => handleCompleteTask(selectedTask.id)}
        />
      )}
    </View>
  );
};

export default DailyAuraTasks;
