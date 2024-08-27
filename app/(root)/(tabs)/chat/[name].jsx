import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ChatbotConversation = () => {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, user: true }]);
      setInputText("");
      // Here you would typically call an API to get the chatbot's response
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `Response from ${name}`, user: false },
        ]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-JakartaBold">{name}</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              className={`p-2 m-2 rounded-lg ${item.user ? "bg-blue-500 self-end" : "bg-gray-200 self-start"}`}
            >
              <Text className={item.user ? "text-white" : "text-black"}>
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          inverted
        />
        <View className="flex-row items-center p-4 border-t border-gray-200 mb-[60px]">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={handleSend}
            className="bg-blue-500 rounded-full p-2"
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotConversation;
