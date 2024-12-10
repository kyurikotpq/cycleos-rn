import * as Calendar from "expo-calendar";

class CalendarService {
  private static instance: CalendarService;

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async checkPermissions() {
    const { granted } = await Calendar.getCalendarPermissionsAsync();

    if (!granted) {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      console.log(status);
      return status === "granted";
    }
    return granted;
  }

  async createEventInCalendarAsync(eventData: any) {
    // @TODO: Add better permission checks
    const granted = await this.checkPermissions();
    if (!granted) {
      return false;
    }

    // @TODO: How would this look like in Samsung?
    // On a Pixel 8a it opens Google Calendar
    return Calendar.createEventInCalendarAsync(eventData);
  }

  async checkCalendarForFreeSpace(minDuration: number) {
    // @TODO: Not implemented yet
    const granted = await this.checkPermissions();
    console.log(granted);
    if (!granted) {
      return false;
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar = calendars.find((calendar) => calendar.isPrimary);

    console.log(calendars, defaultCalendar);

    if (!defaultCalendar) {
      return false;
    }

    // const events = await Calendar.getEventsAsync([defaultCalendar.id], {
    //   startDate: new Date(),
    //   endDate: new Date(Date.now() + minDuration),
    // });

    // return events.length === 0;
  }
}

export default CalendarService.getInstance();

// {
//   useEffect(() => {
//     (async () => {
//       const { status } = await Calendar.requestCalendarPermissionsAsync();
//       if (status === "granted") {
//         const calendars = await Calendar.getCalendarsAsync(
//           Calendar.EntityTypes.EVENT
//         );
//         console.log("Here are all your calendars:");
//         console.log({ calendars });
//       }
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Calendar Module Example</Text>
//       <Button title="Create a new calendar" onPress={createCalendar} />
//     </View>
//   );
// }

// async function getDefaultCalendarSource() {
//   const defaultCalendar = await Calendar.getDefaultCalendarAsync();
//   return defaultCalendar.source;
// }

// async function createCalendar() {
//   const defaultCalendarSource =
//     Platform.OS === "ios"
//       ? await getDefaultCalendarSource()
//       : { isLocalAccount: true, name: "Expo Calendar" };
//   const newCalendarID = await Calendar.createCalendarAsync({
//     title: "Expo Calendar",
//     color: "blue",
//     entityType: Calendar.EntityTypes.EVENT,
//     sourceId: defaultCalendarSource.id,
//     source: defaultCalendarSource,
//     name: "internalCalendarName",
//     ownerAccount: "personal",
//     accessLevel: Calendar.CalendarAccessLevel.OWNER,
//   });
//   console.log(`Your new calendar ID is: ${newCalendarID}`);
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
// });
