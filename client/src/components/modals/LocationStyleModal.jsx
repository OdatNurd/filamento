/******************************************************************************/

import { LocationStylePicker } from '@inventory/LocationStylePicker';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';

/******************************************************************************/

export const LocationStyleModal = ({
  isOpen,
  onDidDismiss,
  selectedColor,
  onColorChange,
  selectedIcon,
  onIconChange,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} swipeToClose={true}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Location Style</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <LocationStylePicker
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          selectedIcon={selectedIcon}
          onIconChange={onIconChange}
        />
      </IonContent>
    </IonModal>
  );
};

/******************************************************************************/
