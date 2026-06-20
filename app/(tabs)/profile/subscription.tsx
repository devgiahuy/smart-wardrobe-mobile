import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, CheckCircle2, Star, Zap, Infinity as InfinityIcon } from 'lucide-react-native';

import { useGetSubscriptionPlans, useGetMySubscription, useSubscribeToPlanMutation } from '@/features/subscription/queries/subscription.queries';
import { SubscriptionPlan } from '@/features/subscription/types';

export default function SubscriptionScreen() {
  const { data: plans, isLoading: isPlansLoading } = useGetSubscriptionPlans();
  const { data: mySub, isLoading: isMySubLoading } = useGetMySubscription();
  const subscribeMutation = useSubscribeToPlanMutation();
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    Alert.alert('Xác nhận', 'Hệ thống sẽ trừ tiền vào Ví điện tử của bạn. Bạn có muốn tiếp tục?', [
      { text: 'Hủy', style: 'cancel' },
      { 
        text: 'Đồng ý', 
        onPress: async () => {
          try {
            await subscribeMutation.mutateAsync(selectedPlan);
            Alert.alert('Thành công', 'Đăng ký gói hội viên thành công!');
          } catch (e: any) {
            if (e.response?.status === 402) {
              Alert.alert('Lỗi', 'Số dư không đủ. Vui lòng nạp thêm tiền vào ví.', [
                { text: 'Nạp tiền', onPress: () => router.push('/(tabs)/profile/deposit') },
                { text: 'Hủy', style: 'cancel' }
              ]);
            } else {
              Alert.alert('Lỗi', 'Không thể đăng ký gói. Vui lòng thử lại.');
            }
          }
        }
      }
    ]);
  };

  if (isPlansLoading || isMySubLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Gói Hội Viên</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Current Plan */}
        <View className="bg-primary p-6 rounded-2xl shadow-md mb-6 relative overflow-hidden">
          <View className="absolute -right-4 -top-4 opacity-10">
            <Star size={120} color="#FFF" />
          </View>
          <Text className="text-primary-foreground/80 font-medium mb-1">Gói hiện tại của bạn</Text>
          <Text className="text-3xl font-bold text-primary-foreground mb-4">
            {mySub?.planName || 'Gói Cơ Bản'}
          </Text>
          {mySub?.expiresAt && (
            <Text className="text-primary-foreground/90 font-medium">
              Hết hạn: {new Date(mySub.expiresAt).toLocaleDateString('vi-VN')}
            </Text>
          )}
          {!mySub?.expiresAt && (
            <Text className="text-primary-foreground/90 font-medium">Miễn phí trọn đời</Text>
          )}
        </View>

        <Text className="font-bold text-lg mb-4 text-foreground">Nâng cấp gói</Text>

        {/* Plans List */}
        <View className="space-y-4 mb-8">
          {plans?.map((plan: SubscriptionPlan) => {
            const isSelected = selectedPlan === (plan.slug || plan.planSlug);
            const isCurrent = mySub?.planSlug === (plan.slug || plan.planSlug);
            
            return (
              <TouchableOpacity
                key={plan.id || plan.slug || plan.planSlug}
                onPress={() => !isCurrent && setSelectedPlan(plan.slug || plan.planSlug || null)}
                disabled={isCurrent}
                className={`p-5 rounded-2xl border-2 mb-4 ${isSelected ? 'border-primary bg-primary/5' : isCurrent ? 'border-input bg-muted/50' : 'border-input bg-background'}`}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-xl font-bold text-foreground">{plan.name}</Text>
                  {isCurrent && (
                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                      <Text className="text-primary font-bold text-xs">HIỆN TẠI</Text>
                    </View>
                  )}
                  {isSelected && <CheckCircle2 size={24} color="#000" />}
                </View>

                <Text className="text-2xl font-bold text-foreground mb-4">
                  {plan.price === 0 ? 'Miễn phí' : `${plan.price?.toLocaleString('vi-VN')}đ`}
                  {plan.price! > 0 && <Text className="text-base font-normal text-muted-foreground">/{plan.durationDays} ngày</Text>}
                </Text>

                <View className="space-y-2">
                  <View className="flex-row items-center mt-2">
                    <CheckCircle2 size={16} color="#16a34a" className="mr-2" />
                    <Text className="text-foreground">Lưu tối đa {plan.maxWardrobeItems === -1 ? 'vô hạn' : plan.maxWardrobeItems} món đồ</Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <CheckCircle2 size={16} color="#16a34a" className="mr-2" />
                    <Text className="text-foreground">Lưu tối đa {plan.maxOutfits === -1 ? 'vô hạn' : plan.maxOutfits} bộ phối</Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <Zap size={16} color="#eab308" className="mr-2" fill="#eab308" />
                    <Text className="text-foreground">{plan.aiChatDailyQuota === -1 ? 'Không giới hạn' : plan.aiChatDailyQuota} lượt chat AI / ngày</Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <Zap size={16} color="#eab308" className="mr-2" fill="#eab308" />
                    <Text className="text-foreground">{plan.aiOutfitDailyQuota === -1 ? 'Không giới hạn' : plan.aiOutfitDailyQuota} lượt gợi ý phối đồ / ngày</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View className="p-4 border-t border-input bg-background">
        <TouchableOpacity
          onPress={handleSubscribe}
          disabled={!selectedPlan || subscribeMutation.isPending}
          className="w-full bg-primary py-4 rounded-xl flex-row justify-center items-center disabled:opacity-50"
        >
          {subscribeMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">Đăng Ký Ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
