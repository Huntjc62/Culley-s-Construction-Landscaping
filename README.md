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


## Admin login — important

There is deliberately **no Create Account / Register page**.

The admin page only has:
- the pre-configured Culley's admin email
- an admin password field
- Sign in

The admin account must be created manually in Firebase:

Firebase Console → Authentication → Users → Add user

Use the email:

`admin@culleysconstruction.co.uk`

Then set the password there. The password is never stored in this website.

### GitHub Pages blank-page fix

If `/admin.html` is blank on GitHub Pages, check these settings:

1. Firebase Console → Authentication → Sign-in method → Email/Password must be enabled.
2. Firebase Console → Authentication → Settings → Authorised domains.
3. Add your exact GitHub Pages host, for example:
   `yourusername.github.io`
4. If the site is hosted at:
   `https://yourusername.github.io/your-repository/`
   the authorised domain is still:
   `yourusername.github.io`
5. Make sure you deploy the contents of this ZIP to the GitHub repository, including the `.nojekyll` file.
6. Hard-refresh the GitHub Pages site after deployment.

The admin page has also been changed so Firebase initialisation errors are displayed on-screen rather than leaving an apparently blank page.

### GitHub Pages URL

The admin page is:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/admin.html`

Do not add `/admin` — the file is named `admin.html`.

### Admin login

The email is configured in:

`assets/firebase-config.js`

Currently:

`admin@culleysconstruction.co.uk`

Only the password is entered on the website. No password is hard-coded into the code.

### If you want a different admin email

1. Create the desired user in Firebase Authentication.
2. Change `adminEmail` in `assets/firebase-config.js`.
3. Redeploy the site.


## Admin dashboard visibility fix
The admin dashboard previously inherited the site's scroll-animation `opacity: 0` rule because the main stylesheet applies animations to all `<section>` elements. The admin page does not run the scroll observer, so the dashboard could become invisible after login.

This package explicitly forces the logged-in admin dashboard to `opacity: 1`, `transform: none` and `visibility: visible`.

The admin Firestore listener also now has a fallback unordered query if the ordered `createdAt` query fails.
