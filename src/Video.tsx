import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { BallTrajectoriesComposition } from './BallTrajectoriesComposition';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="BallTrajectories"
        component={BallTrajectoriesComposition}
        durationInFrames={600}
        fps={50}
        width={1400}
        height={1000}
        defaultProps={{
          renderingMode: true
        }}
      />
    </>
  );
};

registerRoot(RemotionVideo); 