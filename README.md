# Culley's Construction & Landscaping website

A multi-page, responsive website for Culley's Construction & Landscaping.

## Pages
- Home
- Construction
- Landscaping
- About Us + Meet the Team
- Contact + enquiry form
- Admin enquiry dashboard

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App to the project.
3. Copy the Firebase web configuration into `assets/js/firebase-config.js`.
4. Enable **Authentication > Sign-in method > Email/Password**.
5. Create the admin user under **Authentication > Users**.
6. Enable **Firestore Database**.
7. Create the database in production mode.
8. Deploy the website to a host that serves ES modules over HTTPS (Firebase Hosting, Netlify, Vercel or similar).
9. Add the Firestore security rules below.

### Firestore security rules

Use these rules so the public can create enquiries, but only signed-in users can read/delete them.

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /enquiries/{enquiryId} {
      allow create: if
        request.resource.data.name is string &&
        request.resource.data.email is string &&
        request.resource.data.message is string;

      allow read, delete: if request.auth != null;
      allow update: if false;
    }
  }
}
```

## Important production hardening

For a real business site, do not give the admin account to anyone who does not need it. Add a second layer of authorisation before expanding the dashboard. The simplest improvement is to store an `admins` collection and only allow users whose UID exists there to read/delete enquiries.

Also replace the placeholder phone number, email address, team names and photographs.

## Recommended structure

culleys-construction-landscaping/
- index.html
- construction.html
- landscaping.html
- about.html
- contact.html
- admin.html
- assets/css/style.css
- assets/js/main.js
- assets/js/contact.js
- assets/js/admin.js
- assets/js/firebase-config.js
- README.md
