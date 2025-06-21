import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SelectionRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
}

const SelectionRow: React.FC<SelectionRowProps> = ({ icon, label, value, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon name={icon} size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text variant="bodyLarge">{label}</Text>
        {value && <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{value}</Text>}
      </View>
      <Icon name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
});

export default SelectionRow; 