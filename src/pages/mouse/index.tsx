import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react';
import styles from './index.module.css';

function Mouse() {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })

  // Set the drag hook and define component movement based on gesture data.
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    const { x, y } = currentPosition;
    api.start({ x: x + mx, y: y + my })
    if (!down) setCurrentPosition({ x: x + mx, y: y + my })
  })

  // Bind it to a component.
  return <animated.div className={styles.div} {...bind()} style={{ x, y, touchAction: 'none' }} />
}

export default Mouse
