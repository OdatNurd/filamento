/******************************************************************************/

export const SpoolIcon = ({
  color,
  colorTwo,
  size = 32,
  style,
  title,
  percentage = 100,
  showFilament = true,
  ...props
}) => {
  const uniqueGradientId = `spoolGradient-${Math.random().toString(36).substring(2, 9)}`;
  const uniqueTitleId = `spoolIconTitle-${Math.random().toString(36).substring(2, 9)}`;
  const uniqueClipId = `spoolClip-${Math.random().toString(36).substring(2, 9)}`;
  const uniqueHatchId = `spoolHatch-${Math.random().toString(36).substring(2, 9)}`;

  // Determine the fill style for the path
  let pathFillStyle;
  if (colorTwo) {
    pathFillStyle = `url(#${uniqueGradientId})`;
  } else {
    pathFillStyle = color || 'currentColor';
  }

  // Calculate the SVG path for a pie wedge based on a particular percentage of
  // filament being available.
  const getWedgePath = percent => {
    // Return a full circle if 100% or more
    if (percent >= 100) {
      return 'M16,0 A16,16 0 1,1 15.999,0 Z';
    }
    // No path if 0%
    if (percent <= 0) {
      return 'M0,0';
    }

    const radius = 16;
    const centerX = 16;
    const centerY = 16;
    const angle = (percent / 100) * 360;
    // Convert our angle from degrees to radians, and then rotate it
    // by 90 degrees so it lines up correctly.
    const rad = (angle - 90) * (Math.PI / 180);

    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Path from center, to top, arc around, and back to center
    return `M${centerX},${centerY} L${centerX},0 A${radius},${radius} 0 ${largeArcFlag},1 ${x},${y} Z`;
  };

  // Determine the accessible name for the icon
  const accessibleName = title || props['aria-label'] || 'Spool Icon';

  // This path defines a version of the spool icon that shows a string of
  // filament coming off of the spool.
  const withFilament = {
    transform: 'matrix(0.975009,0,0,0.974683,0.399853,0.405073)',
    d: 'M13.807,26.992C6.522,26.992 0.616,21.086 0.616,13.801C0.616,6.516 6.522,0.61 13.807,0.61C21.092,0.61 26.998,6.516 26.998,13.801C26.998,17.828 25.193,21.433 22.351,23.852L28.254,23.852L28.254,23.904C30.181,24.235 31.534,25.986 31.371,27.935C31.208,29.883 29.581,31.383 27.626,31.39L1.872,31.39C1.539,31.39 1.265,31.131 1.245,30.798C1.226,30.466 1.468,30.177 1.798,30.138L1.872,30.133L27.626,30.133C29.014,30.133 30.138,29.009 30.138,27.621C30.138,26.232 29.014,25.108 27.626,25.108L20.605,25.108C18.62,26.305 16.294,26.993 13.806,26.993L13.807,26.992L13.807,26.992ZM13.807,21.339C13.488,21.339 13.221,21.578 13.183,21.894L13.178,21.967L13.178,23.224L13.183,23.298C13.221,23.613 13.488,23.852 13.807,23.852C14.125,23.852 14.392,23.613 14.43,23.298L14.435,23.224L14.435,21.967L14.43,21.894C14.392,21.578 14.125,21.339 13.807,21.339ZM19.137,19.131C18.914,19.356 18.89,19.711 19.085,19.96L19.137,20.02L20.025,20.909L20.08,20.958L20.08,20.956C20.328,21.152 20.685,21.132 20.911,20.909C21.136,20.686 21.159,20.329 20.966,20.08L20.914,20.02L20.025,19.131L19.97,19.083C19.721,18.885 19.363,18.907 19.137,19.131ZM7.648,19.079L7.588,19.131L6.699,20.02L6.65,20.075L6.652,20.075C6.456,20.323 6.476,20.68 6.699,20.906C6.922,21.13 7.279,21.154 7.528,20.961L7.588,20.909L8.477,20.02L8.525,19.965C8.722,19.715 8.701,19.359 8.478,19.134C8.255,18.908 7.899,18.885 7.648,19.079ZM13.807,10.032C11.726,10.032 10.038,11.721 10.038,13.801C10.038,15.882 11.726,17.57 13.807,17.57C15.887,17.57 17.576,15.882 17.576,13.801C17.576,11.721 15.887,10.032 13.807,10.032ZM23.229,13.173L21.973,13.173L21.899,13.178C21.583,13.216 21.345,13.483 21.345,13.801C21.345,14.12 21.583,14.387 21.899,14.425L21.973,14.43L23.229,14.43L23.303,14.425C23.633,14.386 23.875,14.097 23.856,13.765C23.835,13.432 23.562,13.173 23.229,13.173L23.229,13.173ZM5.641,13.173L4.384,13.173L4.311,13.178C3.995,13.216 3.756,13.483 3.756,13.801C3.756,14.12 3.995,14.387 4.311,14.425L4.384,14.43L5.641,14.43L5.715,14.425C6.044,14.386 6.286,14.097 6.267,13.765C6.247,13.432 5.974,13.173 5.641,13.173L5.641,13.173ZM6.699,6.694C6.476,6.918 6.454,7.273 6.647,7.523L6.699,7.583L7.588,8.472L7.643,8.52C7.893,8.717 8.249,8.696 8.474,8.473C8.7,8.25 8.723,7.894 8.529,7.642L8.477,7.583L7.588,6.694L7.533,6.645L7.533,6.647C7.283,6.449 6.925,6.469 6.699,6.694ZM20.084,6.642L20.024,6.694L19.135,7.583L19.086,7.638L19.088,7.638C18.892,7.887 18.912,8.244 19.135,8.468C19.358,8.695 19.715,8.718 19.966,8.523L20.026,8.472L20.914,7.583L20.963,7.528L20.961,7.528C21.158,7.28 21.137,6.923 20.914,6.697C20.691,6.472 20.335,6.449 20.085,6.642L20.084,6.642ZM13.807,3.751C13.488,3.751 13.221,3.99 13.183,4.305L13.179,4.379L13.179,5.635L13.183,5.709C13.221,6.025 13.488,6.264 13.807,6.264C14.126,6.264 14.393,6.025 14.43,5.709L14.435,5.635L14.435,4.379L14.43,4.305C14.393,3.99 14.126,3.751 13.807,3.751Z',
  };

  // This path defines a version of the spool icon where the filament string is
  // not visible.
  const withoutFilament = {
    transform: 'matrix(1.13714,0,0,1.13713,-1.72152,-3.44843)',
    d: 'M15.584,3.912C22.865,3.912 28.775,9.823 28.775,17.103C28.775,24.383 22.865,30.294 15.584,30.294C8.304,30.294 2.393,24.383 2.393,17.103C2.393,9.823 8.304,3.912 15.584,3.912ZM20.914,22.433C20.691,22.657 20.668,23.012 20.862,23.262L20.914,23.322L21.803,24.211L21.858,24.259L21.858,24.258C22.106,24.454 22.463,24.434 22.689,24.211C22.913,23.988 22.937,23.631 22.744,23.381L22.692,23.322L21.803,22.433L21.748,22.384C21.498,22.186 21.14,22.208 20.914,22.433ZM15.584,24.641C15.266,24.641 14.999,24.88 14.961,25.195L14.956,25.269L14.956,26.525L14.961,26.599C14.999,26.915 15.266,27.153 15.584,27.153C15.903,27.153 16.17,26.915 16.208,26.599L16.213,26.525L16.213,25.269L16.208,25.195C16.17,24.88 15.903,24.641 15.584,24.641ZM15.584,13.334C13.504,13.334 11.815,15.022 11.815,17.103C11.815,19.184 13.504,20.872 15.584,20.872C17.665,20.872 19.353,19.184 19.353,17.103C19.353,15.022 17.665,13.334 15.584,13.334ZM9.425,22.381L9.366,22.433L8.477,23.322L8.428,23.377L8.43,23.377C8.234,23.625 8.254,23.981 8.477,24.207C8.7,24.432 9.056,24.456 9.306,24.262L9.366,24.211L10.255,23.322L10.303,23.267C10.5,23.017 10.479,22.661 10.256,22.436C10.033,22.21 9.677,22.186 9.425,22.381ZM8.477,9.995C8.254,10.22 8.232,10.575 8.425,10.825L8.477,10.884L9.366,11.773L9.421,11.822C9.67,12.018 10.027,11.998 10.251,11.775C10.478,11.552 10.501,11.195 10.306,10.944L10.255,10.884L9.366,9.995L9.311,9.947L9.311,9.948C9.061,9.75 8.703,9.771 8.477,9.995ZM7.419,16.475L6.162,16.475L6.088,16.48C5.773,16.517 5.534,16.784 5.534,17.103C5.534,17.422 5.773,17.689 6.088,17.726L6.162,17.731L7.419,17.731L7.492,17.726C7.822,17.687 8.064,17.398 8.045,17.067C8.025,16.734 7.751,16.475 7.419,16.475ZM21.861,9.944L21.802,9.995L20.913,10.884L20.864,10.939L20.866,10.939C20.669,11.189 20.69,11.545 20.913,11.77C21.136,11.996 21.492,12.02 21.744,11.825L21.803,11.773L22.692,10.884L22.741,10.829L22.739,10.829C22.936,10.581 22.915,10.225 22.692,9.999C22.469,9.774 22.113,9.75 21.863,9.944L21.861,9.944ZM15.585,7.053C15.266,7.053 14.999,7.291 14.961,7.607L14.956,7.681L14.956,8.937L14.961,9.011C14.999,9.326 15.266,9.565 15.585,9.565C15.903,9.565 16.17,9.326 16.208,9.011L16.213,8.937L16.213,7.681L16.208,7.607C16.17,7.291 15.903,7.053 15.585,7.053ZM25.007,16.475L23.751,16.475L23.677,16.48C23.361,16.517 23.122,16.784 23.122,17.103C23.122,17.422 23.361,17.689 23.677,17.726L23.751,17.731L25.007,17.731L25.081,17.726C25.41,17.687 25.652,17.398 25.633,17.067C25.613,16.734 25.34,16.475 25.007,16.475Z',
  };

  const iconData = showFilament ? withFilament : withoutFilament;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
        color: color,
        ...style,
      }}
      role="img"
      aria-labelledby={uniqueTitleId}
      {...props}
    >
      <title id={uniqueTitleId}>{accessibleName}</title>
      <defs>
        {!showFilament && (
          <clipPath id={uniqueClipId}>
            <path d={getWedgePath(percentage)} />
          </clipPath>
        )}
        {colorTwo && (
          <linearGradient id={uniqueGradientId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={color || 'currentColor'} />
            <stop offset="100%" stopColor={colorTwo} />
          </linearGradient>
        )}
        {!showFilament && (
          <pattern id={uniqueHatchId} patternUnits="userSpaceOnUse" width="3" height="3">
            <path d="M-1,1 l2,-2 M0,3 l3,-3 M2,4 l2,-2" strokeWidth="0.5" stroke="var(--ion-color-medium)" />
          </pattern>
        )}
      </defs>
      <g transform={iconData.transform}>
        {showFilament ? (
          <>
            {/* Layer 1: Static "empty" background */}
            <path fill="var(--ion-color-medium)" d={iconData.d} style={{ fillRule: 'nonzero' }} />
            {/* Layer 2: Clipped, full-color overlay */}
            <path
              clipPath={!showFilament ? `url(#${uniqueClipId})` : undefined}
              fill={pathFillStyle}
              d={iconData.d}
              style={{ fillRule: 'nonzero' }}
            />
          </>
        ) : (
          <>
            {/* Layer 1: The empty part of the spool, with a cross-hatch fill and no outline. */}
            <path fill={`url(#${uniqueHatchId})`} d={iconData.d} style={{ fillRule: 'nonzero' }} />
            {/* Layer 2: The filament, clipped to the percentage. Solid color fill. */}
            <path
              clipPath={`url(#${uniqueClipId})`}
              fill={pathFillStyle}
              d={iconData.d}
              style={{ fillRule: 'nonzero' }}
            />
            {/* Layer 3: The outline, drawn on top of everything. */}
            <path
              stroke="black"
              strokeWidth="0.5"
              fill="none"
              d={iconData.d}
              style={{ fillRule: 'nonzero' }}
            />
          </>
        )}
      </g>
    </svg>
  );
};

/******************************************************************************/
