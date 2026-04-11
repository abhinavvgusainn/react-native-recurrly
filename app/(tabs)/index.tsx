import "@/global.css";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import React from "react";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubId, setExpandedSubId] = React.useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-2.5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image source={images.avatar} className="size-16 rounded-full" />
          <Text className="ml-4 text-2xl font-sans-bold text-primary">
            {HOME_USER.name}
          </Text>
        </View>

        <Image source={icons.add} className="size-12" />
      </View>

      <View className="my-2.5 min-h-50 justify-between gap-5 rounded-bl-4xl rounded-tr-4xl bg-accent p-6">
        <Text className="text-xl font-sans-semibold text-white/80">
          Balance
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-4xl font-sans-extrabold text-white">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="text-xl font-sans-medium text-white">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">No upcoming renewal yet.</Text>
          }
        />
      </View>

      <View>
        <ListHeading title="All Subscriptions" />
        <SubscriptionCard
          {...HOME_SUBSCRIPTIONS[0]}
          expanded={expandedSubId === HOME_SUBSCRIPTIONS[0].id}
          onPress={() =>
            setExpandedSubId((currentId) =>
              currentId === HOME_SUBSCRIPTIONS[0].id
                ? null
                : HOME_SUBSCRIPTIONS[0].id,
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
