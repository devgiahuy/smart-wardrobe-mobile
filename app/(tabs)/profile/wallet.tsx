import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

import { useGetWalletBalance, useGetWalletStatements } from '@/features/wallet/queries/wallet.queries';

export default function WalletScreen() {
  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance, isRefetching: isRefetchingBalance } = useGetWalletBalance();
  const { data: statements, isLoading: isStatementsLoading, refetch: refetchStatements, isRefetching: isRefetchingStatements } = useGetWalletStatements();

  const handleRefresh = () => {
    refetchBalance();
    refetchStatements();
  };

  const isRefreshing = isRefetchingBalance || isRefetchingStatements;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-input">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Ví điện tử</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        {/* Balance Card */}
        <View className="p-4">
          <View className="bg-primary rounded-2xl p-6 shadow-md">
            <Text className="text-primary-foreground/80 font-medium mb-1">Số dư hiện tại</Text>
            {isBalanceLoading ? (
              <ActivityIndicator color="#FFF" className="my-2" />
            ) : (
              <Text className="text-3xl font-bold text-primary-foreground">
                {balance?.balance?.toLocaleString('vi-VN') || 0} <Text className="text-xl">VNĐ</Text>
              </Text>
            )}

            <View className="flex-row mt-6 gap-4">
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/profile/deposit')}
                className="flex-1 bg-white/20 py-3 rounded-xl flex-row justify-center items-center"
              >
                <Plus size={18} color="#FFF" className="mr-2" />
                <Text className="text-primary-foreground font-bold">Nạp Tiền</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white/20 py-3 rounded-xl flex-row justify-center items-center">
                <ArrowUpRight size={18} color="#FFF" className="mr-2" />
                <Text className="text-primary-foreground font-bold">Rút Tiền</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View className="p-4">
          <Text className="font-bold text-lg mb-4 text-foreground">Lịch sử giao dịch</Text>
          
          {isStatementsLoading ? (
            <ActivityIndicator className="my-8" />
          ) : statements?.length === 0 ? (
            <Text className="text-muted-foreground text-center py-8">Chưa có giao dịch nào.</Text>
          ) : (
            statements?.map(transaction => (
              <View key={transaction.id} className="flex-row items-center py-4 border-b border-input">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${transaction.transactionType === 1 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {transaction.transactionType === 1 ? (
                    <ArrowDownLeft size={20} color="#16a34a" /> // Top up
                  ) : (
                    <ArrowUpRight size={20} color="#dc2626" /> // Withdraw / Pay
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground text-base">{transaction.description}</Text>
                  <Text className="text-xs text-muted-foreground">{new Date(transaction.createdAt).toLocaleString('vi-VN')}</Text>
                </View>
                <Text className={`font-bold text-base ${transaction.transactionType === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transactionType === 1 ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
