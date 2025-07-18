/******************************************************************************/

import { SpoolIcon } from '@icons/SpoolIcon';
import './Spools.css';

/******************************************************************************/

export const SimpleSpoolIcon = ({ color, totalWeight, currentWeight, onClick }) => {
  const percentage = totalWeight > 0 ? (currentWeight / totalWeight) * 100 : 0;

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(e);
    }
  };

  return (
    <div
      className="simple-spool-icon-wrapper"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="simple-weight-display">{currentWeight}g</div>
      <SpoolIcon color={color} size={48} percentage={percentage} showFilament={false} />
    </div>
  );
};

/******************************************************************************/
