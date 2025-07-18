/******************************************************************************/

import { Page } from '@components/layout/Page';
import { IonText } from '@ionic/react';

/******************************************************************************/

export const PrivacyPolicy = () => (
  <Page title="Privacy Policy" navType="back">
    <IonText>
      <h2>Privacy Policy for Filamento</h2>
      <p>
        <strong>Last Updated: June 29, 2025</strong>
      </p>
      <p>
        This Privacy Policy describes how Filamento (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
        collects, uses, and discloses your information when you use our application.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        We believe in minimizing data collection. To provide you with a personalized experience, we collect
        the following information when you log in to Filamento using your social media credentials:
      </p>

      <p style={{ paddingLeft: '20px' }}>
        &bull; <strong>Name:</strong> To identify you within the application.
      </p>
      <p style={{ paddingLeft: '20px' }}>
        &bull; <strong>Email Address:</strong> To communicate with you regarding your account and for support
        purposes.
      </p>
      <p style={{ paddingLeft: '20px' }}>
        &bull; <strong>Profile Picture:</strong> To personalize your user profile within the app.
      </p>

      <p>
        This information is collected solely for the purpose of identifying you and associating you with your
        filament spool data and other works created within the Filamento application.
      </p>

      <h3>2. How We Use Your Information</h3>
      <p>The personal information we collect is used exclusively for the following purposes:</p>

      <p style={{ paddingLeft: '20px' }}>&bull; To create and manage your user account.</p>
      <p style={{ paddingLeft: '20px' }}>
        &bull; To identify you as the owner of the filament spool data you input.
      </p>
      <p style={{ paddingLeft: '20px' }}>&bull; To provide you with customer support.</p>

      <h3>3. Information Sharing</h3>
      <p>
        Your privacy is paramount. We do not and will not sell, rent, or share your personal information with
        any third parties for any reason. All data you provide and the content you create within Filamento is
        for your use only and is never shared externally.
      </p>

      <h3>4. Data Storage and Security</h3>
      <p>
        We are committed to protecting your information. We take reasonable and appropriate measures to
        protect the personal data that we collect and store from loss, misuse, and unauthorized access,
        disclosure, alteration, and destruction.
      </p>

      <h3>5. Your Works</h3>
      <p>
        Any data you enter into Filamento, including but not limited to filament types, usage statistics, and
        project notes, is considered your &quot;work.&quot; This information is stored for your access and
        management and is never shared with other users or any third party.
      </p>

      <h3>6. Children&apos;s Privacy</h3>
      <p>
        Filamento is not intended for use by individuals under the age of 13. We do not knowingly collect
        personal information from children under 13. If we become aware that a child under 13 has provided us
        with personal information, we will take steps to delete such information.
      </p>

      <h3>7. Changes to This Privacy Policy</h3>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
        new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any
        changes. Changes to this Privacy Policy are effective when they are posted on this page.
      </p>

      <h3>8. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
      <p>
        <a href="mailto:filamento@odatnurd.net">filamento@odatnurd.net</a>
      </p>
    </IonText>
  </Page>
);

/******************************************************************************/
