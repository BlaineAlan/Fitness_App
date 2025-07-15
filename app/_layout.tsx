import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'


export default function RootLayout() {

  return (
    //SafeAreaProvider keeps the StatusBar just at the top of the screen
    <SafeAreaProvider>
      <StatusBar style="auto"/>
    {/*This gets rid of the 'index' header that was on by default */}
    <Stack screenOptions={{ headerShown: false}} />
    </SafeAreaProvider>
  );
}
