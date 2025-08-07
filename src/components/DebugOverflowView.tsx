// components/DebugOverflowView.tsx
import React, { useState } from 'react';
import {
  View,
  ViewProps,
  Text,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';

const isDev = __DEV__;

const DebugOverflowView = ({ children, style, ...rest }: ViewProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [layoutWidth, setLayoutWidth] = useState(0);

  const handleLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    setLayoutWidth(width);
  };

  const overflow = layoutWidth > screenWidth;

  return (
    <View
      onLayout={handleLayout}
      style={[style, overflow && isDev && styles.debugBorder]}
      {...rest}>
      {children}
      {overflow && isDev && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠️ Overflowed by {Math.ceil(layoutWidth - screenWidth)} px
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  debugBorder: {
    borderColor: 'orange',
    borderWidth: 1,
  },
  warning: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'black',
    padding: 2,
  },
  warningText: {
    fontSize: 10,
    color: 'yellow',
  },
});

export default DebugOverflowView;
