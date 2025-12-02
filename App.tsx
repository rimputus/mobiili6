import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [ean, setEan] = useState(null);
  const [paused, setPaused] = useState(false);

  const onBarcodeScanned = useCallback((result: any) => {
    if (paused) return;
    if (!result || !result.data) return;

    setEan(result.data);
    setPaused(true);
  }, [paused]);

  const handleScanAgain = () => {
    setEan(null);
    setPaused(false);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission needed</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8"] }}
        onBarcodeScanned={onBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>Barcode reader</Text>

        <View style={styles.resultBox}>
          {ean ? (
            <>
              <Text style={styles.resultLabel}>Scanned code: {ean}</Text>
              <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.resultLabel}>Scan a barcode…</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { position: "absolute", bottom: 40, width: "100%", alignItems: "center" },
  title: { color: "white", fontSize: 20, marginBottom: 10 },
  resultBox: { marginTop: 10, alignItems: "center" },
  resultLabel: { color: "white", fontSize: 18, marginTop: 8 },
  scanAgainButton: { marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 16 },
});