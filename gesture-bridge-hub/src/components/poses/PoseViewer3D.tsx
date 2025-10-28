import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { Group, Vector3 } from 'three';

// Hand pose data for different ASL signs
const handPoses = {
  'A': {
    name: 'Letter A',
    description: 'Closed fist with thumb to the side',
    joints: [
      // Wrist
      [0, 0, 0],
      // Thumb joints
      [0.3, -0.2, 0.1], [0.5, -0.3, 0.2], [0.6, -0.4, 0.3],
      // Index finger joints
      [0.8, 0.1, 0], [0.9, 0.2, 0], [1.0, 0.3, 0], [1.1, 0.4, 0],
      // Middle finger joints
      [0.8, 0.3, 0], [0.9, 0.4, 0], [1.0, 0.5, 0], [1.1, 0.6, 0],
      // Ring finger joints
      [0.8, 0.5, 0], [0.9, 0.6, 0], [1.0, 0.7, 0], [1.1, 0.8, 0],
      // Pinky joints
      [0.8, 0.7, 0], [0.9, 0.8, 0], [1.0, 0.9, 0], [1.1, 1.0, 0]
    ],
    connections: [
      // Wrist to finger bases
      [0, 4], [0, 8], [0, 12], [0, 16],
      // Thumb chain
      [0, 1], [1, 2], [2, 3],
      // Index finger chain
      [4, 5], [5, 6], [6, 7],
      // Middle finger chain
      [8, 9], [9, 10], [10, 11],
      // Ring finger chain
      [12, 13], [13, 14], [14, 15],
      // Pinky chain
      [16, 17], [17, 18], [18, 19]
    ]
  },
  'Hello': {
    name: 'Hello',
    description: 'Open hand waving motion',
    joints: [
      // Wrist
      [0, 0, 0],
      // Thumb joints
      [0.2, -0.3, 0.2], [0.4, -0.5, 0.4], [0.6, -0.7, 0.6],
      // Index finger joints
      [0.3, 0.8, 0], [0.4, 1.2, 0], [0.5, 1.6, 0], [0.6, 2.0, 0],
      // Middle finger joints
      [0.1, 0.9, 0], [0.1, 1.3, 0], [0.1, 1.7, 0], [0.1, 2.1, 0],
      // Ring finger joints
      [-0.1, 0.8, 0], [-0.2, 1.2, 0], [-0.3, 1.6, 0], [-0.4, 2.0, 0],
      // Pinky joints
      [-0.3, 0.7, 0], [-0.4, 1.1, 0], [-0.5, 1.5, 0], [-0.6, 1.9, 0]
    ],
    connections: [
      // Wrist to finger bases
      [0, 4], [0, 8], [0, 12], [0, 16],
      // Thumb chain
      [0, 1], [1, 2], [2, 3],
      // Index finger chain
      [4, 5], [5, 6], [6, 7],
      // Middle finger chain
      [8, 9], [9, 10], [10, 11],
      // Ring finger chain
      [12, 13], [13, 14], [14, 15],
      // Pinky chain
      [16, 17], [17, 18], [18, 19]
    ]
  },
  'ThankYou': {
    name: 'Thank You',
    description: 'Flat hand moving from chin forward',
    joints: [
      // Wrist
      [0, 0, 0],
      // Thumb joints
      [0.4, -0.2, 0.1], [0.7, -0.3, 0.2], [1.0, -0.4, 0.3],
      // Index finger joints
      [0.3, 0.8, 0], [0.4, 1.2, 0], [0.5, 1.6, 0], [0.6, 2.0, 0],
      // Middle finger joints
      [0.1, 0.9, 0], [0.1, 1.3, 0], [0.1, 1.7, 0], [0.1, 2.1, 0],
      // Ring finger joints
      [-0.1, 0.8, 0], [-0.2, 1.2, 0], [-0.3, 1.6, 0], [-0.4, 2.0, 0],
      // Pinky joints
      [-0.3, 0.7, 0], [-0.4, 1.1, 0], [-0.5, 1.5, 0], [-0.6, 1.9, 0]
    ],
    connections: [
      // Wrist to finger bases
      [0, 4], [0, 8], [0, 12], [0, 16],
      // Thumb chain
      [0, 1], [1, 2], [2, 3],
      // Index finger chain
      [4, 5], [5, 6], [6, 7],
      // Middle finger chain
      [8, 9], [9, 10], [10, 11],
      // Ring finger chain
      [12, 13], [13, 14], [14, 15],
      // Pinky chain
      [16, 17], [17, 18], [18, 19]
    ]
  }
};

interface HandModelProps {
  pose: keyof typeof handPoses;
  animate?: boolean;
}

const HandModel = ({ pose, animate = true }: HandModelProps) => {
  const groupRef = useRef<Group>(null);
  const [time, setTime] = useState(0);
  
  useFrame((state, delta) => {
    setTime(time + delta);
    if (groupRef.current && animate) {
      // Gentle rotation animation
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  const currentPose = handPoses[pose];
  
  return (
    <group ref={groupRef}>
      {/* Draw joints */}
      {currentPose.joints.map((joint, index) => (
        <Sphere key={`joint-${index}`} position={joint as [number, number, number]} args={[0.05]}>
          <meshStandardMaterial color={index === 0 ? "#ff6b6b" : "#4ecdc4"} />
        </Sphere>
      ))}
      
      {/* Draw connections */}
      {currentPose.connections.map((connection, index) => {
        const startJoint = currentPose.joints[connection[0]];
        const endJoint = currentPose.joints[connection[1]];
        const points = [
          new Vector3(startJoint[0], startJoint[1], startJoint[2]),
          new Vector3(endJoint[0], endJoint[1], endJoint[2])
        ];
        
        return (
          <Line
            key={`connection-${index}`}
            points={points}
            color="#45b7d1"
            lineWidth={3}
          />
        );
      })}
      
      {/* Sign name label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {currentPose.name}
      </Text>
      
      {/* Description label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.15}
        color="#666"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {currentPose.description}
      </Text>
    </group>
  );
};

interface PoseViewer3DProps {
  selectedSign?: string;
  showControls?: boolean;
}

export const PoseViewer3D = ({ selectedSign, showControls = true }: PoseViewer3DProps) => {
  const [currentPose, setCurrentPose] = useState<keyof typeof handPoses>('Hello');
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    if (selectedSign && selectedSign in handPoses) {
      setCurrentPose(selectedSign as keyof typeof handPoses);
    }
  }, [selectedSign]);
  
  const poseKeys = Object.keys(handPoses) as (keyof typeof handPoses)[];
  
  return (
    <div className="space-y-4">
      <div className="h-80 w-full rounded-lg border bg-card overflow-hidden">
        <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <pointLight position={[-5, 5, 5]} intensity={0.4} />
          
          <HandModel pose={currentPose} animate={isAnimating} />
          
          <OrbitControls 
            enablePan={false} 
            minDistance={2} 
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Canvas>
      </div>
      
      {showControls && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {poseKeys.map((poseKey) => (
              <button
                key={poseKey}
                onClick={() => setCurrentPose(poseKey)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPose === poseKey
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {handPoses[poseKey].name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAnimating}
                onChange={(e) => setIsAnimating(e.target.checked)}
                className="rounded"
              />
              Animate rotation
            </label>
            
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Click and drag to rotate • Scroll to zoom
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
