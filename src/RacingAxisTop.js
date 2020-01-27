import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import AxisTop from "./AxisTop";

const AnimatedAxisTop = animated(AxisTop);

const RacingAxisTop = forwardRef(({ domainMax, xMax }, ref) => {
  const springProps = useSpring({ domainMax, ref });
  return (
    <AnimatedAxisTop
      xMax={xMax}
      {...springProps}
    />
  );
});

RacingAxisTop.propTypes = {
  domainMax: PropTypes.number.isRequired,
  xMax: PropTypes.number.isRequired,
};

export default RacingAxisTop;