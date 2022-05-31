import React, { useEffect, useRef } from "react";
import Umbrella, { HoverType } from "../../libs/umbrella";
import { css } from "@emotion/css";
import classNames from "classnames";

export type WorldProps = {
  className?: string,
  style?: React.CSSProperties,
  hover?: HoverType;
};

const worldStyle = css`
  perspective: 900;
  -webkit-perspective: 900;
  transform-style: preserve-3d;

  .umbrella-scene {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    user-select: none;
  }
`

const World: React.FC<WorldProps> = function ({ children, hover, className, style }) {
  const world = useRef<any>();
  const scene = useRef<any>();

  // useEffect(() => {
  //   if (world.current && scene.current)
  //     new Umbrella({
  //       world: world.current,
  //       scene: scene.current,
  //       hover,
  //     });
  // }, [world, scene]);
  return (
    <div
      ref={world}
      className={classNames([worldStyle, className])}
      style={style}
    >
      <div ref={scene} className="umbrella-scene w-full h-full d3">
        {children}
      </div>
    </div>
  );
};
export default World;
