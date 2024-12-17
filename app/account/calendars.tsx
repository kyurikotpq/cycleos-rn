import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import { List, Switch } from "react-native-paper";
import CalendarService from "@/services/CalendarService";
import { Calendar } from "expo-calendar";

export default function CalendarSyncSettingsScreen() {
  const [calGroupedByEmail, setCalGroupedByEmail] = useState<{
    [key: string]: Calendar[];
  }>({});
  const [groupedCalendarsArr, setGroupedCalendarsArr] = useState<
    { account: string; calendars: Calendar[] }[]
  >([]);

  const toggleSync = (calendarId: string) => async () => {
    console.log("Toggling sync for calendar", calendarId);
  };
  const toggleSyncAll = (accountId: string) => async () => {
    console.log("Toggling sync for account", accountId);
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
      setCalGroupedByEmail(groupedByEmail);
      setGroupedCalendarsArr(grouped);
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <ThemedText style={{ padding: 20 }}>
          Select the calendars you'd like CycleOS to use to check for
          conflicting events.
        </ThemedText>
        {groupedCalendarsArr &&
          groupedCalendarsArr.map((c) => (
            <List.Section style={{ marginBottom: 20 }} key={c.account}>
              <List.Item
                title={c.account}
                titleStyle={{ fontWeight: "bold" }}
                right={() => (
                  <Switch
                    value={false}
                    onValueChange={toggleSyncAll(c.account)}
                  />
                )}
              />
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
