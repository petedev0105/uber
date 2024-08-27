import { Stack } from "expo-router";

const ChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[name]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
