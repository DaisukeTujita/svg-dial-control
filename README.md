# svg-dial-control

The DialControl is a component used for manipulating a circular dial in React Native. Below is an overview of its usage and props.

## Installation

```
npm install react-native-svg-dial-control
```

## Usage

Example:

- normal dial

```
import React from 'react';
import { View } from 'react-native';
import { DialControl } from 'react-native-svg-dial-control';

const YourComponent = () => {
  // Define a function to handle rotation change
  const handleRotationChange = (rotateValue) => {
    // Perform actions based on the rotated value
    console.log('Rotated to:', rotateValue);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DialControl
         onChange={handleRotationChange}
        // Additional props as needed
      />
    </View>
  );
};

```

- knob dial

```
import React from "react";
import { View } from "react-native";
import { Circle } from "react-native-svg";
import { DialControl } from "react-native-svg-dial-control";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <DialControl
        onChange={(val) => console.log(val)}
        tickStartAngle={300}
        tickEndAngle={60}
        tickStep={40}
        tickPosition="outside"
        tickLabelList={["OFF", "low", "mid", "high"]}
        motionRange="inTicks"
        motionSpeed={6}
        pointMark="none"
        snapToTicks
        initalRotateValue={300}
      >
        <Circle
          cx="100"
          cy="100"
          r="45"
          fill="#122232"
          style={{ strokeDasharray: "4,4" }}
          stroke="#021622"
          strokeWidth="2"
        />
        <Rect
          x="85"
          y="25"
          width="30"
          height="150"
          rx="5"
          fill="#021622"
          stroke="#021622"
          strokeWidth="1"
        />
        <Circle cx="100" cy="100" r="6" fill="#828282" />
        <Circle cx="100" cy="40" r="3" fill="white" />
      </DialControl>
    </View>
  );
}
```

## Props

The DialControl component accepts the following props:

| Property Name      | Type                             | Description                                       | Default Value |
| ------------------ | -------------------------------- | ------------------------------------------------- | ------------- |
| dialColor          | string                           | Color of the dial                                 | "#aaaaaa"     |
| dialOutLineColor   | string                           | Color of the dial's outer line                    | "#dddddd"     |
| dialSize           | number                           | Size of the dial                                  | 200           |
| onChange           | (rotateValue: number) => void    | Callback triggered on dial value change           | -             |
| onRelease          | (rotateValue: number) => void    | Callback triggered on dial release                | -             |
| pointMark          | "triangle" \| "circle" \| "none" | Shape of the point marker on the dial             | "triangle"    |
| snapToTicks        | boolean                          | Determines if the dial snaps to ticks             | false         |
| tickPosition       | "inside" \| "outside"            | Position of ticks relative to the dial            | "inside"      |
| tickStartAngle     | number                           | Starting angle for ticks                          | 0             |
| tickEndAngle       | number                           | Ending angle for ticks                            | 360           |
| tickStep           | number                           | Step size between ticks                           | 10            |
| tickColor          | string                           | Color of ticks                                    | "#000000"     |
| tickLineLength     | number                           | Length of tick lines                              | 8             |
| tickLabel          | boolean                          | Determines whether to display tick labels         | true          |
| tickLabelList      | string[]                         | List of tick label strings                        | []            |
| tickLabelFontSize  | number                           | Font size of tick labels                          | 6             |
| motionRange        | "inTicks"                        | Controls the motion range of the dial             | -             |
| motionSpeed        | number                           | Speed of dial motion                              | 10            |
| initialRotateValue | number                           | Initial value for the dial's rotation             | 0             |
| children           | ReactNode                        | Additional components or elements within the dial | -             |

Use these props to customize the appearance and behavior of the dial according to your requirements.
