import { Permission } from "react-native-health-connect";

const PERMISSIONS: Permission[] = [
  { accessType: "read", recordType: "Steps" },
  { accessType: "read", recordType: "SleepSession" },
  { accessType: "read", recordType: "ExerciseSession" },
];

export default PERMISSIONS;
