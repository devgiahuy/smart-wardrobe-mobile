import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import { useCreateTopUpRequestMutation } from '@/features/wallet/queries/wallet.queries';

const AMOUNTS = [50000, 100000, 200000, 500000];

export default function DepositScreen() {
  const [amount, setAmount] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  const createTopUpMutation = useCreateTopUpRequestMutation();

  const handleDeposit = async () => {
    const value = parseInt(amount.replace(/\D/g, ''), 10);
    if (isNaN(value) || value < 10000) {
      Alert.alert('Lỗi', 'Số tiền nạp tối thiểu là 10,000đ');
      return;
    }

    try {
      const res = await createTopUpMutation.mutateAsync({
        amount: value,
        returnUrl: 'smartwardrobe://payment/success',
        cancelUrl: 'smartwardrobe://payment/cancel',
      });
      if (res.paymentUrl) {
        setPaymentUrl(res.paymentUrl);
      } else {
        throw new Error('Không nhận được link thanh toán');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tạo yêu cầu nạp tiền');
    }
  };

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState;
    if (!url) return;

    if (url.includes('smartwardrobe://payment/success') || url.includes('payment/success')) {
      Alert.alert('Thành công', 'Nạp tiền thành công!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setPaymentUrl(null);
    } else if (url.includes('smartwardrobe://payment/cancel') || url.includes('payment/cancel')) {
      Alert.alert('Đã hủy', 'Giao dịch nạp tiền đã bị hủy');
      setPaymentUrl(null);
    }
  };

  if (paymentUrl) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-row items-center px-4 py-3 border-b border-input">
          <TouchableOpacity onPress={() => setPaymentUrl(null)} className="mr-4">
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">Thanh toán PayOS</Text>
        </View>
        <WebView 
          source={{ uri: paymentUrl }} 
          className="flex-1"
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="absolute inset-0 items-center justify-center bg-background">
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Nạp Tiền</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 p-6">
        <Text className="font-bold text-lg mb-4 text-foreground">Chọn số tiền nạp</Text>
        
        <View className="flex-row flex-wrap gap-4 mb-6">
          {AMOUNTS.map((val) => (
            <TouchableOpacity 
              key={val}
              onPress={() => setAmount(val.toString())}
              className={`w-[47%] py-4 rounded-xl border items-center justify-center ${amount === val.toString() ? 'bg-primary border-primary' : 'bg-background border-input'}`}
            >
              <Text className={`font-bold text-lg ${amount === val.toString() ? 'text-primary-foreground' : 'text-foreground'}`}>
                {val.toLocaleString('vi-VN')} đ
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-bold mb-2 text-foreground">Hoặc nhập số tiền khác</Text>
        <TextInput
          className="bg-muted border border-input p-4 rounded-xl text-foreground text-lg font-medium mb-8"
          value={amount ? parseInt(amount.replace(/\D/g, '') || '0', 10).toLocaleString('vi-VN') : ''}
          onChangeText={(text) => setAmount(text.replace(/\D/g, ''))}
          keyboardType="numeric"
          placeholder="Tối thiểu 10,000đ"
        />

        <View className="bg-muted p-4 rounded-xl mb-8 flex-row items-start">
          <CreditCard size={20} color="#666" className="mr-3 mt-1" />
          <View className="flex-1">
            <Text className="font-bold text-foreground mb-1">Thanh toán qua mã QR (PayOS)</Text>
            <Text className="text-sm text-muted-foreground">Bạn sẽ được chuyển hướng đến cổng thanh toán an toàn để quét mã QR chuyển khoản.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleDeposit}
          disabled={createTopUpMutation.isPending || !amount}
          className="w-full bg-primary py-4 rounded-xl flex-row justify-center items-center mt-auto"
        >
          {createTopUpMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-primary-foreground font-bold text-lg">Tiếp Tục</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
