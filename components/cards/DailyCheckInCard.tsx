import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Avatar, Card, Text } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";
import { EveningDailyQuotes, MorningDailyQuotes } from "@/constants/Quotes";

interface DailyCheckInCardProps {
  todayDayJS: any;
}

export default function DailyCheckInCard({
  todayDayJS,
}: DailyCheckInCardProps) {
  const LOG_NEW_SYMPTOMS_SUBTITLE = "New symptoms? Log them now.";
  const [title, setTitle] = useState("How are you feeling today?");
  const [subtitle, setSubtitle] = useState(
    "Check in now to get your insights."
  );

  const checkAndUpdateCardText = async () => {
    // Check if user has already logged symptoms for today morning
    const result = await SecureStore.getItemAsync("lastSymptomCheckInTime");
    if (!result) return;

    const lastSymptomCheckInTimeDayJS = dayjs(JSON.parse(result));
    console.log("lastSymptomCheckInTimeDayJS", lastSymptomCheckInTimeDayJS);

    // Prompt user to check in the evening
    if (
      todayDayJS.hour() >= 17 &&
      lastSymptomCheckInTimeDayJS.hour() < todayDayJS.hour()
    ) {
      setTitle("How are you feeling this evening?");
      setSubtitle("Check in now to complete your insights for today.");
    } else if (
      lastSymptomCheckInTimeDayJS.format("YYYY-MM-DD") ===
      todayDayJS.format("YYYY-MM-DD")
    ) {
      // User has already checked in for the morning and evening. Show inspiring quotes.
      if (todayDayJS.hour() < 17) {
        const randomQuoteIndex = Math.floor(
          Math.random() * (MorningDailyQuotes.length - 1)
        );
        setTitle(MorningDailyQuotes[randomQuoteIndex]);
        setSubtitle(LOG_NEW_SYMPTOMS_SUBTITLE);
      } else {
        const randomQuoteIndex = Math.floor(
          Math.random() * (EveningDailyQuotes.length - 1)
        );
        setTitle(EveningDailyQuotes[randomQuoteIndex]);
        setSubtitle(LOG_NEW_SYMPTOMS_SUBTITLE);
      }
    }
  };

  useEffect(() => {
    checkAndUpdateCardText();
  }, []);

  return (
    <>
      <Card
        mode="elevated"
        onPress={() =>
          router.push({ pathname: "/tracking", params: { insights: "true" } })
        }
      >
        <Card.Title
          title={title}
          titleStyle={{ marginBottom: 0 }}
          titleVariant="titleMedium"
          subtitle={subtitle && <Text>{subtitle}</Text>}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon={subtitle == LOG_NEW_SYMPTOMS_SUBTITLE ? "dumbbell" : "help"}
            />
          )}
        />
      </Card>
    </>
  );
}
