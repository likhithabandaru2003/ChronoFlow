import { StyleSheet } from 'react-native';
  
  export const TimerItemStyles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 10,
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
      },
      timerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
      },
      progressBar: {
        height: 8,
        marginVertical: 10,
        borderRadius: 4,
        backgroundColor: "#e0e0e0",
      },
      buttonContainer: {
        flexDirection: "row", // ✅ Buttons side by side
        justifyContent: "space-between",
        marginTop: 10,
      },
      timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      },
      timeText: {
        fontSize: 14,
        color: "#555",
      },
  });
  