import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { images } from "@/constants";

const AuraResultModal = ({ isVisible, onClose, result }) => {
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openBottomModal = (category) => {
    setSelectedCategory(category);
    setBottomModalVisible(true);
  };

  const closeBottomModal = () => {
    setBottomModalVisible(false);
    setSelectedCategory(null);
  };

  const AuraBreakdownItem = ({ category, description, points, positive }) => (
    <TouchableOpacity
      onPress={() =>
        openBottomModal({ category, description, points, positive })
      }
    >
      <View className="bg-white rounded-lg p-4 shadow-md h-32">
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-2xl font-bold ${positive ? "text-green-600" : "text-red-600"}`}
          >
            {points >= 0 ? `+${points}` : points}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </View>
        <Text className="text-gray-800 mt-1 font-bold">{category}</Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-gray-600 mt-1"
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Safeguard: If result is null or undefined, show an error message
  if (!result) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
          <Text className="text-gray-800 text-xl mb-4">
            Oops! Something went wrong.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }

  const totalPoints = result.aura_categories.reduce(
    (sum, category) => sum + category.points,
    0
  );

  const BottomModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={bottomModalVisible}
      onRequestClose={closeBottomModal}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeBottomModal}
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="flex-1 justify-center">
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-3xl p-6 mx-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-gray-800">
                  {selectedCategory?.category}
                </Text>
                <TouchableOpacity onPress={closeBottomModal}>
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text
                className={`text-3xl font-bold mb-4 ${selectedCategory?.positive ? "text-green-600" : "text-red-600"}`}
              >
                {selectedCategory?.points >= 0
                  ? `+${selectedCategory?.points}`
                  : selectedCategory?.points}
              </Text>
              <Text className="text-gray-600 text-lg mb-4">
                {selectedCategory?.description}
              </Text>
              <TouchableOpacity>
                <LinearGradient
                  colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-full py-3 px-6 shadow-lg flex-row items-center justify-center"
                >
                  <Ionicons
                    name="bulb-outline"
                    size={20}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white text-center font-bold">
                    Improvement Tips
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      className="pb-12 mb-12"
    >
      <SafeAreaView
        className="flex-1 bg-gray-100"
        edges={["top", "left", "right"]}
      >
        <ScrollView className="flex-1 px-5 pt-12">
          <View className="flex-row justify-between items-center mb-5 sticky top-0 bg-gray-100 py-3 z-10">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="share-social-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-5">
            <Image
              source={images.auralogo}
              style={{ width: 80, height: 80 }}
              className="mb-4"
            />
            <Text className="text-gray-800 text-2xl font-bold text-center mb-2">
              {result.activity || "No Activity"}
            </Text>
            <Text className="text-gray-700 mb-5 text-center px-10">
              {result.comment || "No comment available."}
            </Text>
            <TouchableOpacity>
              <LinearGradient
                colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-full py-3 px-6 shadow-lg flex-row items-center justify-center"
              >
                <Text className="text-white font-bold mr-2">
                  Show me how to improve
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View className="rounded-lg p-4 mb-5 items-center space-y-3">
            <Text className="text-gray-800 text-xl">Overall aura points</Text>
            <Text
              className={`text-5xl font-bold ${totalPoints < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {totalPoints >= 0 ? `+${totalPoints}` : totalPoints}
            </Text>
          </View>

          <Text className="text-gray-800 font-medium text-lg mb-3">
            Aura Breakdown
          </Text>

          <View className="flex-row flex-wrap ">
            {(result.aura_categories || []).map((category, index) => (
              <View key={index} className="w-1/2 p-1">
                <View className="relative overflow-hidden">
                  <AuraBreakdownItem
                    category={category.category}
                    description={category.description}
                    points={category.points}
                    positive={category.positive}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="mb-24 mt-5 flex-1">
            <TouchableOpacity>
              <LinearGradient
                colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-full py-3 px-6 shadow-lg flex-row items-center justify-center"
              >
                <Text className="text-white font-bold mr-2">Record Score</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Safeguard: Show a message if aura_categories is empty */}
          {(!result.aura_categories || result.aura_categories.length === 0) && (
            <Text className="text-gray-700 text-center">
              No aura breakdown available.
            </Text>
          )}
        </ScrollView>
        <SafeAreaView edges={["bottom"]}>
          <BottomModal />
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};

export default AuraResultModal;
