import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAppTheme } from '../context/ThemeContext';

type HeadingProps = {
  title: string;
};

const Heading: React.FC<HeadingProps> = ({ title }) => {
  const theme = useAppTheme();
  return (
    <View>
      <Text style={[styles.subtitle, { color: theme.subtitle }]}>{title}</Text>
    </View>
  );
};

export default Heading;

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
});
