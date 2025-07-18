/******************************************************************************/

import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react';
import { addCircleOutline, cubeOutline } from 'ionicons/icons';

/******************************************************************************/

export const LocationDisplay = ({ spool, locations, onClick }) => {
  const location = locations?.find(loc => loc.id === spool.locationId);

  return (
    <IonItem button onClick={onClick} detail={true}>
      {location ? (
        <>
          <IonIcon icon={location.icon || cubeOutline} color={location.color} slot="start" />
          <IonLabel>{location.name}</IonLabel>
          <IonNote slot="end">{location.description}</IonNote>
        </>
      ) : (
        <>
          <IonIcon icon={addCircleOutline} slot="start" color="medium" />
          <IonLabel color="medium">No Location Assigned</IonLabel>
        </>
      )}
    </IonItem>
  );
};

/******************************************************************************/
