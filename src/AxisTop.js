import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "@vx/scale";
import { AxisTop as VxAxisTop } from "@vx/axis";

const AxisTop = (props) => {
  const { domainMax, xMax } = props;
  const xScaleForAxis = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  return <VxAxisTop
    top={0}
    left={0}
    scale={xScaleForAxis}
    tickLabelProps={() => ({ textAnchor: 'middle', dy: '-0.25em', fontSize: 12, })}
    numTicks={5}
  />
}

AxisTop.propTypes = {
  domainMax: PropTypes.number.isRequired,
  xMax: PropTypes.number.isRequired,
};

export default AxisTop;