import { StyleSheet } from 'react-native';

export const HomeStyles = StyleSheet.create({
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
      inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginBottom: 15,
        padding: 10,
        fontSize: 16,
      },
      picker: {
        height: 50,
        width: "100%",
        marginBottom: 15,
      },
      addButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6a11cb",
        padding: 15,
        borderRadius: 10,
      },
      addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 10,
      },
      subheading: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
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
      categoryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      categoryHeading: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
      },
      bulkActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
      },
      modalHeading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
      }
});
