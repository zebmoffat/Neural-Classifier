import { useState, useEffect, useRef } from 'react';

const EdgeSquares = () => {
  const [squares, setSquares] = useState([
    { id: 1, x: 0, y: 0, trail: [] },
    { id: 2, x: 0, y: 0, trail: [] }
  ]);
  
  const startTimeRef = useRef(Date.now());
  const trailLength = 50;
  const duration = 17500; // 17.5 seconds around

  const getPosition = (progress, startCorner) => {
    const w = window.innerWidth - 10;
    const h = window.innerHeight - 10;
    
    // Calculate perimeter and edge lengths
    const perimeter = 2 * w + 2 * h;
    const topEdge = w;
    const rightEdge = h;
    const bottomEdge = w;
    
    // Convert progress (0-1) to distance along perimeter
    const distance = (progress % 1) * perimeter;
    
    let x, y;
    
    if (startCorner === 'topLeft') {
      if (distance < topEdge) {
        // Top edge: left to right
        x = distance;
        y = 0;
      } else if (distance < topEdge + rightEdge) {
        // Right edge: top to bottom
        x = w;
        y = distance - topEdge;
      } else if (distance < topEdge + rightEdge + bottomEdge) {
        // Bottom edge: right to left
        x = w - (distance - topEdge - rightEdge);
        y = h;
      } else {
        // Left edge: bottom to top
        x = 0;
        y = h - (distance - topEdge - rightEdge - bottomEdge);
      }
    } else {
      // Start at bottom-right
      const offset = topEdge + rightEdge; // Start halfway around
      const offsetDistance = (distance + offset) % perimeter;
      
      if (offsetDistance < topEdge) {
        x = offsetDistance;
        y = 0;
      } else if (offsetDistance < topEdge + rightEdge) {
        x = w;
        y = offsetDistance - topEdge;
      } else if (offsetDistance < topEdge + rightEdge + bottomEdge) {
        x = w - (offsetDistance - topEdge - rightEdge);
        y = h;
      } else {
        x = 0;
        y = h - (offsetDistance - topEdge - rightEdge - bottomEdge);
      }
    }
    
    return { x, y };
  };

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      
      setSquares(prev => {
        const square1Pos = getPosition(progress, 'topLeft');
        const square2Pos = getPosition(progress, 'bottomRight');
        
        return [
          {
            id: 1,
            x: square1Pos.x,
            y: square1Pos.y,
            trail: [square1Pos, ...prev[0].trail.slice(0, trailLength - 1)]
          },
          {
            id: 2,
            x: square2Pos.x,
            y: square2Pos.y,
            trail: [square2Pos, ...prev[1].trail.slice(0, trailLength - 1)]
          }
        ];
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      background: '#000',
      zIndex: -1
    }}>
      {squares.map(square => (
        <div key={square.id}>
          {/* Trail squares with gradient */}
          {square.trail.map((pos, i) => {
            const opacity = Math.pow(1 - (i / trailLength), 2);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  background: 'white',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  opacity: opacity,
                  filter: `blur(${i * 0.1}px)`
                }}
              />
            );
          })}
          {/* Main square */}
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              background: 'white',
              left: `${square.x}px`,
              top: `${square.y}px`,
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default EdgeSquares;