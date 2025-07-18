/******************************************************************************/

import { useUser } from '@clerk/clerk-react';
import { SpoolIcon } from '@icons/SpoolIcon';
import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { Redirect } from 'react-router-dom';

/******************************************************************************/

export const Landing = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Redirect to="/app/spools" />;
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SpoolIcon size={128} className="rainbow-icon" style={{ marginBottom: '20px' }} />
            <IonText>
              <h1>Welcome to Filamento!</h1>
              <p>The best app to manage your 3D printing filament inventory.</p>
            </IonText>
            <IonButton routerLink="/app/spools" style={{ marginTop: '20px' }}>
              Log In or Sign Up
            </IonButton>
          </div>
          <IonButton routerLink="/privacy-policy" fill="clear" size="small">
            Privacy Policy
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

/******************************************************************************/
