import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, BackHandler, Platform, PermissionsAndroid, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AppNative() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    async function requestAndroidPermissions() {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
          ]);
        } catch {}
      }
    }
    requestAndroidPermissions();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  const webAppUri = 'file:///android_asset/web/index.html';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" />
      <WebView
        ref={webViewRef}
        source={{ uri: webAppUri }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mediaCapturePermissionGrantType="grant"
        androidLayerType="hardware"
        mixedContentMode="always"
        textZoom={100}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        setSupportMultipleWindows={false}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#121214',
  },
});
