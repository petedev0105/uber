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
    name: "Share a funny meme or joke",
    points: 30,
    description: "Make your friends laugh by sharing humor in group chats.",
    tips: "Choose content that's appropriate and relatable to your audience. Timing is key!",
    category: "Social",
    difficulty: "Easy",
  },
  {
    id: 2,
    name: "Perform a random act of kindness",
    points: 50,
    description:
      "Do something nice for someone without expecting anything in return.",
    tips: "It can be as simple as holding a door open or as involved as helping a stranger in need.",
    category: "Social",
    difficulty: "Medium",
  },
  {
    id: 3,
    name: "Participate in a trendy challenge",
    points: 40,
    description:
      "Join a popular social media challenge or create your own unique one.",
    tips: "Research current trends, but don't be afraid to put your own spin on it!",
    category: "Creativity",
    difficulty: "Medium",
  },
  {
    id: 4,
    name: "Host a casual get-together",
    points: 60,
    description: "Organize a game night or small gathering with friends.",
    tips: "Keep it simple - focus on creating a welcoming atmosphere and fun activities.",
    category: "Social",
    difficulty: "Hard",
  },
  {
    id: 5,
    name: "Share a personal story",
    points: 45,
    description:
      "Post about a personal experience that others might relate to.",
    tips: "Be authentic and choose stories that could inspire or resonate with others.",
    category: "Personal Growth",
    difficulty: "Medium",
  },
  {
    id: 6,
    name: "Create and share artwork",
    points: 50,
    description: "Engage in an artistic activity and share your work online.",
    tips: "Don't worry about perfection - the act of creating and sharing is what matters!",
    category: "Creativity",
    difficulty: "Medium",
  },
  {
    id: 7,
    name: "Practice self-care",
    points: 35,
    description: "Take time for a self-care activity like yoga or meditation.",
    tips: "Even 10-15 minutes can make a difference. Find what works best for you.",
    category: "Health",
    difficulty: "Easy",
  },
  {
    id: 8,
    name: "Discuss a current event",
    points: 40,
    description: "Engage in a thoughtful discussion about a trending topic.",
    tips: "Stay informed, be respectful of different opinions, and focus on constructive dialogue.",
    category: "Personal Growth",
    difficulty: "Medium",
  },
  {
    id: 9,
    name: "Volunteer for a local cause",
    points: 70,
    description: "Participate in a community service event or charity.",
    tips: "Research local opportunities that align with your interests and values.",
    category: "Social",
    difficulty: "Hard",
  },
  {
    id: 10,
    name: "Join a group fitness class",
    points: 45,
    description: "Participate in a sports team or group exercise session.",
    tips: "Choose an activity you enjoy - the social aspect is just as important as the exercise!",
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 11,
    name: "Learn a new language",
    points: 60,
    description: "Start learning a new language or practice an existing one.",
    tips: "Use language learning apps or find a language exchange partner.",
    category: "Personal Growth",
    difficulty: "Hard",
  },
  {
    id: 12,
    name: "Digital detox day",
    points: 55,
    description:
      "Spend a day without using social media or unnecessary screen time.",
    tips: "Plan offline activities to keep yourself engaged throughout the day.",
    category: "Digital Wellbeing",
    difficulty: "Medium",
  },
  {
    id: 13,
    name: "Cook a healthy meal",
    points: 40,
    description: "Prepare and enjoy a nutritious meal from scratch.",
    tips: "Try a new recipe or experiment with healthy ingredients you haven't used before.",
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 14,
    name: "Start a gratitude journal",
    points: 30,
    description:
      "Write down three things you're grateful for each day for a week.",
    tips: "Reflect on both big and small things in your life that bring you joy.",
    category: "Mindfulness",
    difficulty: "Easy",
  },
  {
    id: 15,
    name: "Organize a community cleanup",
    points: 75,
    description: "Gather a group to clean up a local park or beach.",
    tips: "Coordinate with local authorities and provide necessary cleaning supplies.",
    category: "Social",
    difficulty: "Hard",
  },
  {
    id: 16,
    name: "Learn a new skill",
    points: 50,
    description: "Dedicate time to learning a new skill or hobby.",
    tips: "Choose something you've always wanted to try, like photography or coding.",
    category: "Personal Growth",
    difficulty: "Medium",
  },
  {
    id: 17,
    name: "Practice active listening",
    points: 35,
    description:
      "Engage in a conversation where you focus solely on listening and understanding.",
    tips: "Avoid interrupting and ask thoughtful follow-up questions.",
    category: "Social",
    difficulty: "Easy",
  },
  {
    id: 18,
    name: "Create a vision board",
    points: 45,
    description:
      "Design a visual representation of your goals and aspirations.",
    tips: "Use a mix of images, quotes, and personal touches to make it inspiring.",
    category: "Creativity",
    difficulty: "Medium",
  },
  {
    id: 19,
    name: "Try a new workout routine",
    points: 40,
    description:
      "Explore a different form of exercise you haven't tried before.",
    tips: "Look for free trial classes or online tutorials to get started.",
    category: "Health",
    difficulty: "Medium",
  },
  {
    id: 20,
    name: "Mindful technology use",
    points: 30,
    description:
      "Set and stick to specific times for checking emails and social media.",
    tips: "Use app blockers or screen time settings to help manage your usage.",
    category: "Digital Wellbeing",
    difficulty: "Easy",
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
