import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react';
import classnames from 'classnames';
import { ReloadOutlined } from '@ant-design/icons';
import styles from './index.module.css';

export type EditorDivProps = {
  className?: string
  active?: boolean
  x?: number
  y?: number
  width: number
  height: number
  style?: React.CSSProperties
}

export const EditorDiv: React.FC<EditorDivProps> = ({ children, className, width, height, x, y, style }) => {
  const [position, positionApi] = useSpring(() => ({ x: x || 0, y: y || 0, scale: 1 }))
  const [size, sizeApi] = useSpring(() => ({ width, height }))
  const [{ angle }, angleApi] = useSpring(() => ({ angle: 0 }))

  // 是否在旋转中
  const [disableMove, setDisableMove] = useState(false)
  const changeDisableMove = (down: boolean, handler: () => void) => {
    if (down && disableMove === false) setDisableMove(true)
    if (!down) {
      setDisableMove(false)
      handler()
    }
  }

  const [currentSize, setCurrentSize] = useState({ width, height })
  const [currentPosition, setCurrentPosition] = useState({ x: x || 0, y: y || 0 })
  const [currentAngle, setCurrentAngle] = useState({ angle: 0 })

  // 拖动
  const moveBind = useDrag(({ down, movement: [mx, my] }) => {
    // 旋转中禁止位移
    if (disableMove) return

    const { x, y } = currentPosition;
    positionApi.start({ x: x + mx, y: y + my, scale: down ? 0.95 : 1 })
    if (!down) setCurrentPosition({ x: x + mx, y: y + my })
  })

  // 旋转
  const rotateBind = useDrag(({ down, movement: [mx, my] }) => {
    const { angle } = currentAngle;
    const newAngle = { angle: angle + mx / 2 }
    angleApi.start(newAngle)

    // 禁用移动
    changeDisableMove(down, () => setCurrentAngle(newAngle))
  })

  // 拉伸
  const rightBind = useDrag(({ down, movement: [mx] }) => rightHandler(down, mx))
  const leftBind = useDrag(({ down, movement: [mx] }) => leftHandler(down, mx))
  const bottomBind = useDrag(({ down, movement: [mx, my] }) => bottomHandler(down, my))
  const topBind = useDrag(({ down, movement: [mx, my] }) => topHandler(down, my))

  function rightHandler(down: boolean, mx: number) {
    const { width, height } = currentSize;

    const newSize = { width: width + mx, height }
    sizeApi.start(newSize)

    // 禁用移动
    changeDisableMove(down, () => setCurrentSize(newSize))
  }
  function bottomHandler(down: boolean, my: number) {
    const { width, height } = currentSize;
    
    const newSize = { width: width, height: height + my }
    sizeApi.start(newSize)

    // 禁用移动
    changeDisableMove(down, () => setCurrentSize(newSize))
  }
  function leftHandler(down: boolean, mx: number) {
    const { width, height } = currentSize
    const { x, y } = currentPosition;

    const newSize = { width: width - mx, height }
    const newPosition = { x: x + mx, y }

    sizeApi.start(newSize)
    positionApi.start(newPosition)

    // 禁用移动
    changeDisableMove(down, () => {
      setCurrentSize(newSize)
      setCurrentPosition(newPosition)
    })
  }
  function topHandler(down: boolean, my: number) {
    const { width, height } = currentSize
    const { x, y } = currentPosition;

    const newSize = { width, height: height - my }
    const newPosition = { x, y: y + my }

    sizeApi.start(newSize)
    positionApi.start(newPosition)

    // 禁用移动
    changeDisableMove(down, () => {
      setCurrentSize(newSize)
      setCurrentPosition(newPosition)
    })
  }

  const topLeftBind = useDrag(({ down, movement: [mx, my] }) => topLeftHandler(down, mx, my))
  const topRightBind = useDrag(({ down, movement: [mx, my] }) => topRightHandler(down, mx, my))
  const bottomLeftBind = useDrag(({ down, movement: [mx, my] }) => bottomLeftHandler(down, mx, my))
  const bottomRightBind = useDrag(({ down, movement: [mx, my] }) => bottomRightHandler(down, mx, my))

  function topLeftHandler(down: boolean, mx: number, my: number) {
    const { width, height } = currentSize;
    const { x, y } = currentPosition;
    
    const newSize = { width: width - mx, height: height - my }
    const newPosition = { x: x + mx, y: y + my }

    sizeApi.start(newSize)
    positionApi.start(newPosition)

    // 禁用移动
    changeDisableMove(down, () => {
      setCurrentSize(newSize)
      setCurrentPosition(newPosition)
    })
  }
  function topRightHandler(down: boolean, mx: number, my: number) {
    const { width, height } = currentSize;
    const { x, y } = currentPosition;
    
    const newSize = { width: width + mx, height: height - my }
    const newPosition = { x, y: y + my }

    sizeApi.start(newSize)
    positionApi.start(newPosition)

    // 禁用移动
    changeDisableMove(down, () => {
      setCurrentSize(newSize)
      setCurrentPosition(newPosition)
    })
  }
  function bottomRightHandler(down: boolean, mx: number, my: number) {
    const { width, height } = currentSize;
    
    const newSize = { width: width + mx, height: height + my }
    sizeApi.start(newSize)

    // 禁用移动
    changeDisableMove(down, () => setCurrentSize(newSize))
  }
  function bottomLeftHandler(down: boolean, mx: number, my: number) {
    const { width, height } = currentSize;
    const { x, y } = currentPosition;
    
    const newSize = { width: width - mx, height: height + my }
    const newPosition = { x: x + mx, y }

    sizeApi.start(newSize)
    positionApi.start(newPosition)

    // 禁用移动
    changeDisableMove(down, () => {
      setCurrentSize(newSize)
      setCurrentPosition(newPosition)
    })
  }

  // Bind it to a component.
  return (
    <animated.div className={classnames(className)} style={{ ...style, ...position }} {...moveBind()}>
      <animated.div className={styles.rotateWarp} style={{ rotateZ: angle, ...size }}>
        {/* 旋转 */}
        <div {...rotateBind()} className={styles.rotateBar}><ReloadOutlined /></div>

        {/* 子元素 */}
        <div className='w-full h-full'>
          {children}
        </div>

        {/* 用于缩放的边框 */}
        <div {...topBind()} className={styles.sizeWrap_top}></div>
        <div {...bottomBind()} className={styles.sizeWrap_bottom}></div>
        <div {...leftBind()} className={styles.sizeWrap_left}></div>
        <div {...rightBind()} className={styles.sizeWrap_right}></div>
        <div {...topLeftBind()} className={styles.sizeWrap_topLeft}></div>
        <div {...topRightBind()} className={styles.sizeWrap_topRight}></div>
        <div {...bottomLeftBind()} className={styles.sizeWrap_bottomLeft}></div>
        <div {...bottomRightBind()} className={styles.sizeWrap_bottomRight}></div>
      </animated.div>
    </animated.div>
  )
}

export default EditorDiv
