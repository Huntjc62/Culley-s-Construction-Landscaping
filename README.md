# Culley's Construction & Landscaping — professional website

This version is designed as a polished multi-page marketing website with responsive layouts, photography, animations and a Firebase-powered enquiry/admin system.

## Before launch
Replace:
- `01325 000 000`
- `hello@culleysconstruction.co.uk`
- team names/roles
- team photography
- any copy you want to personalise

## Firebase
1. Create a Firebase project.
2. Add a Web App.
3. Copy its config into `assets/firebase-config.js`.
4. Enable Authentication → Email/Password.
5. Create the Culley's admin account.
6. Enable Firestore.
7. Deploy to Firebase Hosting, Netlify, Vercel or another HTTPS host. Do not expect ES modules/Firebase to work reliably when double-clicking HTML files from Windows File Explorer.

### Firestore rules
Use:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /enquiries/{id} {
      allow create: if request.resource.data.name is string
        && request.resource.data.email is string
        && request.resource.data.message is string;
      allow read, delete: if request.auth != null;
      allow update: if false;
    }
  }
}

For a production system, add an `admins` collection keyed by UID and restrict read/delete to approved admin UIDs.

## Pages
Home / Construction / Landscaping / About / Contact / Admin

## Important
The image URLs use Unsplash photography so the site has real visual content immediately. For a final commercial launch, replace these with Culley's own project photography for a much stronger and more authentic result.


## Bundled construction hero
The construction hero image is now included locally at:
`assets/construction-hero.png`

This means the construction hero does not rely on an external image URL and will travel with the website package when deployed.


## Construction hero fix
The Construction page no longer uses the previous bundled hero image because that image contained duplicated text. The page now uses a clean residential image as the CSS background and renders the heading only once in HTML.
