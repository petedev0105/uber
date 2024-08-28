import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useRouter } from "expo-router";

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
      "Level up my communication",
      "Enhance my style",
      "Increase my mindfulness",
    ],
    multiSelect: true,
    maxSelect: 2,
  },
  {
    id: 3,
    title: "How confident do you feel about your posture in social situations?",
    options: [
      "Very confident, I stand tall",
      "Somewhat confident, but I could improve",
      "Not very confident, I slouch often",
      "I don't pay attention to my posture",
    ],
  },
  {
    id: 4,
    title: "How often do you practice mindfulness or meditation?",
    options: [
      "Daily, it's part of my routine",
      "A few times a week",
      "Occasionally, when I remember",
      "Rarely, I find it challenging",
    ],
  },
  {
    id: 5,
    title: "How would you rate your communication skills?",
    options: [
      "Excellent, I can engage anyone",
      "Good, but I have room for improvement",
      "Fair, I struggle sometimes",
      "Poor, I find it challenging",
    ],
  },
  {
    id: 6,
    title: "How important is personal style in expressing your aura?",
    options: [
      "Very important, it defines me",
      "Somewhat important, I care about it",
      "Not very important, I dress for comfort",
      "Not important at all, I don't think about it",
    ],
  },
  {
    id: 7,
    title: "How regularly do you engage in wellness activities?",
    options: [
      "Daily, it's a priority",
      "A few times a week",
      "Occasionally, when I remember",
      "Rarely, I often forget",
    ],
  },
  {
    id: 8,
    title: "How often do you express your creativity in your daily life?",
    options: [
      "Daily, it's essential for me",
      "A few times a week",
      "Occasionally, when I feel inspired",
      "Rarely, I don't prioritize it",
    ],
  },
  {
    id: 9,
    title: "What's your typical day like?",
    description: "Select all that apply",
    options: [
      "School/Work grind",
      "Hitting the gym",
      "Hanging with friends",
      "Creative pursuits",
      "Mindfulness practices",
    ],
    multiSelect: true,
  },
  {
    id: 10,
    title: "How much time can you dedicate to improving your aura daily?",
    options: [
      "5-10 minutes",
      "15-30 minutes",
      "30-60 minutes",
      "I'm all in, fam!",
    ],
  },
  {
    id: 11,
    title: "What motivates you to improve your aura?",
    options: [
      "Desire for personal growth",
      "Wanting to connect with others",
      "Seeking new opportunities",
      "Curiosity about self-improvement",
    ],
  },
  {
    id: 12,
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
  {
    id: 13,
    title: "Personalizing Your Experience",
    loading: true,
    duration: 3000,
    loadingMessage: "Please wait while we personalize the app for you...",
  },
  {
    id: 14,
    title: "Congratulations!",
    description: "Your app is ready.",
    finalScreen: true,
  },
  {
    id: 15,
    title: "Unlock Premium Features",
    description: "Get access to personalized aura insights and advanced tools",
    options: [
      { title: "Weekly", price: "$3.99/week" },
      { title: "Annually", price: "$39.99/yr", discount: "Save 50%" },
    ],
    paywall: true,
  },
];

const FeatureItem = ({ icon, text }) => (
  <View className="flex-row items-center mb-2">
    <Ionicons name={icon} size={24} style={{ marginRight: 8 }} />
    <Text className="text-base font-JakartaMedium">{text}</Text>
  </View>
);

