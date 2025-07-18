/******************************************************************************/

import { SpoolIcon } from '@icons/SpoolIcon';
import { IonText } from '@ionic/react';

/******************************************************************************/

export const InventoryIcon = ({
  vendor,
  colorName,
  material,
  color,
  totalWeight,
  currentWeight,
  onSpoolClick,
}) => {
  const percentage = totalWeight > 0 ? (currentWeight / totalWeight) * 100 : 0;

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSpoolClick();
    }
  };

  return (
    <div
      className="inventory-icon-wrapper"
      onClick={onSpoolClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="weight-display">{currentWeight}g</div>
      <SpoolIcon color={color} size={48} percentage={percentage} showFilament={false} />
      <IonText style={{ marginTop: '4px', lineHeight: '1.2' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9em' }}>{vendor}</p>
        <p style={{ margin: 0, fontSize: '0.8em' }}>{colorName}</p>
        <p style={{ margin: 0, fontSize: '0.7em', color: 'var(--ion-color-medium-shade)' }}>{material}</p>
      </IonText>
    </div>
  );
};

/******************************************************************************/
