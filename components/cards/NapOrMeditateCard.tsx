import { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { Button, Card } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ThemedText } from "../ThemedText";
import { convertMinToHrMin } from "@/util/SleepSession";
import { SymptomItem } from "@/constants/Symptoms";
import { Availability } from "expo-calendar";
import CalendarService from "@/services/CalendarService";

interface NapOrMeditateCardProps {
  negativeEnergy: SymptomItem;
  sleepDuration: number;
  sleepTime: Dayjs | null;
  todayDayJS: Dayjs;
}

export default function NapOrMeditateCard({
  negativeEnergy,
  sleepDuration,
  sleepTime,
  todayDayJS,
}: NapOrMeditateCardProps) {
  const [dismissedToday, setDismissedToday] = useState(false);
  const [suggestNap, setSuggestNap] = useState(false);

  // Check if the user has dismissed the card today
  const checkDismissedToday = async () => {
    const result = await SecureStore.getItemAsync("lastDismissedNapOrMeditate");

    if (result && JSON.parse(result) > todayDayJS.startOf("day").valueOf()) {
      setDismissedToday(true);
    } else {
      // Check the current time of the day and
      // suggest a nap or meditation
      setSuggestNap(todayDayJS.hour() < 13);
    }
  };

  const openCreateEventSystemUI = async () => {
    // @TODO: Base the startDate based on the user's "free space"
    // across multiple calendars. How does this look like on Samsung?
    const startDate = suggestNap
      ? todayDayJS.hour(12).minute(0).second(0) // Nap at 12:00PM
      : todayDayJS.add(1, "hours").minute(0).second(0); // Meditate in 1h

    const endDate = suggestNap
      ? startDate.add(30, "minutes")
      : startDate.add(15, "minutes");

    const eventData = {
      title: suggestNap ? "Nap" : "Meditate",
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      availability: Availability.BUSY, // Napping and Meditation is busy activity!
    };

    // User can choose not to schedule the session
    // Regardless of whether the session was scheduled or not,
    // we've done our part. Dismiss the card to avoid annoying the user.
    await CalendarService.createEventInCalendarAsync(eventData);
    await dismissCard();
  };

  const dismissCard = async () => {
    await SecureStore.setItemAsync(
      "lastDismissedNapOrMeditate",
      `${todayDayJS.valueOf()}`
    );
    setDismissedToday(true);
  };

  useEffect(() => {
    checkDismissedToday();
  }, [dismissedToday]);

  /* Only ask this if 
  - sleepDuration < 420 (7h) && 
  - negativeEnergy is not empty &&
  - user has not dismissed the card before */
  return (
    sleepDuration < 420 &&
    negativeEnergy &&
    !dismissedToday && (
      <Card mode="elevated" style={{ marginBottom: 20 }}>
        <Card.Content>
          {/* Other variations: You slept late; you slept <7h; your sleep dfragmented */}
          <ThemedText variant="default" style={{ marginBottom: 20 }}>
            You mentioned feeling{" "}
            {negativeEnergy && negativeEnergy.label.toLowerCase()} today and you
            only slept {convertMinToHrMin(sleepDuration)} hours last night.
          </ThemedText>
          <ThemedText variant="defaultSemiBold" style={{ marginBottom: 10 }}>
            Do you want to schedule a{" "}
            {suggestNap ? "nap" : "meditation session"} later today?
          </ThemedText>
        </Card.Content>

        <Card.Actions>
          <Button style={{ marginRight: "auto" }} onPress={dismissCard}>
            No
          </Button>
          <Button onPress={openCreateEventSystemUI}>Yes</Button>
        </Card.Actions>
      </Card>
    )
  );
}
