import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

var totalRotateValue = 0;
export type DialControlProps = {
  dialColor?: string;
  dialOutLineColor?: string;
  dialSize?: number;
  onChange?: (rotateValue: number) => void;
  pointMark?: 'triangle' | 'circle';
  snapToTicks?: boolean;
  tickFontSize?: number;
  tickPosition?: 'inside' | 'outside';
};

export const DialControl: React.FC<DialControlProps> = (
  props: DialControlProps
) => {
  const {
    dialColor = '#aaaaaa',
    dialOutLineColor = '#999999',
    dialSize = 200,
    pointMark = 'triangle',
    snapToTicks = false,
    tickFontSize = 6,
    tickPosition = 'outside',
  } = props;
  const dialBackgroundColor = dialOutLineColor
    ? { backgroundColor: dialOutLineColor }
    : {};

  const dialRef = useRef(null);
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [previousMoveY, setPreviousMoveY] = useState<number | null>(null);
  const [previousMoveX, setPreviousMoveX] = useState<number | null>(null);
  const [componentWidth, setComponentWidth] = useState(0);
  const [componentHeight, setComponentHeight] = useState(0);
  const [componentX, setComponentX] = useState(0);
  const [componentY, setComponentY] = useState(0);
  const tickRadius = (dialSize - 40) / 2; // 目盛りの位置の半径
  const tickLength = 8; // 目盛りの長さ
  const center = dialSize / 2; // 円の中心座標
  const pointSize = 6;

  const onLayout = (event: any) => {
    const { height, width, x, y } = event.nativeEvent.layout;
    setComponentWidth(width);
    setComponentHeight(height);
    setComponentX(x);
    setComponentY(y);
  };

  const panResponder = PanResponder.create({
    onPanResponderMove: (_event, gestureState) => {
      const { moveX, moveY } = gestureState;
      const componetMoveX = moveX - componentX;
      const componetMoveY = moveY - componentY;

      if (previousMoveY !== null && previousMoveX !== null) {
        const diffX = componetMoveX - previousMoveX;
        const diffY = componetMoveY - previousMoveY;

        // 移動開始位置
        let isUpsideAreaStart = previousMoveY < componentHeight / 2;
        let isLeftsideAreaStart = previousMoveX < componentWidth / 2;
        // 移動の向き
        let isMoveRight = diffX > 0;
        let isMoveDown = diffY > 0;
        // 移動量
        const powerX = diffX * diffX;
        const powerY = diffY * diffY;
        const distance = Math.sqrt(powerX + powerY);
        var rotationAmount = distance / 1.15; // 調整可能な移動距離に応じて調整

        // 回転の方向（移動の位置と移動の向きから決定）
        let isRightTurn = true;
        if (isUpsideAreaStart) {
          if (isLeftsideAreaStart) {
            powerX > powerY
              ? (isRightTurn = isMoveRight)
              : (isRightTurn = !isMoveDown);
          } else {
            powerX > powerY
              ? (isRightTurn = isMoveRight)
              : (isRightTurn = isMoveDown);
          }
        } else {
          if (isLeftsideAreaStart) {
            powerX > powerY
              ? (isRightTurn = !isMoveRight)
              : (isRightTurn = !isMoveDown);
          } else {
            powerX > powerY
              ? (isRightTurn = !isMoveRight)
              : (isRightTurn = isMoveDown);
          }
        }

        // 360度を超えたら0に戻す、0度を下回ったら360度足す
        if (isRightTurn) {
          totalRotateValue = totalRotateValue + rotationAmount;
          if (totalRotateValue >= 360) {
            totalRotateValue = totalRotateValue - 360;
          }
        } else {
          totalRotateValue = totalRotateValue - rotationAmount;
          if (totalRotateValue < 0) {
            totalRotateValue = totalRotateValue + 360;
          }
        }

        Animated.timing(rotateValue, {
          duration: 0,
          toValue: snapToTicks
            ? Math.round(totalRotateValue / 10) * 10
            : totalRotateValue,
          useNativeDriver: true,
        }).start();
      }

      setPreviousMoveY(componetMoveY);
      setPreviousMoveX(componetMoveX);
    },

    onPanResponderRelease: () => {
      setPreviousMoveY(null);
      setPreviousMoveX(null);
      props.onChange &&
        props.onChange(
          snapToTicks
            ? Math.round(totalRotateValue / 10) * 10
            : totalRotateValue
        );
    },
    onStartShouldSetPanResponder: () => true,
  });

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [-45, 45],
    outputRange: ['-45deg', '45deg'],
  });

  const animatedStyle = {
    borderRadius: dialSize / 2,
    height: dialSize,
    transform: [{ rotate: rotateInterpolate }],
    width: dialSize,
    ...dialBackgroundColor,
  };

  // 円の外側に目盛りを描画する関数
  const renderTicks = useMemo(() => {
    const ticks = [];
    for (let angle = 0; angle <= 350; angle += 10) {
      const radians = angle * (Math.PI / 180);
      const tickPosValue = tickPosition == 'inside' ? tickLength : -tickLength;
      const x1 = center + tickRadius * Math.cos(radians);
      const y1 = center + tickRadius * Math.sin(radians);
      const x2 = center + (tickRadius - tickPosValue) * Math.cos(radians);
      const y2 = center + (tickRadius - tickPosValue) * Math.sin(radians);
      ticks.push(
        <Line
          key={angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
          strokeWidth={0.5}
        />
      );
    }
    return ticks;
  }, [center, tickPosition, tickRadius]);

  // 目盛りの数値を描画する関数
  const renderTickLabels = useMemo(() => {
    const labels = [];
    const startRadians = 90;
    const tickPosValue =
      tickPosition == 'inside' ? -tickFontSize : tickFontSize + 16;
    for (let angle = 0; angle <= 350; angle += 10) {
      const radians = angle * (Math.PI / 180);
      const x =
        center + (tickRadius - tickLength + tickPosValue) * Math.cos(radians);
      const y =
        center + (tickRadius - tickLength + tickPosValue) * Math.sin(radians);
      labels.push(
        <SvgText
          key={angle}
          x={x}
          y={y + 2}
          fill="black"
          textAnchor="middle"
          fontSize={tickFontSize}
        >
          {(angle + startRadians) % 360}
        </SvgText>
      );
    }
    return labels;
  }, [center, tickFontSize, tickPosition, tickRadius]);

  //const trianglePoints = "100, 20, 105,30 95,30";
  const tipY = center - tickRadius;
  const trianglePoints = `${center}, ${tipY}, ${center + 5},${tipY + 10}  ${
    center - 5
  },${tipY + 10}`;
  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
      onLayout={onLayout}
    >
      <Animated.View ref={dialRef} style={[styles.dial, animatedStyle]}>
        <Svg
          width={dialSize}
          height={dialSize}
          viewBox={`0 0 ${dialSize} ${dialSize}`}
        >
          <Circle cx={center} cy={center} r={tickRadius} fill={dialColor} />
          {pointMark == 'triangle' && (
            <Polygon points={trianglePoints} fill="black" />
          )}
          {pointMark == 'circle' && (
            <Circle cx={center} cy={tipY + 15} r={pointSize} fill="black" />
          )}
        </Svg>
      </Animated.View>
      <Svg
        width={dialSize}
        height={dialSize}
        viewBox={`0 0 ${dialSize} ${dialSize}`}
      >
        <Circle
          cx={center}
          cy={center}
          r={tickRadius}
          fill="none"
          stroke="black"
        />
        {renderTicks}
        {renderTickLabels}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dial: {
    position: 'absolute',
  },
});
