# Culley's Construction & Landscaping — Firebase-ready website

This package is connected to the Firebase project:

`culley-s-construction`

The Firebase Web App configuration supplied by the owner has already been added to:

`assets/firebase-config.js`

## Firebase setup — do these steps before testing

### 1. Authentication
Firebase Console → Authentication → Sign-in method → Email/Password → Enable.

Then go to Authentication → Users → Add user and create the Culley's admin login.

### 2. Firestore
Firebase Console → Firestore Database → Create database.

Choose a suitable European/UK location and use production mode.

### 3. Firestore rules
Open Firestore Database → Rules and paste the contents of:

`firestore.rules`

Then click Publish.

### 4. Test
Deploy the website to HTTPS hosting. Do not test by double-clicking the HTML files.

Open `/contact.html`, submit a test enquiry, then check:

Firebase Console → Firestore Database → Data → enquiries

Then open `/admin.html` and sign in with the Firebase admin user.

## Important security note

The Firebase web configuration is intentionally present in the website because Firebase web apps require it. The protection comes from Firebase Authentication and Firestore Security Rules.

For production, the next security upgrade should be an `admins` collection so only specific approved Firebase user UIDs can read/delete enquiries, rather than every authenticated Firebase user.

## Firebase Hosting

Firebase CLI can be used to deploy this folder:

1. Install Firebase CLI.
2. Run `firebase login`.
3. Run `firebase use culley-s-construction`.
4. Run `firebase deploy`.

If the project is not associated with the CLI yet, run `firebase init hosting` from this folder and select the existing `culley-s-construction` project.

## Included

- Home
- Construction
- Landscaping
- About Us
- Meet the Team
- Contact/enquiry form
- Firebase Firestore enquiry storage
- Firebase email/password admin login
- Admin enquiry dashboard
- Local construction hero image
- Responsive design
