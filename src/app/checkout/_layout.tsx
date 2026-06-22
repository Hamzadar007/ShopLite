import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Shipping Address' }} />
      <Stack.Screen name="summary" options={{ title: 'Order Summary' }} />
      <Stack.Screen
        name="confirmation"
        options={{
          headerBackVisible: false,
          title: 'Order Confirmed',
        }}
      />
    </Stack>
  );
}
