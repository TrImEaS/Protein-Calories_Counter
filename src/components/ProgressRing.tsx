import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  value: number;
  maxValue: number;
  radius?: number;
  strokeWidth?: number;
  activeColor?: string;
  inactiveColor?: string;
  title?: string;
  titleColor?: string;
  valueColor?: string;
}

export default function ProgressRing({
  value,
  maxValue,
  radius = 60,
  strokeWidth = 12,
  activeColor = '#f97316',
  inactiveColor = '#e4e4e7',
  title = '',
  titleColor = '#52525b',
  valueColor = '#000',
}: ProgressRingProps) {
  const normalizedValue = Math.min(value, maxValue);
  const circumference = 2 * Math.PI * radius;
  const progress = maxValue > 0 ? (normalizedValue / maxValue) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const size = (radius + strokeWidth) * 2;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={inactiveColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        {/* Center text */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: valueColor }}>{Math.round(value)}</Text>
          {title ? <Text style={{ fontSize: 10, color: titleColor, fontWeight: 'bold' }}>{title}</Text> : null}
        </View>
      </View>
    </View>
  );
}
