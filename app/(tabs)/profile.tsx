import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text className="text-xl font-bold text-foreground">Profile Screen</Text>
      <Button variant="outline" className="mt-4">
        Đăng xuất
      </Button>
    </View>
  );
}
