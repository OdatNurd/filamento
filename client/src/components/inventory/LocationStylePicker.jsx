/******************************************************************************/

import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import './Inventory.css';
import { locationColors, locationIcons } from './location-styles.js';

/******************************************************************************/

export const LocationStylePicker = ({ selectedColor, onColorChange, selectedIcon, onIconChange }) => {
  return (
    <>
      <IonItem lines="none">
        <IonLabel>Color</IonLabel>
      </IonItem>
      <div className="style-picker-container">
        {locationColors.map(color => (
          <IonButton
            key={color}
            className="color-swatch"
            color={color}
            fill={selectedColor === color ? 'solid' : 'outline'}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>

      <IonItem lines="none">
        <IonLabel>Icon</IonLabel>
      </IonItem>
      <div className="style-picker-container">
        {locationIcons.map(({ name, icon }) => (
          <IonButton
            key={name}
            color={selectedColor || 'primary'}
            fill={selectedIcon === name ? 'solid' : 'outline'}
            onClick={() => onIconChange(name)}
          >
            <IonIcon icon={icon} />
          </IonButton>
        ))}
      </div>
    </>
  );
};

/******************************************************************************/
