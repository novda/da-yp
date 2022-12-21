import React from "react";

type Props = {
  fill: string;
};

const CircleSVG: React.FC<Props> = ({ fill }) => (
  <svg width={16} height={16} viewBox="0 0 16 16">
    <circle cx={8} cy={8} r={8} fill={fill} />
  </svg>
);

export default CircleSVG;