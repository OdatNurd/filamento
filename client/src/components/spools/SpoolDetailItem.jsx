/******************************************************************************/

import { SpoolIcon } from '@icons/SpoolIcon';
import { IonChip, IonIcon, IonLabel } from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import { useMemo, useState } from 'react';
import { SimpleSpoolIcon } from './SimpleSpoolIcon';
import './Spools.css';

/******************************************************************************/

export const SpoolDetailItem = ({ vendor, material, colorName, spools, onSpoolClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { percentage, weightDisplay } = useMemo(() => {
    const total = spools.reduce((acc, spool) => acc + spool.totalWeight, 0);
    const current = spools.reduce((acc, spool) => acc + spool.currentWeight, 0);
    const perc = total > 0 ? (current / total) * 100 : 0;

    let display;
    if (current >= 1000) {
      display = `${(current / 1000).toFixed(2)}kg`;
    } else {
      display = `${current}g`;
    }

    return { percentage: perc, weightDisplay: display };
  }, [spools]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExpand();
    }
  };

  return (
    <div className="spool-item">
      <div
        className="spool-item-content"
        onClick={toggleExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        <div className="spool-item-icon">
          <SpoolIcon
            color={spools[0]?.color} // Use the first spool's color for the main icon
            percentage={percentage}
            showFilament={false}
            size={64}
          />
        </div>
        <div className="spool-item-details">
          <p className="vendor-name">{vendor}</p>
          <p className="color-name">{colorName}</p>
          <p className="total-weight">{weightDisplay} remaining</p>
        </div>
        <div className="spool-item-end">
          <IonChip>
            <IonLabel>{material}</IonLabel>
          </IonChip>
          <IonLabel color="medium">
            {spools.length} {spools.length === 1 ? 'spool' : 'spools'}
            <IonIcon
              icon={chevronForward}
              className={`disclosure-icon ${isExpanded ? 'disclosure-icon-expanded' : ''}`}
            />
          </IonLabel>
        </div>
      </div>
      <div className={`expanded-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="expanded-inner">
          {spools.map(spool => (
            <SimpleSpoolIcon key={spool.id} {...spool} onClick={() => onSpoolClick(spool)} />
          ))}
        </div>
      </div>
    </div>
  );
};

/******************************************************************************/
