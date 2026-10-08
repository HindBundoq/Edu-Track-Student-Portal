# EduTrack Student Portal

A responsive student portal. A student can create an account, log in, and see
their profile, courses, teachers and scores.

Built with HTML, CSS and vanilla JavaScript (ES6 modules), with json-server as
a mock API and Web Storage for the session. No frameworks.

---

## Screenshots

**Registration**
![Registration page](screenshots/register.jpg)

**Login**
![Login page](screenshots/login.jpg)

**Dashboard**
![Dashboard](screenshots/dashboard.jpg)

**Editing the profile**
![Edit profile](screenshots/profile-edit.jpg)

**On a phone**
![Mobile view](screenshots/mobile.jpg)

---

## Getting started

You need [Node.js](https://nodejs.org/) installed.

**1. Clone the project**

```bash
git clone https://github.com/HindBundoq/Edu-Track-Student-Portal.git
cd Edu-Track-Student-Portal
```

**2. Start the API** and leave the terminal open

```bash
npx json-server@0.17.4 db.json --port 3000
```

**3. Open `index.html`** with the Live Server extension in VS Code.

**4. Log in** with a demo account, or register a new one.

| Email | Password |
|---|---|
| `hind@example.com` | `Hind@123` |
| `omar@example.com` | `Omar@123` |

> Note: run json-server without `--watch`. It writes to `db.json` itself, and
> with that flag it can reload its own half written file and lose data.

---

## json-server

`db.json` has four tables and json-server turns each one into an endpoint.

| Method | Endpoint | Used for |
|---|---|---|
| `GET` | `/students?email=...` | Check an email is not taken |
| `GET` | `/students?studentNumber=...` | Check a student ID is not taken |
| `POST` | `/students` | Create an account |
| `PATCH` | `/students/:id` | Save profile changes |
| `GET` | `/enrollments?studentNumber=...` | One student's courses and scores |
| `GET` | `/courses` | Course titles and their teacher |
| `GET` | `/teachers` | Teacher names |

All requests live in `js/modules/api.js`, so the server address is written once.

---

## Features

**Registration**
- Validates required fields, email format, password length and matching passwords
- Checks the email and student ID against the API so they stay unique
- Saves the student and redirects to the login page

**Login and session**
- Checks credentials against the API, with clear error messages
- Stores the student's id, name, email, student number and login time
- Remember me saves the session in `localStorage`, otherwise in `sessionStorage`
- Signed out visitors cannot open the dashboard, and signed in students are
  redirected away from the login and register pages

**Dashboard and profile**
- Welcome message and profile details
- Table of enrolled courses with the teacher and the score
- Edit profile updates the name and email, and the open session with them
- The student ID is read only because it is given by the academy
- Logout clears the session and returns to the login page

**Bonus**
- Show / hide password on the login and registration pages

---

## Project structure

```
├── index.html              Login
├── register.html
├── dashboard.html
├── db.json
├── css/
│   ├── main.css            Theme variables and shared styles
│   ├── auth.css            Login and register
│   └── dashboard.css
├── js/
│   ├── modules/            api, validation, session, passwordToggle
│   └── pages/              one file per page
└── screenshots/
```

---

**Hind Bundoq** — Orange Coding Academy
