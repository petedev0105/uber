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
  {
    id: 8,
    title: "Personalizing Your Experience",
    loading: true,
    duration: 3000,
    loadingMessage: "Please wait while we personalize the app for you...",
  },
  {
    id: 9,
    title: "Congratulations!",
    description: "Your app is ready.",
    finalScreen: true,
  },
  {
    id: 7,
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

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.loading) {
      const timer = setTimeout(() => {
        handleNext();
      }, currentQuestion.duration);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = (questionId, option) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserResponses((prevResponses) => {
      const currentSelections = prevResponses[questionId] || [];
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

      console.log(`Question ${questionId} answered:`, updatedSelections);
      return {
        ...prevResponses,
        [questionId]: updatedSelections,
      };
    });
  };

  const handleInputChange = (questionId, inputLabel, value) => {
    setUserResponses((prevResponses) => {
      const updatedResponse = {
        ...prevResponses,
        [questionId]: {
          ...(prevResponses[questionId] || {}),
          [inputLabel]: value,
        },
      };
      console.log(
        `Question ${questionId} input changed:`,
        updatedResponse[questionId]
      );
      return updatedResponse;
    });
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = userResponses[currentQuestion.id];

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

  const handleNext = () => {
    console.log("Current question index:", currentQuestionIndex);
    console.log("Is answered:", isCurrentQuestionAnswered());
    console.log("Current user responses:", userResponses);

    if (isCurrentQuestionAnswered()) {
      setError("");
      if (currentQuestionIndex < questions.length - 1) {
        if (currentQuestion.paywall) {
          console.log("Selected plan:", userResponses[currentQuestion.id]);
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

  const handleClaimGift = () => {
    setShowDiscountModal(false);
    setShowDiscountedPaywall(true);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setUserResponses((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: plan,
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg font-JakartaMedium mt-4 text-center px-5">
          {currentQuestion.loadingMessage}
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
