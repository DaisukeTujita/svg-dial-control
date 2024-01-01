# svg-dial-control

The DialControl is a component used for manipulating a circular dial in React Native. Below is an overview of its usage and props.

## Installation

```
npm install your-dial-control-package-name
```

## Usage

Example:

```
import React from 'react';
import { View } from 'react-native';
import { DialControl } from 'your-dial-control-package-name';

const MyComponent = () => {
  const handleRotate = (rotateValue) => {
    // Perform actions on rotation value change
    console.log('Rotated to:', rotateValue);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DialControl
        dialColor="#aaaaaa"
        dialOutLineColor="#999999"
        dialSize={200}
        onChange={handleRotate}
        pointMark="triangle"
        snapToTicks={false}
        tickFontSize={6}
        tickPosition="outside"
      />
    </View>
  );
};

export default MyComponent;
```

## rops

The DialControl component accepts the following props:

- dialColor (string): Color of the dial (default: "#aaaaaa")
- dialOutLineColor (string): Color of the outer line of the dial (default: "#dddddd")
- dialSize (number): Size of the dial (default: 200)
- onChange (function): Callback triggered on dial value change
- onRelease (function): Callback triggered on dial release
- pointMark ("triangle" | "circle"): Shape of the point marker on the dial (default: "triangle")
- snapToTicks (boolean): Whether the dial snaps to ticks (default: false)
- tickPosition ("inside" | "outside"): Position of ticks (default: "inside")
- tickStartAngle (number): Starting angle for ticks (default: 0)
- tickEndAngle (number): Ending angle for ticks (default: 360)
- tickStep (number): Step size between ticks (default: 10)
- tickColor (string): Color of ticks (default: "#000000")
- tickLineLength (number): Length of tick lines (default: 8)
- tickLabel (boolean): Whether to display tick labels (default: true)
- tickLabelList (string[]): List of tick label strings (default: [])
- tickLabelFontSize (number): Font size of tick labels (default: 6)

Use these props to customize the appearance and behavior of the dial according to your requirements.
