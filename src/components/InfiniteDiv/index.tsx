import React, { useState, useEffect, useRef, LegacyRef } from "react";
import { useSpring, animated } from '@react-spring/web'
import { useWheel } from '@use-gesture/react'
import SignaturePad from 'signature_pad'
import styles from './index.module.css';

export type InfiniteDivProps = {
  onMoved?: (position: { x: number, y: number }) => void
}

export const InfiniteDiv: React.FC<InfiniteDivProps> = ({ children, onMoved }) => {

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })
  const [signaturePad, setSignaturePad] = useState<SignaturePad>()

  const canvasRef = useRef<any>();

  function resizeCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return

    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    // @ts-ignore
    canvas.getContext("2d").scale(ratio, ratio);
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      window.onresize = resizeCanvas;
      resizeCanvas();

      const signaturePad = new SignaturePad(canvasRef.current);
      setSignaturePad(signaturePad)
    }
  }, [canvasRef])

  useEffect(() => {
    
  }, [currentPosition])

  // 禁止浏览器滑动前进后退
  useEffect(() => {
    document.body.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  }, []);

  const wheelBind = useWheel(({ movement: [mx, my], wheeling, event}) => {
    const { x, y } = currentPosition;

    const _mx = x + -mx;
    const _my = y + -my;
    const newPosition = { x: _mx, y: _my }
    api.start(newPosition)

    if (!wheeling) {
      setCurrentPosition(newPosition)
      if (onMoved) onMoved(newPosition)
    }
  })

  return (
    <animated.div {...wheelBind()} className={styles.infiniteBg} style={{ backgroundPositionX: x, backgroundPositionY: y }}>
      {/* <canvas className='absolute left-0 top-0' ref={canvasRef}></canvas> */}
      <animated.div className={styles.childWarp} style={{ x, y }}>
        {children}
      </animated.div>
    </animated.div>
  );
};
