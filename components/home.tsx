import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import TimerItem from "@/components/TimerItem";
import { Timer, TimerStatus } from "../app/(tabs)/types";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HomeStyles as styles } from '../app/styles/Home';

const HomeScreen = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [completedTimers, setCompletedTimers] = useState<Timer[]>([]);
  const [duration, setDuration] = useState("");
  const [durationUnit, setDurationUnit] = useState<"seconds" | "minutes" | "hours">("seconds");
  const [category, setCategory] = useState("Work");
  const [customCategory, setCustomCategory] = useState("");
  const [timerName, setTimerName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false); // For completion modal
  const [completedTimerDetails, setCompletedTimerDetails] = useState<Timer | null>(null); // For completion modal
  const [showHalfwayModal, setShowHalfwayModal] = useState(false); // For halfway modal
  const [halfwayTimerDetails, setHalfwayTimerDetails] = useState<Timer | null>(null); // For halfway modal

  // Convert duration to seconds
  const convertToSeconds = (value: number, unit: string): number => {
    switch (unit) {
      case "minutes": return value * 60;
      case "hours": return value * 3600;
      default: return value;
    }
  };

  // Save timers to AsyncStorage
  const saveTimersToStorage = async (activeTimers: Timer[], completed: Timer[]) => {
    try {
      await AsyncStorage.setItem("timers", JSON.stringify(activeTimers));
      await AsyncStorage.setItem("completedTimers", JSON.stringify(completed));
    } catch (error) {
      console.error("Error saving timers:", error);
    }
  };

  // Pause/Resume a timer
  const handlePauseResumeTimer = async (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              status: timer.status === TimerStatus.Running ? TimerStatus.Paused : TimerStatus.Running,
            }
          : timer
      )
    );
  };

  // Reset a timer
  const handleResetTimer = async (id: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, remaining: timer.duration, status: TimerStatus.Paused } : timer
      )
    );
  };

  // Load timers from AsyncStorage on mount
  useEffect(() => {
    const loadTimersFromStorage = async () => {
      try {
        const savedTimers = await AsyncStorage.getItem("timers");
        const savedCompletedTimers = await AsyncStorage.getItem("completedTimers");

        if (savedTimers) setTimers(JSON.parse(savedTimers));

        if (savedCompletedTimers) {
          const parsedCompletedTimers = JSON.parse(savedCompletedTimers).map((t: Timer) => ({
            ...t,
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          }));
          setCompletedTimers(parsedCompletedTimers);
        }
      } catch (error) {
        console.error("Error loading timers:", error);
      }
    };

    loadTimersFromStorage();
  }, []);

  // Add a new timer
  const handleAddTimer = async () => {
    if (!duration || !timerName) {
      Alert.alert("Error", "Please enter a duration and timer name.");
      return;
    }

    const newTimer: Timer = {
      id: uuidv4(),
      name: timerName,
      duration: convertToSeconds(Number(duration), durationUnit),
      remaining: convertToSeconds(Number(duration), durationUnit),
      status: TimerStatus.Running,
      category: customCategory || category, // Use custom category if provided
    };

    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    await saveTimersToStorage(updatedTimers, completedTimers);

    setDuration("");
    setTimerName("");
    setCustomCategory(""); // Reset custom category input
  };

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        let updatedTimers = prevTimers.map((timer) => {
          if (timer.status === TimerStatus.Running && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1;

            // Check if the timer has reached halfway
            if (newRemaining === Math.floor(timer.duration / 2)) {
              setHalfwayTimerDetails(timer);
              setShowHalfwayModal(true);
            }

            return { ...timer, remaining: newRemaining };
          }
          return timer;
        });

        const newlyCompletedTimers = updatedTimers.filter(
          (timer) => timer.status === TimerStatus.Running && timer.remaining === 0
        );

        if (newlyCompletedTimers.length > 0) {
          const completedNow = newlyCompletedTimers.map((t) => ({
            ...t,
            status: TimerStatus.Completed,
            completedAt: new Date().toISOString(),
          }));

          setCompletedTimers((prevCompleted) => {
            const updatedCompleted = [...prevCompleted, ...completedNow];
            saveTimersToStorage(
              updatedTimers.filter((t) => t.remaining > 0),
              updatedCompleted
            );
            return updatedCompleted;
          });

          // Show the completion modal for the first completed timer
          setCompletedTimerDetails(completedNow[0]);
          setShowCompletionModal(true);

          updatedTimers = updatedTimers.filter((t) => t.remaining > 0);
        }

        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Group timers by category
  const groupTimersByCategory = () => {
    return timers.reduce<Record<string, Timer[]>>((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {});
  };

  // Handle bulk actions
  const handleBulkAction = (action: "start" | "pause" | "reset", category: string) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.category === category
          ? {
              ...timer,
              status:
                action === "start"
                  ? TimerStatus.Running
                  : action === "pause"
                  ? TimerStatus.Paused
                  : TimerStatus.Paused,
              remaining: action === "reset" ? timer.duration : timer.remaining,
            }
          : timer
      )
    );
  };

  // Toggle expanded/collapsed state for a category
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Render a category section
  const renderCategorySection = (category: string, timers: Timer[]) => {
    const isExpanded = expandedCategories[category];

    return (
      <View key={category} style={styles.categorySection}>
        <TouchableOpacity onPress={() => toggleCategory(category)} style={styles.categoryHeader}>
          <Text style={styles.categoryHeading}>{category}</Text>
          <MaterialIcons
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {/* Only show the bulk action buttons if the category is expanded */}
        {isExpanded && (
          <View style={styles.bulkActions}>
            <Button title="Start All" onPress={() => handleBulkAction("start", category)} />
            <Button title="Pause All" onPress={() => handleBulkAction("pause", category)} />
            <Button title="Reset All" onPress={() => handleBulkAction("reset", category)} />
          </View>
        )}

        {isExpanded && (
          <FlatList
            data={timers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TimerItem timer={item} onPause={handlePauseResumeTimer} onReset={handleResetTimer} />
            )}
            scrollEnabled={false} 
          />
        )}
      </View>
    );
  };

  const groupedTimers = groupTimersByCategory();

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Add Timer Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add Timer</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Timer Name"
            placeholderTextColor="#999"
            value={timerName}
            onChangeText={setTimerName}
            style={styles.input}
          />
          <TextInput
            placeholder="Duration"
            placeholderTextColor="#999"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.input}
          />
          <Picker
            selectedValue={durationUnit}
            onValueChange={(itemValue) => setDurationUnit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seconds" value="seconds" />
            <Picker.Item label="Minutes" value="minutes" />
            <Picker.Item label="Hours" value="hours" />
          </Picker>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Exercise" value="Exercise" />
            <Picker.Item label="Study" value="Study" />
            <Picker.Item label="Custom" value="Custom" />
          </Picker>
          {category === "Custom" && (
            <TextInput
              placeholder="Enter Custom Category"
              placeholderTextColor="#999"
              value={customCategory}
              onChangeText={setCustomCategory}
              style={styles.input}
            />
          )}
          <TouchableOpacity style={styles.addButton} onPress={handleAddTimer}>
            <Text style={styles.addButtonText}>Add Timer</Text>
            <FontAwesome name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Active Timers Section */}
        <Text style={styles.subheading}>Active Timers</Text>
        {Object.entries(groupedTimers).map(([category, timers]) =>
          renderCategorySection(category, timers)
        )}
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Congratulations!</Text>
            <Text style={styles.modalText}>
              Your timer "{completedTimerDetails?.name}" for "{completedTimerDetails?.category}" has completed.
            </Text>
            <Button title="Close" onPress={() => setShowCompletionModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Halfway Modal */}
      <Modal
        visible={showHalfwayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHalfwayModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Halfway There!</Text>
            <Text style={styles.modalText}>
              Your timer "{halfwayTimerDetails?.name}" for "{halfwayTimerDetails?.category}" is halfway done.
            </Text>
            <Button title="Close" onPress={() => setShowHalfwayModal(false)} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default HomeScreen;