import { router } from "expo-router";
import { Avatar, Card, Text } from "react-native-paper";

export default function HormonoscopeCard() {
  // @TODO: Change text to prompt daily-check in after 12pm local time
  
  const showHormonoscopeOrCheckIn = () => {
    // Route to the hormonoscope screen
    router.push("/hormonoscope");
  };

  return (
    <>
      <Card mode="elevated" onPress={showHormonoscopeOrCheckIn}>
        <Card.Title
          title="Take it easy today."
          titleVariant="titleMedium"
          subtitle={
            <Text>
              You didn't sleep well last night.{"\n"}
              <Text style={{ fontWeight: 700 }}>Here's what you can do ➡️</Text>
            </Text>
          }
          subtitleNumberOfLines={2}
          left={(props) => <Avatar.Icon {...props} icon="lightbulb" />}
          style={{ padding: 20 }}
        />
      </Card>
    </>
  );
}
