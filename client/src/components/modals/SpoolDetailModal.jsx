/******************************************************************************/

import { LocationDisplay } from '@inventory/LocationDisplay';
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  businessOutline,
  closeCircleOutline,
  createOutline,
  ellipsisHorizontal,
  pencilOutline,
  trashBinOutline,
} from 'ionicons/icons';
import { useRef, useState } from 'react';
import { SetLocationModal } from './SetLocationModal';
import { WeightModal } from './WeightModal';

/******************************************************************************/

const formatWeight = weightInGrams => {
  if (weightInGrams >= 1000) {
    return `${(weightInGrams / 1000).toFixed(2)}kg`;
  }
  return `${weightInGrams}g`;
};

export const SpoolDetailModal = ({
  spool,
  locations,
  isOpen,
  onDidDismiss,
  onSetLocation,
  onClearLocation,
  onUpdateWeight,
}) => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showSetLocationModal, setShowSetLocationModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const headerRef = useRef(null);

  if (!spool) {
    return null;
  }

  const handleAction = handler => {
    // In the future, this would call the actual handler
    console.log(`Action triggered: ${handler}`);
    setShowActionSheet(false);
  };

  const remainingWeight = formatWeight(spool.currentWeight);
  const totalWeight = formatWeight(spool.totalWeight);

  // Fix annoying accessability issues related to the focus still being on a
  // hidden item when the modal opens.
  const handleDidPresent = () => {
    if (headerRef.current) {
      headerRef.current.focus();
    }
  };

  return (
    <>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={onDidDismiss}
        onDidPresent={handleDidPresent}
        swipeToClose={true}
      >
        <IonHeader ref={headerRef} tabIndex="-1">
          <IonToolbar>
            <IonTitle>Spool Details</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowActionSheet(true)}>
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
              <IonButton onClick={onDidDismiss}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem lines="full">
            <IonIcon icon={businessOutline} slot="start" color="medium" />
            <IonLabel>
              <h2 style={{ fontSize: '1.2em', margin: '0' }}>{spool.vendor}</h2>
            </IonLabel>
          </IonItem>

          <IonItem lines="full">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonLabel>{spool.colorName}</IonLabel>
              <IonChip>
                <IonLabel>{spool.material}</IonLabel>
              </IonChip>
            </div>
            <IonNote slot="end">Dia: {spool.filamentDiameter}mm</IonNote>
          </IonItem>

          <IonItem lines="full">
            <IonLabel color="medium">
              Remaining: <strong style={{ color: 'var(--ion-text-color)' }}>{remainingWeight}</strong> /{' '}
              {totalWeight}
            </IonLabel>
            <IonButton slot="end" fill="clear" onClick={() => setShowWeightModal(true)}>
              <IonIcon icon={pencilOutline} />
            </IonButton>
          </IonItem>

          <LocationDisplay
            spool={spool}
            locations={locations}
            onClick={() => setShowSetLocationModal(true)}
          />
        </IonContent>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Spool Actions"
          cssClass="custom-action-sheet"
          buttons={[
            {
              text: 'Edit',
              icon: createOutline,
              handler: () => handleAction('edit'),
            },
            {
              text: 'Mark Depleted',
              icon: closeCircleOutline,
              handler: () => handleAction('deplete'),
            },
            {
              text: 'Delete',
              role: 'destructive',
              icon: trashBinOutline,
              handler: () => handleAction('delete'),
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ]}
        />
      </IonModal>
      <SetLocationModal
        isOpen={showSetLocationModal}
        locations={locations}
        onDidDismiss={() => setShowSetLocationModal(false)}
        onSetLocation={onSetLocation}
        onClearLocation={onClearLocation}
      />
      <WeightModal
        spool={spool}
        isOpen={showWeightModal}
        onDidDismiss={() => setShowWeightModal(false)}
        onUpdateWeight={onUpdateWeight}
      />
    </>
  );
};

/******************************************************************************/
