import React from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import AxisTop from "./AxisTop";

const AnimatedAxisTop = animated(AxisTop);

const RacingAxisTop = ({ domainMax, xMax }) => {
  const springProps = useSpring({ domainMax });
  return (
    <AnimatedAxisTop
      xMax={xMax}
      {...springProps}
    />
  );
};

RacingAxisTop.propTypes = {
  domainMax: PropTypes.number.isRequired,
  xMax: PropTypes.number.isRequired,
};

export default RacingAxisTop;