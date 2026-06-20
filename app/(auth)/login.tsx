import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "@/tw";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import { secureStorage } from "@/lib/storage";

export default function LoginScreen() {
  const router = useRouter();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!loginName || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const tokens = await authApi.login({ loginName, password });
      
      await secureStorage.setItemAsync("accessToken", tokens.accessToken);
      if (tokens.refreshToken) {
        await secureStorage.setItemAsync("refreshToken", tokens.refreshToken);
      }

      const user = await authApi.getMe();
      login(user);
      
      router.replace("/(tabs)/community");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "var(--color-sf-bg)" }}>
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12">
        <View className="mb-12 items-center">
          {/* Luxury Logo Placeholder */}
          <View className="w-16 h-16 bg-sf-accent rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-serif">S</Text>
          </View>
          <Text className="text-3xl font-serif text-sf-text tracking-wider uppercase">
            Smart Wardrobe
          </Text>
          <Text className="text-sm text-sf-text-2 mt-2 tracking-widest uppercase">
            Elevate Your Style
          </Text>
        </View>

        <View className="gap-6">
          {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
          
          <View>
            <Text className="text-xs uppercase tracking-wider text-sf-text-2 mb-2 ml-1">
              Email or Username
            </Text>
            <TextInput
              className="w-full bg-sf-bg-2 px-4 py-4 rounded-xl text-sf-text font-sans text-base"
              placeholder="Enter your email"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
              value={loginName}
              onChangeText={setLoginName}
            />
          </View>

          <View>
            <Text className="text-xs uppercase tracking-wider text-sf-text-2 mb-2 ml-1">
              Password
            </Text>
            <TextInput
              className="w-full bg-sf-bg-2 px-4 py-4 rounded-xl text-sf-text font-sans text-base"
              placeholder="Enter your password"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="items-end">
            <Pressable>
              <Text className="text-sm text-sf-accent">Forgot password?</Text>
            </Pressable>
          </View>

          <Pressable
            className={`w-full bg-sf-text py-4 rounded-xl items-center mt-4 active:opacity-80 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-sans text-base tracking-widest uppercase">
                Sign In
              </Text>
            )}
          </Pressable>
        </View>

        <View className="flex-row justify-center mt-12">
          <Text className="text-sf-text-2">Don't have an account? </Text>
          <Pressable>
            <Text className="text-sf-accent font-semibold">Register</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
