import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#666666",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "HankenGrotesk",
          textTransform: "uppercase",
          fontSize: 10,
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: "#F2F2F2",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          minHeight: 65 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="wardrobe/index"
        options={{
          title: "Wardrobe",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hanger" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stylist/index"
        options={{
          title: "Stylist",
          tabBarIcon: ({ color }) => <MaterialIcons name="auto-awesome" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="outfit/index"
        options={{
          title: "Outfit",
          tabBarIcon: ({ color }) => <FontAwesome5 name="question" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <MaterialIcons name="group" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="market/index"
        options={{
          title: "Market",
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
