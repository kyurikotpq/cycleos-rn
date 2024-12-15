import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { List, Switch } from "react-native-paper";
import CalendarService from "@/services/CalendarService";
import { Calendar } from "expo-calendar";

export default function CalendarSyncSettingsScreen() {
  const [groupedCalendars, setGroupedCalendars] = useState<
    { account: string; calendars: Calendar[] }[]
  >([]);

  const toggleSync = (calendarId: string) => async () => {
    console.log("Toggling sync for calendar", calendarId);
  };

  useEffect(() => {
    (async () => {
      const calendars = await CalendarService.getCalendarsAsync();

      const groupedByEmail: { [key: string]: Calendar[] } = {};

      if (calendars) {
        calendars.forEach((c: Calendar) => {
          if (groupedByEmail[c.source.name] !== undefined) {
            groupedByEmail[c.source.name].push(c);
          } else {
            groupedByEmail[c.source.name] = [c];
          }
        });
      }

      const grouped = [];
      for (let account in groupedByEmail) {
        grouped.push({ account, calendars: groupedByEmail[account] });
      }
      console.log(groupedByEmail, grouped);
      setGroupedCalendars(grouped);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedText style={{ padding: 20 }}>
          Select the calendars you'd like CycleOS to use to check for
          conflicting events.
        </ThemedText>
        {groupedCalendars &&
          groupedCalendars.map((c) => (
            <List.Section key={c.account}>
              <List.Subheader style={{ fontWeight: "bold" }}>
                {c.account}
              </List.Subheader>
              {c.calendars.map((calendar) => (
                <List.Item
                  key={calendar.id}
                  title={calendar.title}
                  style={{ paddingLeft: 15 }}
                  left={() => (
                    <List.Icon icon="circle" color={calendar.color} />
                  )}
                  right={() => (
                    <Switch
                      value={false}
                      onValueChange={toggleSync(calendar.id)}
                    />
                  )}
                />
              ))}
            </List.Section>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
