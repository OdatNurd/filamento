/******************************************************************************/

import { useUser } from '@clerk/clerk-react';
import { Page } from '@components/layout/Page';
import { IonButton, IonText } from '@ionic/react';

/******************************************************************************/

export const NotFound = () => {
  const { isSignedIn } = useUser();
  const homePath = isSignedIn ? '/app/spools' : '/';
  const homeText = isSignedIn ? 'Go to Spools' : 'Go to Home';

  return (
    <Page title="Not Found" navType={isSignedIn ? 'menu' : undefined}>
      <div style={{ textAlign: 'center', paddingTop: '50px' }}>
        <IonText>
          <h1>404</h1>
          <p>The page you&apos;re looking for could not be found.</p>
        </IonText>
        <IonButton routerLink={homePath} style={{ marginTop: '20px' }}>
          {homeText}
        </IonButton>
      </div>
    </Page>
  );
};

/******************************************************************************/
