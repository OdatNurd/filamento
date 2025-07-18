/******************************************************************************/

import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { ClerkProvider } from '@components/auth/ClerkProvider';
import { MainApp } from '@components/layout/MainApp';
import { Menu } from '@components/layout/Menu';
import { Landing } from '@components/pages/Landing';
import { NotFound } from '@components/pages/NotFound';
import { PrivacyPolicy } from '@components/pages/PrivacyPolicy';
import { Theme } from '@context/Theme';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadState, saveState } from '@utility/storage';
import { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

/******************************************************************************/

// Call setupIonicReact once when the app loads
setupIonicReact();

// Create a client
const queryClient = new QueryClient();

const THEME_STORAGE_KEY = 'filamento_theme';

/******************************************************************************/

// A wrapper for protected routes that redirects to the sign-in page if the user is not authenticated.
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <>
        <SignedIn>
          <Component {...props} />
        </SignedIn>
        <SignedOut>
          <Redirect to="/sign-in" />
        </SignedOut>
      </>
    )}
  />
);

const ClerkSignIn = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/app/spools" />
    </div>
  );
};

export const App = () => {
  const [theme, internalSetTheme] = useState(() => loadState(THEME_STORAGE_KEY, 'system'));
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setTheme = newTheme => {
    saveState(THEME_STORAGE_KEY, newTheme);
    internalSetTheme(newTheme);
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(theme === 'dark' || (theme === 'system' && prefersDark.matches));

    const handleSystemThemeChange = e => {
      if (theme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    prefersDark.addEventListener('change', handleSystemThemeChange);
    return () => prefersDark.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <Theme.Provider value={{ theme, setTheme, isDarkMode }}>
          <IonReactRouter>
            <ClerkProvider>
              <Menu />
              <IonRouterOutlet id="main-content">
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path="/sign-in" component={ClerkSignIn} />
                  <Route path="/privacy-policy" component={PrivacyPolicy} />
                  <PrivateRoute path="/app" component={MainApp} />
                  <Route component={NotFound} />
                </Switch>
              </IonRouterOutlet>
            </ClerkProvider>
          </IonReactRouter>
        </Theme.Provider>
      </IonApp>
    </QueryClientProvider>
  );
};

/******************************************************************************/
