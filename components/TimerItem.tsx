import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Timer, TimerStatus } from "../app/(tabs)/types";
import ProgressBar from 'react-native-progress/Bar';
import { TimerItemStyles as styles } from '../app/styles/TimerItem';
interface TimerItemProps {
  timer: Timer;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({ timer, onPause, onReset }) => {
    const progress = (timer.remaining / timer.duration);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Duration: {timer.duration}s</Text>
        <Text style={styles.timeText}>Remaining: {timer.remaining}s</Text>
      </View>
      {/* Display the progress bar */}
      <ProgressBar
        progress={progress}
        width={null} // Makes it responsive
        height={8}
        color="#f39c12"
        unfilledColor="#e0e0e0"
        borderWidth={0}
        borderRadius={4}
        style={styles.progressBar}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title={timer.status === TimerStatus.Running ? "Pause" : "Resume"} 
          onPress={() => onPause(timer.id)} 
          color="#f39c12"
        />
        <Button title="Reset" onPress={() => onReset(timer.id)} color="#e74c3c" />
      </View>
    </View>
  );
};

export default TimerItem;
