/******************************************************************************/

import { SignedIn, useClerk, useUser } from '@clerk/clerk-react';
import { useTheme } from '@context/Theme';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline, moon, phonePortraitOutline, sunny } from 'ionicons/icons';
import { useRef } from 'react';

/******************************************************************************/

export const Menu = () => {
  const menuRef = useRef(null);
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = e => setTheme(e.detail.value);

  const handleNavClick = () => {
    menuRef.current?.close();
  };

  const handleLogout = async () => {
    await menuRef.current?.close();
    signOut();
  };

  return (
    <SignedIn>
      <IonMenu contentId="main-content" ref={menuRef}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div>
              <IonList>
                {user && (
                  <IonItem
                    button={true}
                    routerLink="/app/user-profile"
                    routerDirection="forward"
                    lines="none"
                    onClick={handleNavClick}
                  >
                    <IonAvatar slot="start">
                      <img src={user.imageUrl} alt={`Profile for ${user.fullName}`} />
                    </IonAvatar>
                    <IonLabel>Account</IonLabel>
                  </IonItem>
                )}
              </IonList>

              <IonList>
                <IonListHeader>Navigation</IonListHeader>
                <IonItem
                  button={true}
                  routerLink="/app/spools"
                  routerDirection="root"
                  onClick={handleNavClick}
                >
                  <IonLabel>Spools</IonLabel>
                </IonItem>
                <IonItem
                  button={true}
                  routerLink="/app/stats"
                  routerDirection="root"
                  onClick={handleNavClick}
                >
                  <IonLabel>Stats</IonLabel>
                </IonItem>
                <IonItem
                  button={true}
                  routerLink="/app/inventory"
                  routerDirection="root"
                  onClick={handleNavClick}
                >
                  <IonLabel>Inventory</IonLabel>
                </IonItem>
                {/* Sub-pages use routerDirection="forward" */}
                <IonItem
                  button={true}
                  routerLink="/app/brands"
                  routerDirection="forward"
                  onClick={handleNavClick}
                >
                  <IonLabel>Brands</IonLabel>
                </IonItem>
                <IonItem
                  button={true}
                  routerLink="/app/materials"
                  routerDirection="forward"
                  onClick={handleNavClick}
                >
                  <IonLabel>Materials</IonLabel>
                </IonItem>
              </IonList>
            </div>

            <div>
              <IonList>
                <IonItem lines="none">
                  <IonLabel>
                    <h2>Select Theme</h2>
                    <IonNote style={{ textTransform: 'capitalize' }}>Current: {theme}</IonNote>
                  </IonLabel>
                </IonItem>
                <IonSegment value={theme} onIonChange={handleThemeChange}>
                  <IonSegmentButton value="light">
                    <IonIcon icon={sunny} />
                  </IonSegmentButton>
                  <IonSegmentButton value="dark">
                    <IonIcon icon={moon} />
                  </IonSegmentButton>
                  <IonSegmentButton value="system">
                    <IonIcon icon={phonePortraitOutline} />
                  </IonSegmentButton>
                </IonSegment>
              </IonList>
              <IonButton expand="block" onClick={handleLogout} style={{ marginTop: '1rem' }}>
                <IonIcon slot="start" icon={logOutOutline} />
                Log Out
              </IonButton>
              <IonNote
                style={{
                  fontSize: '0.8em',
                  color: 'var(--ion-color-medium)',
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                Version: {__APP_VERSION__}.{__COMMIT_HASH__}
              </IonNote>
            </div>
          </div>
        </IonContent>
      </IonMenu>
    </SignedIn>
  );
};

/******************************************************************************/
