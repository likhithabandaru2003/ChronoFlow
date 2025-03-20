import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timer } from "../app/(tabs)/types"; // Replace this path with your actual types
import { useFocusEffect } from "@react-navigation/core"; // Import useFocusEffect
import { LinearGradient } from "expo-linear-gradient"; // For gradient background
import * as FileSystem from "expo-file-system"; // For file system operations
import * as Sharing from "expo-sharing"; // For sharing files
import { HistoryStyles as styles } from '../app/styles/History';

const HistoryScreen = () => {
  const [completedTimers, setCompletedTimers] = useState<Timer[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // Tracks expanded category

  // Function to load completed timers from AsyncStorage
  const loadCompletedTimers = async () => {
    try {
      const savedCompletedTimers = await AsyncStorage.getItem("completedTimers");
      if (savedCompletedTimers) {
        setCompletedTimers(JSON.parse(savedCompletedTimers));
      }
    } catch (error) {
      console.error("Error loading completed timers:", error);
    }
  };

  // Load completed timers on initial mount
  useEffect(() => {
    loadCompletedTimers();
  }, []);

  // Reload the completed timers when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCompletedTimers(); // Reload timers whenever the screen is focused
    }, [])
  );

  // Group the timers by category
  const groupByCategory = () => {
    return completedTimers
      .slice() // Create a copy to avoid mutating state
      .sort(
        (a, b) =>
          new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime()
      ) // Handle potential undefined
      .reduce<Record<string, Timer[]>>((acc, timer) => {
        if (!acc[timer.category]) {
          acc[timer.category] = [];
        }
        acc[timer.category].push(timer);
        return acc;
      }, {});
  };

  const groupedTimers = groupByCategory();

  // Handle expanding or collapsing a category when clicked
  const handleCategoryToggle = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null); // If the category is already expanded, collapse it
    } else {
      setExpandedCategory(category); // Expand the selected category
    }
  };

  // Export timer history as a JSON file
  const exportTimerHistory = async () => {
    try {
      const jsonString = JSON.stringify(completedTimers, null, 2); // Convert timers to JSON string
      const fileUri = FileSystem.documentDirectory + "timer_history.json"; // Define file path

      // Write the JSON string to a file
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json", // Set MIME type for JSON
          dialogTitle: "Export Timer History", // Dialog title
        });
      } else {
        Alert.alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error exporting timer history:", error);
      Alert.alert("Error", "Failed to export timer history.");
    }
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#c3cfe2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Heading */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Completed Timers</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={exportTimerHistory}>
          <Text style={styles.exportButtonText}>Export Timer History</Text>
        </TouchableOpacity>

        {/* Category Sections */}
        {Object.keys(groupedTimers).map((category) => (
          <View key={category} style={styles.categorySection}>
            {/* Tab for Category */}
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleCategoryToggle(category)}
            >
              <Text style={styles.categoryHeading}>
                {category} {expandedCategory === category ? "▲" : "▼"} {/* Arrow icon */}
              </Text>
            </TouchableOpacity>

            {/* Show the timers if the category is expanded */}
            {expandedCategory === category && (
              <FlatList
                data={groupedTimers[category]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.timerItem}>
                    <Text style={styles.timerText}>Name: {item.name}</Text>
                    <Text style={styles.timerText}>Duration: {item.duration}s</Text>
                    <Text style={styles.timerText}>
                      Completed At:{" "}
                      {item.completedAt ? new Date(item.completedAt).toLocaleString() : "N/A"}
                    </Text>
                  </View>
                )}
                scrollEnabled={false} // Disable scrolling for FlatList
              />
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default HistoryScreen;