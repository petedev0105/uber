import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons } from "@/constants";

const questions = [
  {
    id: 1,
    title: "Let's check your current vibe",
    description: "How would you rate your overall energy today?",
    options: [
      "Low key struggling",
      "Meh, could be better",
      "Pretty good",
      "Absolutely glowing",
    ],
  },
  {
    id: 2,
    title: "What's your main glow-up goal?",
    description: "Select up to 2",
    options: [
      "Boost my overall aura",
      "Level up my rizz game",
      "Enhance my appearance",
      "Increase my confidence",
    ],
    multiSelect: true,
    maxSelect: 2,
  },

  {
    id: 4,
    title: "What's your typical day like?",
    description: "Select all that apply",
    options: [
      "School/Work grind",
      "Hitting the gym",
      "Hanging with friends",
      "Creative pursuits",
      "Social media scrolling",
    ],
    multiSelect: true,
  },
  {
    id: 5,
    title: "How do you want to level up?",
    description: "Select up to 3",
    options: [
      "Quick daily tasks",
      "Social challenges",
      "Self-care routines",
      "Style and appearance tips",
      "Confidence boosters",
    ],
    multiSelect: true,
    maxSelect: 3,
  },
  {
    id: 6,
    title: "How much time can you dedicate to improving your aura daily?",
    options: [
      "5-10 minutes",
      "15-30 minutes",
      "30-60 minutes",
      "I'm all in, fam!",
    ],
  },
  {
    id: 3,
    title: "Let's personalize your journey",
    inputs: [
      {
        label: "Full Name",
        placeholder: "Enter your full name",
        icon: "person",
      },
      { label: "Date of Birth", placeholder: "MM/DD/YYYY", icon: "calendar" },
      {
        label: "Gender (optional)",
        placeholder: "Enter your gender",
        icon: "person",
      },
    ],
  },
];

const OnboardingQuestions = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});

  const handleOptionSelect = (questionId, option) => {
    const question = questions[currentQuestionIndex];
    if (question.multiSelect) {
      const currentSelections = userResponses[questionId] || [];
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];

      if (
        updatedSelections.length <=
        (question.maxSelect || updatedSelections.length)
      ) {
        setUserResponses({
          ...userResponses,
          [questionId]: updatedSelections,
        });
      }
    } else {
      setUserResponses({
        ...userResponses,
        [questionId]: [option],
      });
    }
  };

  const handleInputChange = (questionId, inputLabel, value) => {
    setUserResponses({
      ...userResponses,
      [questionId]: {
        ...(userResponses[questionId] || {}),
        [inputLabel]: value,
      },
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(userResponses);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 py-10"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text className="text-2xl font-JakartaBold mb-3">
          {currentQuestion.title}
        </Text>
        <Text className="text-md font-JakartaRegular mb-5">
          {currentQuestion.description}
        </Text>

        {currentQuestion.options && (
          <View>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleOptionSelect(currentQuestion.id, option)}
                className={`w-full bg-[#E2E8F0] rounded-full p-3 mb-3 ${
                  (userResponses[currentQuestion.id] || []).includes(option)
                    ? "bg-primary-500"
                    : ""
                }`}
              >
                <Text className="text-center font-JakartaMedium">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentQuestion.inputs && (
          <View>
            {currentQuestion.inputs.map((input) => (
              <InputField
                key={input.label}
                label={input.label}
                placeholder={input.placeholder}
                icon={icons[input.icon]}
                value={userResponses[currentQuestion.id]?.[input.label] || ""}
                onChangeText={(value) =>
                  handleInputChange(currentQuestion.id, input.label, value)
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-5">
        <CustomButton
          title={
            currentQuestionIndex === questions.length - 1
              ? "Get Started"
              : "Next"
          }
          onPress={handleNext}
          className="w-full mt-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingQuestions;
