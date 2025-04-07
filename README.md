# Gradient Descent on Crosscoder Sparsity Loss Ball Animation

This project visualizes gradient descent optimization using animated ball trajectories. The animation shows how different balls follow gradient paths to find local minima, created using React and Remotion.

## Features

- Interactive visualization of gradient descent paths
- Multiple ball trajectories showing different optimization paths
- Smooth animation using Remotion
- Visualization using Recharts for the coordinate system

## Demo

https://github.com/user-attachments/assets/c89f7797-4d9b-440f-a831-cbfca91621ee


## Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Butanium/crosscoder-loss-animation
cd cc-loss-animation
```

2. Install dependencies:
```bash
npm install
```

## Exporting to mp4 from CLI

To render the animation, use the following command:

```bash
npx remotion render src/Video.tsx BallTrajectories out/output.mp4 --concurrency=1
```

Note: We currently need to use `--concurrency=1` due to crappy cursor-claude code.


## Preview and web editor

To start the web editor:

```bash
npx remotion preview src/Video.tsx BallTrajectories 
```

Note that if you want export using the UI, you'll need to go to advanced settings and set the concurrency to 1.

## Technologies Used

- React
- Remotion
- Recharts
- TypeScript
