import React, { useState } from 'react';
import vectorArrow from '../../assets/Svg/Dashboard/Vector335.svg';
import vectorArrow1 from '../../assets/Svg/Dashboard/Vector334.svg';

interface CustomTargetVsActualChartProps {
  data: Array<Record<string, number>>;
  actualKey: string;
  targetKey: string;
  labelName?: string; // Scope 1
  labelTargetName?: string; // Target
}

const CustomTargetVsActualChart = ({
  data,
  actualKey,
  targetKey,
  labelName,
  labelTargetName,
}: CustomTargetVsActualChartProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const originalActual = data?.[0]?.[actualKey] || 0;
  const originalTarget = data?.[0]?.[targetKey] || 0;

  const logActual = Math.log10(originalActual || 1);
  const logTarget = Math.log10(originalTarget || 1);

  if (originalActual === 0 || originalTarget === 0) return null;

  const isActualGreater = logActual > logTarget;

  const outerValue = isActualGreater ? logActual : logTarget;
  const innerValue = isActualGreater ? logTarget : logActual;

  const outerOriginal = isActualGreater ? originalActual : originalTarget;
  const innerOriginal = isActualGreater ? originalTarget : originalActual;

  const outerDiameter = 200;
  const maxInnerDiameter = 160;
  const innerRatio = innerValue / outerValue;
  const innerDiameter = Math.max(innerRatio * outerDiameter, 20);

  const outerColor = isActualGreater ? '#e6e7eb' : '#0f2b46';
  const innerColor = isActualGreater ? '#0f2b46' : '#e6e7eb';

  const outerLabel = isActualGreater ? labelName : labelTargetName;
  const innerLabel = isActualGreater ? labelTargetName : labelName;
  const isOverlapping = innerRatio > 0.85;
  const outerLabelOffset = isOverlapping ? 30 : 50;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setTooltipPosition({ x: clientX, y: clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: outerDiameter,
        height: outerDiameter,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer Circle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: outerDiameter,
          height: outerDiameter,
          borderRadius: '50%',
          backgroundColor: outerColor,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: outerLabelOffset,
          color: outerColor === '#0f2b46' ? '#fff' : '#000',
          fontWeight: 'bold',
          fontSize: 14,
        }}
      >
        {outerOriginal.toLocaleString('en-IN')}
      </div>

      {/* Inner Circle */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%)`,
          width: innerDiameter,
          height: innerDiameter,
          borderRadius: '50%',
          backgroundColor: innerColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: innerColor === '#0f2b46' ? '#fff' : '#000',
          fontWeight: 'bold',
          fontSize: 14,
        }}
      >
        {innerOriginal.toLocaleString('en-IN')}
      </div>

      {/* Outer Label and Arrow */}
      <img
        src={isActualGreater ? vectorArrow : vectorArrow}
        alt="arrow to outer"
        style={{
          position: 'absolute',
          top: '2px',
          left: '162px',
          width: '40px',
          transform: 'rotate(0deg)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-5px',
          left: '205px',
          fontSize: 12,
          color: '#666',
        }}
      >
        {outerLabel}
      </div>

      {/* Inner Label and Arrow */}
      <img
        src={isActualGreater ? vectorArrow : vectorArrow}
        alt="arrow to inner"
        style={{
          position: 'absolute',
          bottom: '-15px', // Moved to the bottom of the inner circle
          left: 'calc(50% + 5px)', //
          width: '80px',
          transform: 'rotate(135deg) scaleX(-1)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '195px',
          fontSize: 12,
          color: '#666',
        }}
      >
        {innerLabel}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: 'white',
            color: 'black',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '14px',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div>
            <strong>{labelName}:</strong>{' '}
            {originalActual.toLocaleString('en-IN')}
          </div>
          <div>
            <strong>{labelTargetName}:</strong>{' '}
            {originalTarget.toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTargetVsActualChart;
