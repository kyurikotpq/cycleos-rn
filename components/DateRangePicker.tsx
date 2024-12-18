//  Modified from documentation: https://marceloprado.github.io/flash-calendar/fundamentals/usage

import {
  Calendar,
  CalendarListRef,
  CalendarActiveDateRange,
  CalendarOnDayPress,
  CalendarTheme,
} from "@marceloterreiro/flash-calendar";

const linearAccent = "#FF6459";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      color: "rgba(0, 0, 0, 0.5)",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgba(0, 0, 0, 0.5)" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 4,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(0, 0, 0, 0.5)" : "#303030",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? linearAccent : "transparent",
      },
      content: {
        color: isPressed ? "#303030" : "rgba(0, 0, 0, 0.5)",
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

interface DateRangePickerProps {
  calendarInstanceId?: string;
  onCalendarDayPress: CalendarOnDayPress;
  calendarActiveDateRanges: CalendarActiveDateRange[];
  innerRef?: React.RefObject<CalendarListRef>;
}

export default function DateRangePicker({
  onCalendarDayPress,
  calendarActiveDateRanges,
  innerRef,
  ...props
}: DateRangePickerProps & Record<string, any>) {
  return (
    <Calendar.List
      calendarDayHeight={30}
      calendarSpacing={40}
      calendarFirstDayOfWeek="sunday"
      calendarRowHorizontalSpacing={16}
      calendarRowVerticalSpacing={16}
      calendarActiveDateRanges={calendarActiveDateRanges}
      onCalendarDayPress={onCalendarDayPress}
      theme={linearTheme}
      ref={innerRef}
      {...props}
    />
  );
}
