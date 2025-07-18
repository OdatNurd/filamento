/******************************************************************************/

import { UserProfile as ClerkUserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { Page } from '@components/layout/Page';
import { useTheme } from '@context/Theme';
import { IonButton } from '@ionic/react';

/******************************************************************************/

export const UserProfile = () => {
  const { isDarkMode } = useTheme();

  return (
    <Page title="Manage Account" navType="back">
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
        <ClerkUserProfile
          path="/app/user-profile"
          routing="path"
          appearance={{ baseTheme: isDarkMode ? dark : undefined }}
        />
      </div>
      <IonButton routerLink="/privacy-policy" expand="block" fill="clear" style={{ marginTop: '20px' }}>
        Privacy Policy
      </IonButton>
    </Page>
  );
};

/******************************************************************************/
