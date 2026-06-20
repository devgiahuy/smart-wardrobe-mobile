import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Send, SlidersHorizontal, X, Save, RefreshCw } from 'lucide-react-native';

import { aiApi } from '@/features/ai-stylist/api/ai.api';
import { AIOutfitRecommendationRes, ChatMessage } from '@/features/ai-stylist/types';
import { useCreateChatSessionMutation } from '@/features/ai-stylist/queries/ai.queries';
import { useBatchUploadWardrobeItemsMutation } from '@/features/wardrobe/queries/wardrobe.queries';
import { useCreateOutfit } from '@/features/outfits/queries/outfits.queries';
import { router } from 'expo-router';

const OCCASIONS = ["Đi học", "Đi làm", "Hẹn hò", "Tiệc", "Thể thao", "Ở nhà"];
const STYLES = ["Minimalist", "Casual", "Formal", "Trendy", "Vintage", "Streetwear"];
const SEASONS = ["Mùa xuân", "Mùa hạ", "Mùa thu", "Mùa đông"];

export default function AIStylistScreen() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextID, setContextID] = useState<string>("");
  const [outfitData, setOutfitData] = useState<AIOutfitRecommendationRes | null>(null);
  
  // Params Modal
  const [showParamsModal, setShowParamsModal] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const createSessionMutation = useCreateChatSessionMutation();
  const createOutfitMutation = useCreateOutfit();

  useEffect(() => {
    // Initial welcome message
    setChatMessages([
      {
        id: 'welcome',
        role: 'ai',
        content: 'Xin chào! Tôi là AI Stylist. Hãy nhập yêu cầu phối đồ hoặc thiết lập thông số để tôi gợi ý cho bạn nhé.',
        timestamp: Date.now()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleGenerateRecommendation = async (initialInput?: string) => {
    setIsGenerating(true);
    setShowParamsModal(false);
    
    // Add User message indicating parameters or input
    const userPrompt = initialInput || `Phối đồ cho: ${[selectedOccasion, selectedStyle, selectedSeason].filter(Boolean).join(', ')}`;
    if (userPrompt.trim()) {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userPrompt, timestamp: Date.now() }]);
      scrollToBottom();
    }

    try {
      const occasionMap: Record<string, string> = {
        "Đi học": "casual",
        "Đi làm": "formal",
        "Hẹn hò": "casual",
        "Tiệc": "party",
        "Thể thao": "sport",
        "Ở nhà": "casual",
      };

      const res = await aiApi.getOutfitRecommendation({
        occasion: occasionMap[selectedOccasion] || "",
        styleTarget: selectedStyle ? selectedStyle.toLowerCase() : "",
        season: selectedSeason ? selectedSeason.toLowerCase() : "",
        details: initialInput || ""
      });

      setOutfitData(res);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: res.explanation || 'Đây là gợi ý của tôi dành cho bạn!',
        timestamp: Date.now()
      }]);

      try {
        const session = await createSessionMutation.mutateAsync({ title: res.title });
        setContextID(session.id);
      } catch (e) {
        console.error("Failed to create chat session", e);
      }
      scrollToBottom();
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: 'Xin lỗi, tôi không thể tạo gợi ý lúc này. Vui lòng thử lại sau.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsGenerating(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatting) return;

    if (!contextID && !outfitData) {
      // First turn, generate recommendation based on text
      const text = chatInput;
      setChatInput("");
      await handleGenerateRecommendation(text);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatting(true);
    scrollToBottom();

    const aiMsgId = (Date.now() + 1).toString();
    setChatMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '', timestamp: Date.now() }]);

    await aiApi.sendChatMessageStream(
      contextID,
      userMsg.content,
      (chunk) => {
        setChatMessages(prev =>
          prev.map(msg => msg.id === aiMsgId ? { ...msg, content: msg.content + chunk } : msg)
        );
      },
      (fullText) => {
        setIsChatting(false);
        setChatMessages(prev =>
          prev.map(msg => msg.id === aiMsgId ? { ...msg, content: fullText } : msg)
        );
        scrollToBottom();
      },
      (error) => {
        setIsChatting(false);
        setChatMessages(prev =>
          prev.map(msg => msg.id === aiMsgId ? { ...msg, content: 'Đã có lỗi xảy ra.' } : msg)
        );
      }
    );
  };

  const saveOutfitToWardrobe = async () => {
    if (!outfitData) return;
    try {
      await createOutfitMutation.mutateAsync({
        name: outfitData.title || 'AI Outfit',
        description: outfitData.explanation,
        items: outfitData.items.map((item, idx) => ({
          wardrobeItemId: item.primary.id,
          positionX: 0,
          positionY: 0,
          scale: 1,
          layerOrder: idx + 1
        }))
      });
      Alert.alert('Thành công', 'Đã lưu bộ phối vào tủ đồ!');
      router.push('/(tabs)/outfits');
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu bộ phối.');
    }
  };

  const renderOutfitRecommendation = () => {
    if (!outfitData || outfitData.items.length === 0) return null;

    return (
      <View className="mt-4 p-4 bg-muted rounded-xl border border-input">
        <Text className="font-bold text-lg text-foreground mb-2">{outfitData.title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 flex-row">
          {outfitData.items.map((item, idx) => (
            <View key={idx} className="mr-3 w-28 bg-background rounded-lg border border-input overflow-hidden">
              <View className="w-full aspect-square bg-muted">
                {item.primary.imageUrl ? (
                  <Image source={{ uri: item.primary.imageUrl }} className="w-full h-full" resizeMode="cover" />
                ) : null}
              </View>
              <View className="p-2">
                <Text className="text-xs font-bold text-foreground capitalize" numberOfLines={1}>{item.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity 
          onPress={saveOutfitToWardrobe}
          className="mt-4 bg-primary px-4 py-3 rounded-lg flex-row justify-center items-center"
        >
          <Save size={16} color="#FFF" className="mr-2" />
          <Text className="text-primary-foreground font-bold">Lưu vào Bộ Phối</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-input">
        <View className="w-8 h-8 bg-black rounded flex items-center justify-center mr-3">
          <Sparkles size={16} color="#FFF" />
        </View>
        <View>
          <Text className="text-lg font-bold text-foreground">AI Stylist</Text>
          <Text className="text-xs text-muted-foreground">Trợ lý phối đồ cá nhân</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {chatMessages.map((msg, index) => (
          <View key={msg.id} className={`mb-4 w-full flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <View className={`max-w-[80%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-primary rounded-tr-sm' : 'bg-muted border border-input rounded-tl-sm'}`}>
              <Text className={`text-[15px] leading-6 ${msg.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}`}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {isGenerating && (
          <View className="mb-4 w-full flex-row justify-start">
            <View className="max-w-[80%] rounded-2xl p-4 bg-muted border border-input flex-row items-center space-x-2">
              <ActivityIndicator size="small" color="#000" />
              <Text className="text-foreground ml-2">Đang tìm bộ phối phù hợp...</Text>
            </View>
          </View>
        )}

        {isChatting && chatMessages[chatMessages.length - 1]?.role !== 'ai' && (
          <View className="mb-4 w-full flex-row justify-start">
             <View className="max-w-[80%] rounded-2xl p-4 bg-muted border border-input flex-row items-center space-x-2">
              <Text className="text-foreground">Đang suy nghĩ...</Text>
            </View>
          </View>
        )}

        {renderOutfitRecommendation()}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="p-4 border-t border-input bg-background flex-row items-center">
          <TouchableOpacity onPress={() => setShowParamsModal(true)} className="p-2 mr-2 border border-input rounded-full bg-muted">
            <SlidersHorizontal size={20} color="#000" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 bg-muted border border-input rounded-full px-4 py-2.5 text-foreground"
            placeholder="Nhập yêu cầu phối đồ..."
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendMessage}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={handleSendMessage} 
            disabled={isChatting || isGenerating || !chatInput.trim()}
            className="ml-2 p-2.5 bg-primary rounded-full disabled:opacity-50"
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Params Modal */}
      <Modal visible={showParamsModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-foreground">Thông số phối đồ</Text>
              <TouchableOpacity onPress={() => setShowParamsModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[60vh] mb-6">
              <Text className="text-sm font-bold text-muted-foreground uppercase mb-2">Dịp</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {OCCASIONS.map(occ => (
                  <TouchableOpacity 
                    key={occ} 
                    onPress={() => setSelectedOccasion(occ === selectedOccasion ? "" : occ)}
                    className={`px-4 py-2 rounded-full border ${selectedOccasion === occ ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                  >
                    <Text className={selectedOccasion === occ ? 'text-primary-foreground font-medium' : 'text-foreground'}>{occ}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-bold text-muted-foreground uppercase mb-2">Phong cách</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {STYLES.map(style => (
                  <TouchableOpacity 
                    key={style} 
                    onPress={() => setSelectedStyle(style === selectedStyle ? "" : style)}
                    className={`px-4 py-2 rounded-full border ${selectedStyle === style ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                  >
                    <Text className={selectedStyle === style ? 'text-primary-foreground font-medium' : 'text-foreground'}>{style}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-bold text-muted-foreground uppercase mb-2">Mùa</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {SEASONS.map(season => (
                  <TouchableOpacity 
                    key={season} 
                    onPress={() => setSelectedSeason(season === selectedSeason ? "" : season)}
                    className={`px-4 py-2 rounded-full border ${selectedSeason === season ? 'bg-primary border-primary' : 'bg-background border-input'}`}
                  >
                    <Text className={selectedSeason === season ? 'text-primary-foreground font-medium' : 'text-foreground'}>{season}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              onPress={() => handleGenerateRecommendation()}
              disabled={isGenerating}
              className="w-full bg-primary py-4 rounded-xl items-center"
            >
              <Text className="text-primary-foreground font-bold text-lg">Tạo Gợi Ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
