import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AuraStats = ({ totalPoints, streak }) => {
  return (
    <View className="flex-row bg-white rounded-xl overflow-hidden border border-gray-200 mb-5 mx-5">
      <View className="flex-1 p-4 border-r border-gray-200">
        <View className="flex-row items-center mb-1">
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text className="text-black text-2xl font-bold ml-2">
            {totalPoints}
          </Text>
        </View>
        <Text className="text-gray-600 text-sm">Total Aura Points</Text>
      </View>
      <View className="flex-1 p-4">
        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar" size={24} color="#4ECDC4" />
          <Text className="text-black text-2xl font-bold ml-2">
            {streak} days
          </Text>
        </View>
        <Text className="text-gray-600 text-sm">Streak</Text>
      </View>
    </View>
  );
};

export default AuraStats;
