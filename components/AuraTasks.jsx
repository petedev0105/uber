import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";

// Mock data for tasks (replace this with your actual data source)
const allTasks = [
  {
    id: 1,
    name: `Meditate for 10 minutes`,
    points: 50,
    description: `Take 10 minutes to clear your mind and focus on your breath.`,
    tips: `Find a quiet space, sit comfortably, and use a timer. Focus on your breath and let thoughts pass without judgment.`,
    category: "Mindfulness",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: `Compliment a stranger`,
    points: 30,
    description: `Boost someone's day with a genuine compliment.`,
    tips: `Be specific, sincere, and respectful. Focus on actions or choices rather than appearance.`,
    category: "Social",
    difficulty: "Medium",
  },
  {
    id: 3,
    name: `Read a chapter of a book`,
    points: 40,
    description: `Expand your knowledge and imagination by reading.`,
    tips: `Choose a book you're genuinely interested in. Set aside dedicated reading time without distractions.`,
    category: "Personal Growth",
    difficulty: "Easy",
  },
  {
    id: 4,
    name: `Practice gratitude`,
    points: 35,
    description: `Write down three things you're grateful for today.`,
    tips: `Be specific, reflect on why you're grateful, and try to find new things each day.`,
    category: "Mindfulness",
    difficulty: "Medium",
  },
  {
    id: 5,
    name: `Take a nature walk`,
    points: 45,
    description: `Spend 20 minutes walking in nature and observing your surroundings.`,
    tips: `Leave your phone behind or put it on silent. Pay attention to the sights, sounds, and smells around you.`,
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 6,
    name: `Perform a random act of kindness`,
    points: 50,
    description: `Do something nice for someone without expecting anything in return.`,
    tips: `It can be as simple as holding a door open or as involved as volunteering. The key is to do it selflessly.`,
    category: "Social",
    difficulty: "Hard",
  },
  {
    id: 7,
    name: `Practice deep breathing`,
    points: 25,
    description: `Take 5 minutes to practice deep, controlled breathing.`,
    tips: `Find a quiet place, sit comfortably, and focus on slow, deep breaths. Inhale for 4 counts, hold for 4, then exhale for 4.`,
    category: "Health",
    difficulty: "Easy",
  },
  {
    id: 8,
    name: "Learn a new word",
    points: 20,
    description:
      "Expand your vocabulary by learning and using a new word today.",
    tips: "Use a word-of-the-day app or website. Try to use the new word in conversation or writing.",
    category: "Personal Growth",
    difficulty: "Easy",
  },
  {
    id: 9,
    name: "Cook a healthy meal",
    points: 40,
    description:
      "Prepare a nutritious meal from scratch using whole ingredients.",
    tips: "Plan your meal, shop for fresh ingredients, and try a new healthy recipe.",
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 10,
    name: "Start a side project",
    points: 100,
    description: "Begin working on a personal project you've been putting off.",
    tips: "Choose something you're passionate about. Set small, achievable goals to get started.",
    category: "Personal Growth",
    difficulty: "Hard",
  },
  {
    id: 11,
    name: "Morning meditation",
    points: 30,
    description: "Start your day with a 10-minute meditation session.",
    category: "Mindfulness",
    difficulty: "Easy",
  },
  {
    id: 12,
    name: "No social media day",
    points: 50,
    description: "Avoid all social media platforms for the entire day.",
    category: "Digital Wellbeing",
    difficulty: "Medium",
  },
  {
    id: 13,
    name: "Learn a new recipe",
    points: 40,
    description: "Cook a dish you've never made before.",
    category: "Skill Building",
    difficulty: "Medium",
  },
  {
    id: 14,
    name: "Read a book",
    points: 100,
    description: "Finish reading a book this week.",
    category: "Personal Growth",
    difficulty: "Medium",
  },
  {
    id: 15,
    name: "Exercise 3 times",
    points: 80,
    description: "Complete three workout sessions this week.",
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 16,
    name: "Write a blog post",
    points: 120,
    description:
      "Write and publish a blog post on a topic you're passionate about.",
    category: "Creativity",
    difficulty: "Hard",
  },
];

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
  const [tasks, setTasks] = useState(allTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleMarkAsDone = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setSelectedTask(null);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
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
