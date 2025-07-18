/******************************************************************************/

import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

/******************************************************************************/

export const DeleteLocationModal = ({
  isOpen,
  onDidDismiss,
  locationsState,
  locationsToDelete,
  handleCheckboxChange,
  handleDeleteLocations,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} swipeToClose={true}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Delete Locations</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {locationsState?.map(loc => (
            <IonItem key={loc.id}>
              <IonCheckbox slot="start" onIonChange={e => handleCheckboxChange(loc.id, e.detail.checked)} />
              <IonLabel>{loc.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonButton
          expand="block"
          color="danger"
          disabled={locationsToDelete.length === 0}
          onClick={handleDeleteLocations}
          style={{ marginTop: '20px' }}
        >
          Delete Selected
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

/******************************************************************************/
