// import React, { useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Modal,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import tw from "twrnc";
// import auraLogoGreen from "../assets/images/logo-green.png";
// import auraLogoRed from "../assets/images/logo-red.png";
// import { Image } from "react-native";
// import { getImprovementTips } from "../functions/openai";
// import Markdown from "react-native-markdown-display";

// const AuraResult = ({ auraResult, resetCheck, imageUrl }) => {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showImprovementModal, setShowImprovementModal] = useState(false);
//   const [improvementTips, setImprovementTips] = useState("");
//   const [loading, setLoading] = useState(false);

//   // console.log(imageUrl);

//   const overallPoints = useMemo(() => {
//     return auraResult.aura_categories.reduce(
//       (sum, category) => sum + category.points,
//       0
//     );
//   }, [auraResult.aura_categories]);

//   const auraColor = auraResult.positive ? "#4CAF50" : "#FF5252";

//   const renderCategoryItem = (category) => (
//     <TouchableOpacity
//       style={tw`aspect-square bg-[#252525] rounded-lg p-4 justify-between border border-stone-600`}
//       onPress={() => setSelectedCategory(category)}
//     >
//       <View style={tw`flex-row justify-between items-center`}>
//         <Text
//           style={tw`text-3xl font-bold ${
//             category.positive ? "text-green-500" : "text-red-500"
//           }`}
//         >
//           {category.points}
//         </Text>
//         <Ionicons name="expand" size={20} color="white" />
//       </View>
//       <Text style={tw`text-white text-xl font-medium mt-1`}>
//         {category.category}
//       </Text>
//     </TouchableOpacity>
//   );

//   const handleGetImprovementTips = async () => {
//     setLoading(true);
//     try {
//       const tips = await getImprovementTips(auraResult);
//       setImprovementTips(tips);
//       setShowImprovementModal(true);
//     } catch (error) {
//       console.error("Error getting improvement tips:", error);
//       // You might want to show an error message to the user here
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markdownStyles = {
//     body: {
//       color: "white",
//     },
//     heading1: {
//       color: "white",
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 10,
//     },
//     heading2: {
//       color: "white",
//       fontSize: 20,
//       fontWeight: "bold",
//       marginBottom: 8,
//     },
//     paragraph: {
//       color: "white",
//       fontSize: 16,
//       marginBottom: 10,
//     },
//     listItem: {
//       color: "white",
//       fontSize: 16,
//       marginBottom: 5,
//     },
//     // Add more styles as needed
//   };

//   return (
//     <SafeAreaView style={tw`flex-1 bg-black`}>
//       <View
//         style={tw`flex flex-row justify-between items-center w-full px-4 mt-5`}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             resetCheck();
//           }}
//         >
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>

//         <Image
//           source={
//             overallPoints && Math.sign(overallPoints) === 1
//               ? auraLogoGreen
//               : auraLogoRed
//           }
//           style={tw`mx-auto`}
//         />
//         <Ionicons name="share-social" size={24} color="white" />
//       </View>

//       <ScrollView contentContainerStyle={tw`grow p-5`}>
//         <Text style={tw`text-white text-center text-4xl font-bold mb-5 mx-10`}>
//           {auraResult.activity}
//         </Text>
//         <Text style={tw`text-white text-lg text-center mx-10`}>
//           {auraResult.comment}
//         </Text>
//         {imageUrl && (
//           <Image
//             resizeMode="cover"
//             source={{ uri: imageUrl }}
//             className="my-5 w-full h-[250px] rounded-3xl"
//           />
//         )}
//         <View>
//           <Text
//             style={tw`mt-10 text-center text-5xl font-bold text-[${auraResult.positive ? "#4CAF50" : "#FF5252"}]`}
//           >
//             <Text>{overallPoints} </Text>
//             <Text
//               style={tw`pl-3 text-white text-center mb-5 text-xl font-semibold`}
//             >
//               Aura Points
//             </Text>
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={tw`py-3 px-6 rounded-full mt-10 mb-5`}
//           onPress={handleGetImprovementTips}
//         >
//           <Text style={tw`text-white underline text-center font-bold text-lg`}>
//             Show me how to improve
//           </Text>
//         </TouchableOpacity>

//         <Text style={tw`text-white text-2xl font-bold mt-5 mb-3`}>
//           Aura score breakdown
//         </Text>
//         <View style={tw`flex-row flex-wrap justify-between`}>
//           {auraResult.aura_categories.map((category, index) => (
//             <View key={index} style={tw`w-[48%] mb-4 `}>
//               {renderCategoryItem(category)}
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={selectedCategory !== null}
//         onRequestClose={() => setSelectedCategory(null)}
//       >
//         <View style={tw`flex-1 justify-center bg-black bg-opacity-80`}>
//           <View style={tw` bg-[#252525] p-10 rounded-2xl `}>
//             <Text style={tw`text-white text-4xl font-bold mb-2`}>
//               {selectedCategory?.category}
//             </Text>
//             <Text
//               style={tw`text-lg mb-5 ${
//                 selectedCategory?.positive ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               Points: {selectedCategory?.points}
//             </Text>
//             <Text style={tw`text-white text-lg mb-5`}>
//               {selectedCategory?.description}
//             </Text>
//             <TouchableOpacity
//               style={tw`border border-white py-2 px-5 rounded-full text-center`}
//               onPress={() => setSelectedCategory(null)}
//             >
//               <Text style={tw`text-white text-center text-base font-bold`}>
//                 Close
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showImprovementModal}
//         onRequestClose={() => setShowImprovementModal(false)}
//       >
//         <View style={tw`flex-1 justify-center bg-black bg-opacity-80`}>
//           <View style={tw`bg-[#252525] p-10 rounded-2xl mx-5`}>
//             <Text style={tw`text-white text-3xl font-bold mb-5`}>
//               Improvement Tips
//             </Text>
//             <ScrollView style={tw`max-h-96`}>
//               <Markdown style={markdownStyles}>{improvementTips}</Markdown>
//             </ScrollView>
//             <TouchableOpacity
//               style={tw`border border-white py-2 px-5 rounded-full text-center mt-5`}
//               onPress={() => setShowImprovementModal(false)}
//             >
//               <Text style={tw`text-white text-center text-base font-bold`}>
//                 Close
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {loading && (
//         <View
//           style={tw`absolute inset-0 bg-black bg-opacity-50 justify-center items-center`}
//         >
//           <ActivityIndicator size="large" color="#FFFFFF" />
//           <Text style={tw`text-white mt-4 text-lg`}>
//             Getting improvement tips...
//           </Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default AuraResult;

import { View, Text } from "react-native";
import React from "react";

const AuraResult = () => {
  return (
    <View>
      <Text>AuraResult</Text>
    </View>
  );
};

export default AuraResult;
