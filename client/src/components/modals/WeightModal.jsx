/******************************************************************************/

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';

/******************************************************************************/

export const WeightModal = ({ spool, isOpen, onDidDismiss, onUpdateWeight }) => {
  const [mode, setMode] = useState('byScale');
  const [directWeight, setDirectWeight] = useState(spool?.currentWeight || 0);
  const [scaleWeight, setScaleWeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    if (spool) {
      setDirectWeight(spool.currentWeight);
      // Pre-fill scale weight with a reasonable starting value
      setScaleWeight(spool.currentWeight + spool.emptySpoolWeight + spool.spoolWeightAdjustment);
    }
  }, [spool]);

  if (!spool) {
    return null;
  }

  // Fix annoying accessability issues related to the focus still being on a
  // hidden item when the modal opens.
  const handleDidPresent = () => {
    if (headerRef.current) {
      headerRef.current.focus();
    }
  };

  const handleModeChange = e => {
    setMode(e.detail.value);
  };

  const handleDirectUpdate = () => {
    const weight = parseInt(directWeight, 10);
    if (!isNaN(weight)) {
      onUpdateWeight(weight);
      onDidDismiss();
    }
  };

  const handleScaleUpdate = () => {
    const weight = parseInt(scaleWeight, 10);
    if (!isNaN(weight)) {
      const filamentWeight = Math.max(
        0,
        weight - spool.emptySpoolWeight - (spool.spoolWeightAdjustment || 0),
      );
      onUpdateWeight(filamentWeight);
      onDidDismiss();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss} onDidPresent={handleDidPresent} swipeToClose={true}>
      <IonHeader ref={headerRef} tabIndex="-1">
        <IonToolbar>
          <IonTitle>Update Spool Weight</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={mode} onIonChange={handleModeChange}>
            <IonSegmentButton value="byScale">By Scale</IonSegmentButton>
            <IonSegmentButton value="direct">Direct Entry</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {mode === 'direct' ? (
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Remaining Filament Weight (g)</IonLabel>
              <IonInput
                type="number"
                value={directWeight}
                onIonInput={e => setDirectWeight(e.detail.value)}
                placeholder="Enter weight in grams"
              />
            </IonItem>
            <IonButton expand="block" onClick={handleDirectUpdate} style={{ marginTop: '20px' }}>
              Update
            </IonButton>
          </IonList>
        ) : (
          <IonList>
            <IonItem>
              <IonLabel>Initial Filament Weight</IonLabel>
              <IonNote slot="end" color="secondary">
                {spool.totalWeight}g
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Empty Spool Weight (Tare)</IonLabel>
              <IonNote slot="end" color="secondary">
                {spool.emptySpoolWeight}g
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Tare Adjustment</IonLabel>
              <IonNote slot="end" color="secondary">
                {spool.spoolWeightAdjustment || 0}g
              </IonNote>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Current Weight on Scale (g)</IonLabel>
              <IonInput
                type="number"
                value={scaleWeight}
                onIonInput={e => setScaleWeight(e.detail.value)}
                placeholder="Enter total weight from scale"
              />
            </IonItem>
            <IonButton expand="block" onClick={handleScaleUpdate} style={{ marginTop: '20px' }}>
              Calculate and Update
            </IonButton>
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};

/******************************************************************************/
