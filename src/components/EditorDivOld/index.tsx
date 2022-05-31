import * as React from "react";
import Draggable, { DraggableProps } from 'react-draggable';
import styles from './index.module.css';

export type EditorDivProps = {
  drag: Partial<DraggableProps>
  rotate?: {
    x: number
    y: number
    z: number
  }
}

export const EditorDiv: React.FC<EditorDivProps> = ({ drag, rotate = { x: 0, y: 0, z: 0 }, children }) => {
  return (
    <Draggable {...drag} handle={styles.handle}>
      <div className={styles.handle} style={{ transform: `rotate(${rotate.x}deg, ${rotate.y}deg, ${rotate.z}deg)` }}>
        {children}
      </div>
    </Draggable>
  );
};
