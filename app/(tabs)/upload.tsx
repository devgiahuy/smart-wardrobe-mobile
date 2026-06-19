import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

export default function UploadScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text className="text-xl font-bold text-foreground">Upload Screen</Text>
      <Button className="mt-4">
        Thêm quần áo mới
      </Button>
    </View>
  );
}
