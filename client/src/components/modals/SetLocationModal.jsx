/******************************************************************************/

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { cubeOutline } from 'ionicons/icons';

/******************************************************************************/

export const SetLocationModal = ({ isOpen, locations, onDidDismiss, onSetLocation, onClearLocation }) => {
  const handleSetLocation = locationId => {
    onSetLocation(locationId);
    onDidDismiss();
  };

  const handleClearLocation = () => {
    onClearLocation();
    onDidDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} swipeToClose={true}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Set Spool Location</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {locations?.map(loc => (
            <IonItem button key={loc.id} onClick={() => handleSetLocation(loc.id)}>
              <IonIcon icon={loc.icon || cubeOutline} color={loc.color} slot="start" />
              <IonLabel>{loc.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton expand="block" color="danger" onClick={handleClearLocation} style={{ marginTop: '20px' }}>
          Clear Location
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

/******************************************************************************/
