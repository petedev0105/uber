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
    title:
      "What's the first word that comes to mind when you think about your day ahead?",
    options: ["Exciting", "Challenging", "Peaceful", "Productive", "Uncertain"],
  },
  {
    id: 2,
    title: "How do you typically recharge your energy?",
    options: [
      "Physical activity or exercise",
      "Quiet time alone",
      "Socializing with friends",
      "Creative pursuits",
      "Connecting with nature",
    ],
  },
  {
    id: 3,
    title: "In social situations, you tend to be:",
    options: [
      "The life of the party",
      "A calm and steady presence",
      "An empathetic listener",
      "A thoughtful observer",
      "An inspiring motivator",
    ],
  },
  {
    id: 4,
    title: "Which element do you feel most connected to?",
    options: [
      "Fire - passionate and energetic",
      "Water - emotional and intuitive",
      "Air - intellectual and communicative",
      "Earth - practical and grounded",
      "Spirit - mystical and insightful",
    ],
  },
  {
    id: 5,
    title: "How do you usually approach challenges?",
    options: [
      "Head-on with confidence",
      "Carefully with thorough planning",
      "Collaboratively with others",
      "Creatively with unique solutions",
      "Intuitively based on feelings",
    ],
  },
  {
    id: 6,
    title: "Which statement resonates with you most?",
    options: [
      "I'm always seeking new experiences",
      "I value harmony and balance in life",
      "I'm driven by helping others",
      "I'm constantly curious and learning",
      "I'm deeply connected to my inner wisdom",
    ],
  },
  {
    id: 7,
    title: "How do others often describe your presence?",
    options: [
      "Energizing and motivating",
      "Calming and soothing",
      "Warm and nurturing",
      "Inspiring and visionary",
      "Grounding and stabilizing",
    ],
  },
  {
    id: 8,
    title: "What's your primary goal for personal growth?",
    options: [
      "Boosting confidence and assertiveness",
      "Finding inner peace and balance",
      "Improving relationships and empathy",
      "Expanding knowledge and wisdom",
      "Deepening spiritual connection",
    ],
  },
  {
    id: 9,
    title: "In decision-making, you typically rely on:",
    options: [
      "Gut instincts and quick action",
      "Logical analysis and facts",
      "Considering others' feelings",
      "Creative problem-solving",
      "Intuition and inner guidance",
    ],
  },
  {
    id: 10,
    title: "Which area of personal development interests you most?",
    options: [
      "Physical vitality and strength",
      "Emotional intelligence and balance",
      "Social skills and charisma",
      "Mental acuity and knowledge",
      "Spiritual growth and awareness",
    ],
  },
  {
    id: 11,
    title: "Let's personalize your journey",
    inputs: [
      {
        label: "Full Name",
        placeholder: "Enter your name...",
        // icon: "person",
      },
      {
        label: "Gender (optional)",
        placeholder: "Enter your gender...",
        // icon: "transgender",
      },
    ],
  },
  // {
  //   id: 12,
  //   title: "Discovering Your Aura Type",
  //   loading: true,
  //   loadingMessage: "Analyzing your energy patterns...",
  // },
  {
    id: 13,
    title: "Your Aura Ratings",
    description: "We've identified your unique aura type.",
    finalScreen: true,
  },
  {
    id: 14,
    title: "Unlock Premium Aura Insights",
    description: "Get in-depth analysis and personalized growth strategies",
    options: [
      { title: "Monthly", price: "$9.99/month" },
      { title: "Annually", price: "$79.99/year", discount: "Save 33%" },
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

const CustomProgressBar = ({ progress, potentialProgress }) => (
  <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <View
      className="h-full bg-blue-500 rounded-full"
      style={{ width: `${progress}%` }}
    />
    {potentialProgress && (
      <View
        className="h-full bg-green-500 rounded-full absolute top-0 left-0 opacity-50"
        style={{ width: `${potentialProgress}%` }}
      />
    )}
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
  const [auraAnalysis, setAuraAnalysis] = useState(null);
  const [potentialScores, setPotentialScores] = useState(null);
  const [showPotential, setShowPotential] = useState(false);

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

      // Remove the backticks and "json" from the string
      const cleanedJsonString = result.analysis
        .replace(/```json|```/g, "")
        .trim();

      // Parse the cleaned JSON string
      const parsedAnalysis = JSON.parse(cleanedJsonString);
      console.log("Parsed analysis:", parsedAnalysis);

      setAuraAnalysis(parsedAnalysis.analysis);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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
        if (currentQuestion.id === 11) {
          // Assuming the personal info question is now 11
          // Run the analyze user data API for question 11
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

  const generatePotentialScores = () => {
    if (!auraAnalysis) return;

    const newPotentialScores = {};
    Object.entries(auraAnalysis.categories).forEach(([category, data]) => {
      const currentScore = data.rating;
      const maxIncrease = Math.min(98 - currentScore, 20); // Ensure the score doesn't exceed 98
      const increase = Math.min(
        Math.max(12, Math.floor(Math.random() * maxIncrease) + 1),
        98 - currentScore
      ); // Minimum increase of 12, maximum up to total score of 98
      newPotentialScores[category] = currentScore + increase;
    });
    setPotentialScores(newPotentialScores);
    setShowPotential(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isAnalyzing || (currentQuestion.loading && !isAnalyzing)) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="px-16 text-lg font-JakartaMedium mt-4 text-center ">
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

  if (currentQuestion.finalScreen && auraAnalysis) {
    if (showPotential) {
      return (
        <SafeAreaView className="flex-1 bg-white">
          <ScrollView className="flex-1 px-5 py-10">
            <Text className="text-2xl font-JakartaBold mb-4">
              Potential Growth After 1 Month
            </Text>
            <Text className="text-base font-JakartaRegular mb-6">
              Here's how your scores could improve with dedicated practice:
            </Text>

            <View className="flex-row flex-wrap">
              {Object.entries(auraAnalysis.categories).map(
                ([category, data], index) => {
                  let iconName;
                  switch (category) {
                    case "posture":
                      iconName = "body-outline";
                      break;
                    case "communication":
                      iconName = "chatbubbles-outline";
                      break;
                    case "style":
                      iconName = "shirt-outline";
                      break;
                    case "wellness":
                      iconName = "fitness-outline";
                      break;
                    case "creativity":
                      iconName = "color-palette-outline";
                      break;
                    default:
                      iconName = "star-outline";
                  }
                  return (
                    <View key={category} className="w-1/2 p-2">
                      <View
                        className="bg-white bg-opacity-50 rounded-lg p-5 shadow-sm"
                        style={{
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                        }}
                      >
                        <View className="flex-row space-x-3 items-center mb-2">
                          <Ionicons name={iconName} size={24} color="#000" />
                          <View className="flex-row items-baseline">
                            <Text className="text-3xl font-JakartaBold">
                              {potentialScores[category]}
                            </Text>
                            <Text className="text-lg font-JakartaMedium text-green-500 ml-2">
                              +{potentialScores[category] - data.rating}
                            </Text>
                          </View>
                        </View>
                        <Text className="font-JakartaMedium mb-2 capitalize">
                          {category}
                        </Text>
                        <CustomProgressBar
                          progress={data.rating}
                          potentialProgress={potentialScores[category]}
                        />
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* <Text className="text-lg font-JakartaMedium mt-6 mb-2">
              Unlock Your Full Potential
            </Text>
            <Text className="text-base font-JakartaRegular">
              With dedicated practice and our personalized guidance, you can
              reach these potential scores and beyond!
            </Text> */}
          </ScrollView>

          <View className="px-5 pb-5">
            <CustomButton
              title="Unlock my potential"
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="w-full mt-5"
            />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-white to-gray-100">
        <ScrollView className="flex-1 px-5 py-10">
          <Text className="text-2xl font-JakartaBold mb-4">
            {currentQuestion.title}
          </Text>

          <Text className="text-lg font-JakartaRegular text-black leading-relaxed pb-3">
            Based on your response, we've analyzed your aura ratings, which
            reflects your current lifestyle and habits.
          </Text>

          {/* <View className="bg-white rounded-3xl p-6 mb-8 ">
            <Text className="text-3xl font-JakartaBold mb-4 text-black">
              {auraAnalysis.auraType.type}
            </Text>
            <Text className="text-lg font-JakartaRegular text-black leading-relaxed">
              {auraAnalysis.auraType.explanation}
            </Text>
          </View> */}

          <View className="flex-row flex-wrap">
            {Object.entries(auraAnalysis.categories).map(
              ([category, data], index) => {
                let iconName;
                switch (category) {
                  case "posture":
                    iconName = "body-outline";
                    break;
                  case "communication":
                    iconName = "chatbubbles-outline";
                    break;
                  case "style":
                    iconName = "shirt-outline";
                    break;
                  case "wellness":
                    iconName = "fitness-outline";
                    break;
                  case "creativity":
                    iconName = "color-palette-outline";
                    break;
                  default:
                    iconName = "star-outline";
                }
                return (
                  <View key={category} className="w-1/2 p-2">
                    <View
                      className="bg-white bg-opacity-50 rounded-lg p-5 shadow-sm"
                      style={{
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }}
                    >
                      <View className="flex-row space-x-3 items-center mb-2">
                        <Ionicons name={iconName} size={24} color="#000" />
                        <Text className="text-3xl font-JakartaBold">
                          {data.rating}
                        </Text>
                      </View>
                      <Text className="font-JakartaMedium mb-2 capitalize">
                        {category}
                      </Text>
                      <CustomProgressBar progress={data.rating} />
                      <Text
                        className="text-sm font-JakartaRegular mt-2 h-20 overflow-hidden"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {data.explanation}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>

          {/* <Text className="text-lg font-JakartaMedium mt-6 mb-2">
            Overall Summary
          </Text>
          <Text className="text-base font-JakartaRegular">
            {auraAnalysis.overallSummary}
          </Text> */}
        </ScrollView>

        <View className="px-5 pb-5">
          <CustomButton
            title="View my potential"
            onPress={generatePotentialScores}
            className="w-full mt-5"
          />
        </View>
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
