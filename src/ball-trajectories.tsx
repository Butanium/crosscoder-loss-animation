import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useCurrentFrame } from 'remotion';

interface TrailPoint {
  x: number;
  y: number;
}

const BallTrajectories = () => {
  const gridSize = 100;
  const startPoint = { x: 40, y: 80 };

  // Calculate positions based on gradient descent
  const calculatePosition = (t, gradientFn) => {
    let pos = { ...startPoint };
    const stepSize = 1;
    const steps = Math.floor(t * 3);
    let prevPos = { ...pos }; // Store previous position

    for (let i = 0; i < steps; i++) {
      const [dx, dy] = gradientFn(pos.x, pos.y);
      // Store current position before update
      prevPos = { ...pos };

      // Update position
      pos.x = Math.max(0, Math.min(gridSize, pos.x + stepSize * dx));
      pos.y = Math.max(0, Math.min(gridSize, pos.y + stepSize * dy));

      // If we're moving backwards or barely moving, stop
      const moveX = pos.x - prevPos.x;
      const moveY = pos.y - prevPos.y;
      const movement = Math.sqrt(moveX * moveX + moveY * moveY);

      // if (movement < 0.01 || pos.x < 0.001 || pos.y < 0.001) {
      //   // pos = prevPos; // Revert to last good position
      //   break;
      // }
    }

    return pos;
  };

  // Gradient functions
  const leftBallGradient = (x, y) => {
    const eps = 0.0001;
    const gradX = -1 / (2 * Math.sqrt(Math.max(eps, x)));
    const gradY = -1 / (2 * Math.sqrt(Math.max(eps, y)));
    // Normalize gradient vector
    return [gradX, gradY];
  };

  const rightBallGradient = (x, y) => {
    const eps = 0.0001;
    const sum = Math.max(eps, x + y);
    const grad = -1 / (2 * Math.sqrt(sum));
    // Return normalized gradient
    return [grad, grad];
  };

  // Replace useState/useEffect with Remotion's frame-based animation
  const frame = useCurrentFrame();
  const time = frame / 1.5;

  const [leftTrail, rightTrail] = React.useMemo(() => {
    const leftTrailData: TrailPoint[] = [];
    const rightTrailData: TrailPoint[] = [];

    // Calculate trail up to current time with larger steps to reduce flickering
    for (let t = 0; t <= time; t += 1) {
      const leftPos = calculatePosition(t, leftBallGradient);
      const rightPos = calculatePosition(t, rightBallGradient);

      leftTrailData.push({ x: leftPos.x, y: leftPos.y });
      rightTrailData.push({ x: rightPos.x, y: rightPos.y });

      // // Stop if both balls have reached near zero
      // if ((leftPos.x < 0.1 || leftPos.y < 0.1) &&
      //   (rightPos.x < 0.1 || rightPos.y < 0.1)) {
      //   // Add a few more frames at the final position
      //   for (let i = 0; i < 5; i++) {
      //     leftTrailData.push({ x: leftPos.x, y: leftPos.y });
      //     rightTrailData.push({ x: rightPos.x, y: rightPos.y });
      //   }
      //   break;
      // }
    }

    return [leftTrailData, rightTrailData];
  }, [time]);

  // Get current ball positions
  const currentLeftBall = leftTrail[leftTrail.length - 1] || startPoint;
  const currentRightBall = rightTrail[rightTrail.length - 1] || startPoint;

  // Format data for Recharts
  const ballData = [
    { x: currentLeftBall.x, y: currentLeftBall.y, type: 'left' },
    { x: currentRightBall.x, y: currentRightBall.y, type: 'right' }
  ];

  const leftTrailData = [{ x: startPoint.x, y: startPoint.y }, ...leftTrail];
  const rightTrailData = [{ x: startPoint.x, y: startPoint.y }, ...rightTrail];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <ScatterChart
        width={600}
        height={400}
        margin={{ top: 20, right: 50, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          label={{ value: 'Base decoder norm', position: 'bottom' }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          label={{
            value: 'Chat decoder norm',
            angle: -90,
            position: 'insideLeft',
            style: {
              textAnchor: 'middle'
            }
          }}
        />

        {/* Trails */}
        <Scatter
          name="Left Ball Trail"
          data={leftTrailData}
          line={{ stroke: '#e63946', strokeWidth: 1 }}
          shape={() => null}
          legendType="none"
        />
        <Scatter
          name="Right Ball Trail"
          data={rightTrailData}
          line={{ stroke: '#2a9d8f', strokeWidth: 1 }}
          shape={() => null}
          legendType="none"
        />

        {/* Starting point */}
        <Scatter
          data={[startPoint]}
          fill="#666"
          shape="circle"
        />

        {/* Balls with labels */}
        <Scatter
          data={ballData}
          shape={(props) => {
            const { cx, cy, payload } = props;
            const color = payload.type === 'left' ? '#e63946' : '#2a9d8f';
            return (
              <g>
                <circle cx={cx} cy={cy} r={6} fill={color} />
                <text
                  x={cx + 10}
                  y={cy - 10}
                  fill="#000"
                  fontSize={12}
                  fontWeight="bold"
                >
                  ({payload.x.toFixed(1)}, {payload.y.toFixed(1)})
                </text>
              </g>
            );
          }}
        />
      </ScatterChart>

      <div className="mt-4 text-sm text-gray-600 space-y-2 p-4">
        <div className="flex items-center gap-3">
          <svg width="16" height="16" className="inline-block flex-shrink-0" style={{ transform: 'translateY(1px)' }}>
            <circle cx="8" cy="8" r="6" fill="#e63946" />
          </svg>
          <span className="leading-none">minimizing √x + √y</span>
        </div>
        <div className="flex items-center gap-3">
          <svg width="16" height="16" className="inline-block flex-shrink-0" style={{ transform: 'translateY(1px)' }}>
            <circle cx="8" cy="8" r="6" fill="#2a9d8f" />
          </svg>
          <span className="leading-none">minimizing √(x + y)</span>
        </div>
      </div>
    </div>
  );
};

export default BallTrajectories;