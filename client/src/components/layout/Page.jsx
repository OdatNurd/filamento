/******************************************************************************/

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

/******************************************************************************/

export const Page = ({ children, title, navType = 'menu', scrollable = true, headerButton = null }) => {
  const renderNavButton = () => {
    if (navType === 'back') {
      return <IonBackButton defaultHref="/app/spools" routerDirection="back" />;
    }
    return <IonMenuButton />;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">{renderNavButton()}</IonButtons>
          <IonTitle>{title}</IonTitle>
          {headerButton && <IonButtons slot="end">{headerButton}</IonButtons>}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={scrollable}>
        {children}
      </IonContent>
    </IonPage>
  );
};

/******************************************************************************/
