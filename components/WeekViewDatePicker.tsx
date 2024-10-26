import {
  useMemo,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { Surface } from "react-native-paper";

interface WeekViewDatePickerProps {
  initialDate?: string;
  maxDate?: string;
  currentSelectedDate?: string;
  onDateChanged: (date: string) => void;
}
const screenWidth = Dimensions.get("window").width;
const NUM_WEEKS = 12;

const WeekViewDatePicker = (
  {
    initialDate,
    maxDate,
    onDateChanged,
    currentSelectedDate,
  }: WeekViewDatePickerProps,
  ref: React.ForwardedRef<any>
) => {
  const initialDay = useMemo(
    () => (initialDate ? dayjs(initialDate) : dayjs()),
    [initialDate]
  );
  const maxDay = useMemo(() => (maxDate ? dayjs(maxDate) : null), [maxDate]);
  const daysOfWeekHeaders = useMemo(
    () => ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    []
  );

  const flatListRef = useRef<FlatList>(null);

  const scrollToToday = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: NUM_WEEKS,
        animated: true,
      });
    }
  };
  useImperativeHandle(ref, () => ({
    scrollToToday,
  }));

  const getWeekDays = (startDate: dayjs.Dayjs) => {
    return Array.from({ length: 7 }, (_, i) => startDate.add(i, "day"));
  };

  const getAllWeeks = useMemo(() => {
    let currentDate = initialDay.startOf("week");

    const weeks = [getWeekDays(currentDate)];
    for (let i = 0; i < NUM_WEEKS; i++) {
      const previousWeek = currentDate.subtract(7, "day");
      weeks.unshift(getWeekDays(previousWeek));
      currentDate = previousWeek;
    }
    return weeks;
  }, []);

  const handleDatePress = useCallback(
    (date: dayjs.Dayjs) => {
      if (!maxDay || date.isBefore(maxDay) || date.isSame(maxDay, "day")) {
        onDateChanged(date.format("YYYY-MM-DD"));
      }
    },
    [maxDay, onDateChanged]
  );

  const renderWeek = (days: dayjs.Dayjs[]) => {
    return days.map((date) => {
      const isToday = date.isSame(dayjs(), "day");
      const isCurrentDate = date.isSame(currentSelectedDate, "day");

      // @TODO: The touching animation feels a little slow, I'm not sure what the issue is...
      return (
        <TouchableOpacity
          key={date.format("YYYY-MM-DD")}
          onPress={() => handleDatePress(date)}
          disabled={maxDay != null && date.isAfter(maxDay)}
          style={[
            styles.dateContainer,
            isCurrentDate && styles.currentDate,
            isToday && styles.today,
            { opacity: maxDay && date.isAfter(maxDay) ? 0.2 : 1 },
          ]}
        >
          <Text style={styles.dateText}>{date.format("DD")}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <GestureHandlerRootView>
      <Surface elevation={1}>
        <View style={styles.headerContainer}>
          {daysOfWeekHeaders.map((day) => (
            <Text key={day} style={styles.headerText}>
              {day}
            </Text>
          ))}
        </View>
        <FlatList
          horizontal
          ref={flatListRef}
          pagingEnabled={true}
          data={getAllWeeks}
          renderItem={({ item }) => (
            <View style={styles.weekContainer}>{renderWeek(item)}</View>
          )}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={NUM_WEEKS}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />
      </Surface>
    </GestureHandlerRootView>
  );
};

export default forwardRef(WeekViewDatePicker);

const styles = StyleSheet.create({
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  weekContainer: {
    width: screenWidth,
    flexDirection: "row",
    flex: 1,
    padding: 10,
  },
  dateContainer: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
  },
  dateText: {
    textAlign: "center",
    fontSize: 16,
  },
  today: {
    borderWidth: 1,
  },
  currentDate: {
    backgroundColor: "#ffd000",
  },
});
