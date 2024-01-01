import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

var totalRotateValue = 0;
export type DialControlProps = {
  dialColor?: string;
  dialOutLineColor?: string;
  dialSize?: number;
  onChange?: (rotateValue: number) => void;
  onRelease?: (rotateValue: number) => void;
  pointMark?: 'triangle' | 'circle';
  snapToTicks?: boolean;
  tickPosition?: 'inside' | 'outside';
  tickStartAngle?: number;
  tickEndAngle?: number;
  tickStep?: number;
  tickColor?: string;
  tickLineLength?: number;
  tickLabel?: boolean;
  tickLabelList?: string[];
  tickLabelFontSize?: number;
};

export const DialControl: React.FC<DialControlProps> = (
  props: DialControlProps
) => {
  const {
    dialColor = '#aaaaaa',
    dialOutLineColor = '#dddddd',
    dialSize = 200,
    pointMark = 'triangle',
    snapToTicks = false,
    tickPosition = 'inside',
    tickStartAngle = 0,
    tickEndAngle = 360,
    tickStep = 10,
    tickColor = '#000000',
    tickLineLength = 8,
    tickLabel = true,
    tickLabelList = [],
    tickLabelFontSize = 6,
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

        // 回転の方向（移動開始位置と移動の向きから決定）
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
          toValue: calcRotateValue(),
          useNativeDriver: true,
        }).start();

        props.onChange && props.onChange(calcRotateValue());
      }

      setPreviousMoveY(componetMoveY);
      setPreviousMoveX(componetMoveX);
    },

    onPanResponderRelease: () => {
      setPreviousMoveY(null);
      setPreviousMoveX(null);
      props.onRelease && props.onRelease(calcRotateValue());
    },
    onStartShouldSetPanResponder: () => true,
  });

  const calcRotateValue = function () {
    return snapToTicks
      ? Math.round(totalRotateValue / 10) * 10
      : totalRotateValue;
  };
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
    let labelIndex = 0;
    for (let angle = 0; angle < 360; angle += tickStep) {
      if (tickStartAngle < tickEndAngle) {
        if (angle < tickStartAngle || tickEndAngle < angle) continue;
      } else {
        if (!(angle < tickEndAngle || tickStartAngle < angle)) continue;
      }

      const radians = (angle - 90) * (Math.PI / 180);
      const tickLinePosValue =
        tickPosition == 'inside' ? tickLineLength : -tickLineLength;

      // 線
      const x1 = center + tickRadius * Math.cos(radians);
      const y1 = center + tickRadius * Math.sin(radians);
      const x2 = center + (tickRadius - tickLinePosValue) * Math.cos(radians);
      const y2 = center + (tickRadius - tickLinePosValue) * Math.sin(radians);
      ticks.push(
        <Line
          key={'line' + angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth={0.5}
        />
      );

      // ラベル
      if (tickLabel) {
        const tickLabelPosValue =
          tickRadius -
          tickLineLength +
          (tickPosition == 'inside'
            ? -tickLabelFontSize
            : tickLabelFontSize + 16);
        const labelX = center + tickLabelPosValue * Math.cos(radians);
        const labelY = center + tickLabelPosValue * Math.sin(radians) + 2;

        let label = '';
        if (tickLabelList && tickLabelList.length > 0) {
          if (labelIndex < tickLabelList.length) {
            label = tickLabelList[labelIndex] ?? '';
          }
        } else {
          label = `${angle % 360}`;
        }
        ticks.push(
          <SvgText
            key={'label' + angle}
            x={labelX}
            y={labelY}
            fill={tickColor}
            textAnchor="middle"
            fontSize={tickLabelFontSize}
          >
            {label}
          </SvgText>
        );
        labelIndex++;
      }
    }
    return ticks;
  }, [center, tickLabelFontSize, tickPosition, tickRadius]);

  // point位置
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
