import React from 'react';
import BallTrajectories from './ball-trajectories';

interface Props {
  renderingMode?: boolean;
  gridSize?: number;
  pixelsPerUnit?: number;
}

export const BallTrajectoriesComposition: React.FC<Props> = ({ 
  renderingMode = false,
  gridSize = 100,
  pixelsPerUnit = 16
}) => {
  // Calculate the optimal scale based on the pixel density
  const scale = renderingMode ? (pixelsPerUnit / 8) : 1; // Base scale on pixels per unit, normalized to a reasonable viewing size

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      position: 'relative',
      padding: '5%' // Add some padding to prevent edge cutoff
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}>
        <BallTrajectories gridSize={gridSize} />
      </div>
    </div>
  );
}; 