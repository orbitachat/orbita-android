import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, BackHandler, Platform, PermissionsAndroid, StatusBar, NativeModules } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

export default function AppNative() {
  const webViewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    async function requestAndroidPermissions() {
      if (Platform.OS === 'android') {
        try {
          const perms: any[] = [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ];
          if (Platform.Version >= 33) {
            perms.push('android.permission.POST_NOTIFICATIONS');
          }
          await PermissionsAndroid.requestMultiple(perms);
        } catch {}
      }
    }
    requestAndroidPermissions();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          "if (typeof window.__handleOrbitaBack === 'function') { const h = window.__handleOrbitaBack(); if (!h && window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'EXIT_APP' })); } } else { window.dispatchEvent(new CustomEvent('orbita_back_pressed')); } true;"
        );
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'EXIT_APP') {
        BackHandler.exitApp();
      } else if (data?.type === 'NOTIFICATION') {
        NativeModules.OrbitaNotificationModule?.showNotification(
          data.title || 'Orbita',
          data.body || '',
          data.chatId || ''
        );
      } else if (data?.type === 'INCOMING_CALL') {
        NativeModules.OrbitaNotificationModule?.showCallNotification(
          data.callerName || '',
          data.chatId || ''
        );
      } else if (data?.type === 'CLEAR_CALL') {
        NativeModules.OrbitaNotificationModule?.clearCallNotification();
      } else if (data?.type === 'CLEAR_NOTIFICATIONS') {
        NativeModules.OrbitaNotificationModule?.clearNotifications();
      }
    } catch {}
  };

  const webAppUri = 'file:///android_asset/web/index.html';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121214" translucent={false} />
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
        onMessage={handleMessage}
        onNavigationStateChange={(navState: WebViewNavigation) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
  },
  webview: {
    flex: 1,
    backgroundColor: '#121214',
  },
});
