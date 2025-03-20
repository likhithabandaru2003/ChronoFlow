import { StyleSheet } from 'react-native';

export const HistoryStyles = StyleSheet.create({
    container: {
        flex: 1,
      },
      scrollContainer: {
        padding: 20,
      },
      titleContainer: {
        alignItems: "center",
        marginBottom: 20,
      },
      title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        textTransform: "uppercase",
        letterSpacing: 1.5,
      },
      titleUnderline: {
        height: 2,
        width: 50,
        backgroundColor: "#6a11cb",
        marginTop: 5,
      },
      exportButton: {
        backgroundColor: "#6a11cb",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
      },
      exportButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
      categorySection: {
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      tab: {
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        marginBottom: 10,
      },
      categoryHeading: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      },
      timerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      },
      timerText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5,
      }
});