const OnboardingQuestions = ({ onComplete }) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDiscountedPaywall, setShowDiscountedPaywall] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function analyzeUserData() {
    setIsAnalyzing(true);
    try {
      const payload = {
        userResponses: userResponses,
      };

      console.log("Analyzing user data...", payload);

      const response = await fetch("/(api)/(openai)/analyze-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze user data");
      }

      const result = await response.json();
      console.log("API response:", result);

      // You can store the analysis result in the state if needed
      // setAnalysisResult(result.analysis);

      // Move to the loading question (id 13)
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Simulate the loading duration
      await new Promise((resolve) =>
        setTimeout(resolve, questions[currentQuestionIndex + 1].duration)
      );

      // Move to the next question after the loading duration
      setCurrentQuestionIndex(currentQuestionIndex + 2);
    } catch (error) {
      console.error("Error analyzing user data:", error);
      setError("Failed to analyze user data. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleNext = async () => {
    console.log("Current question index:", currentQuestionIndex);
    console.log("Is answered:", isCurrentQuestionAnswered());
    console.log("Current user responses:", userResponses);

    if (isCurrentQuestionAnswered()) {
      setError("");
      if (currentQuestionIndex < questions.length - 1) {
        if (currentQuestion.id === 12) {
          // Run the analyze user data API for question 12
          await analyzeUserData();
        } else if (currentQuestion.paywall) {
          console.log("Selected plan:", userResponses[currentQuestion.title]);
          if (!showDiscountedPaywall) {
            setShowDiscountModal(true);
          } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        console.log("All questions answered. Final responses:", userResponses);
        onComplete(userResponses);
      }
    } else {
      setError("Please answer the question before proceeding.");
    }
  };

  const handleOptionSelect = (questionTitle, option) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserResponses((prevResponses) => {
      const currentSelections = prevResponses[questionTitle] || [];
      let updatedSelections;

      if (currentQuestion.multiSelect) {
        updatedSelections = currentSelections.includes(option)
          ? currentSelections.filter((item) => item !== option)
          : [...currentSelections, option];

        if (
          currentQuestion.maxSelect &&
          updatedSelections.length > currentQuestion.maxSelect
        ) {
          return prevResponses;
        }
      } else {
        updatedSelections = [option];
      }

      console.log(`Question "${questionTitle}" answered:`, updatedSelections);
      return {
        ...prevResponses,
        [questionTitle]: updatedSelections,
      };
    });
  };

  const handleInputChange = (questionTitle, inputLabel, value) => {
    setUserResponses((prevResponses) => {
      const updatedResponse = {
        ...prevResponses,
        [questionTitle]: {
          ...(prevResponses[questionTitle] || {}),
          [inputLabel]: value,
        },
      };
      console.log(
        `Question "${questionTitle}" input changed:`,
        updatedResponse[questionTitle]
      );
      return updatedResponse;
    });
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = userResponses[currentQuestion.title];

    if (currentQuestion.options) {
      return response && response.length > 0;
    } else if (currentQuestion.inputs) {
      return (
        response &&
        Object.keys(response).length === currentQuestion.inputs.length &&
        Object.values(response).every((value) => value.trim() !== "")
      );
    }
    return true; // For loading and final screens, consider them always answered
  };

  const handleClaimGift = () => {
    setShowDiscountModal(false);
    setShowDiscountedPaywall(true);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setUserResponses((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].title]: plan,
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isAnalyzing || (currentQuestion.loading && !isAnalyzing)) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg font-JakartaMedium mt-4 text-center px-5">
          {currentQuestion.loadingMessage ||
            "Please wait while we personalize the app for you..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (currentQuestion.paywall) {
    const discountedOptions = showDiscountedPaywall
      ? currentQuestion.options.map((option) => ({
          ...option,
          price: option.title === "Weekly" ? "$3.99/mo" : "$29.99/yr",
          discount: "Limited Time 50% OFF!",
        }))
      : currentQuestion.options;

    return (
      <SafeAreaView className="flex-1 bg-blue-50">
        <ScrollView className="flex-1 px-5 py-10">
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View className="w-full h-40 mb-6 bg-gray-200 flex items-center justify-center rounded-2xl">
              <Text className="text-gray-500 font-JakartaMedium ">
                Paywall Illustration Placeholder
              </Text>
            </View>

            <Text className="text-2xl font-JakartaBold mb-4">
              {currentQuestion.title}
            </Text>

            <View className="mb-6">
              <FeatureItem icon="leaf-outline" text="Guided Meditations" />
              <FeatureItem icon="moon-outline" text="Sleep Stories" />
              <FeatureItem icon="happy-outline" text="Mood Tracking" />
              <FeatureItem
                icon="people-outline"
                text="Access to Aura Community"
              />
            </View>

            <View className="flex-row justify-between mb-6">
              {discountedOptions.map((option) => (
                <TouchableOpacity
                  key={option.title}
                  onPress={() => handlePlanSelect(option)}
                  className={`w-[48%] p-4 rounded-lg ${
                    selectedPlan === option ? "bg-blue-500" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-center font-JakartaBold ${
                      selectedPlan === option ? "text-white" : "text-black"
                    }`}
                  >
                    {option.title}
                  </Text>
                  <Text
                    className={`text-center font-JakartaMedium ${
                      selectedPlan === option ? "text-white" : "text-black"
                    }`}
                  >
                    {option.price}
                  </Text>
                  {option.discount && (
                    <Text
                      className={`text-center font-JakartaMedium ${
                        selectedPlan === option ? "text-white" : "text-blue-500"
                      }`}
                    >
                      {option.discount}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <CustomButton
              title="Continue"
              onPress={() => router.replace("sign-in")}
              // onPress={() => handleFinish()}
              className="w-full mb-4"
              disabled={!selectedPlan}
            />

            <Text className="text-center text-gray-500 text-sm">
              3 days free then {selectedPlan?.price || ""} • Cancel anytime
            </Text>

            <Modal isVisible={showDiscountModal}>
              <View className="bg-white p-5 rounded-lg">
                <Text className="text-2xl font-JakartaBold mb-4">
                  Special Offer!
                </Text>
                <Text className="text-lg font-JakartaMedium mb-4">
                  Claim your 50% discount now!
                </Text>
                <CustomButton
                  title="Claim Gift"
                  onPress={handleClaimGift}
                  className="w-full mb-4"
                />
              </View>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
                onPress={() =>
                  handleOptionSelect(currentQuestion.title, option)
                }
                className={`w-full bg-[#E2E8F0] rounded-full p-3 mb-3 ${
                  (userResponses[currentQuestion.title] || []).includes(option)
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
                value={
                  userResponses[currentQuestion.title]?.[input.label] || ""
                }
                onChangeText={(value) =>
                  handleInputChange(currentQuestion.title, input.label, value)
                }
              />
            ))}
          </View>
        )}

        {error !== "" && (
          <Text className="text-red-500 mt-2 mb-2">{error}</Text>
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
