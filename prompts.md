# PROMPTS.md

This file contains the raw prompts used during AI-assisted development of the project.

---

## Claude

### Premium Dashboard Styling

I have a React vehicle inventory dashboard that is already functional.

I want to improve the frontend and make it look more premium and professional for a car dealership application.

Please generate CSS styling for:
- a premium dashboard layout
- navbar
- hero section
- statistics cards
- vehicle cards
- search and filter section
- buttons
- forms
- responsive layout
- hover effects

Do not change the application logic. Focus on the CSS and visual styling.

---

### Dashboard UI Refinement

Make the existing vehicle inventory dashboard look more high-end and polished.

Keep the existing functionality and React logic unchanged.

Improve:
- spacing
- typography
- vehicle cards
- buttons
- search filters
- forms
- dashboard sections
- responsive behavior

---

## ChatGPT

### Frontend Search

My backend has the following endpoint:

GET /api/vehicles/search

It supports searching by make, model, category, minimum price, and maximum price.

The frontend already has make, model and category search.

Help me integrate minimum and maximum price filtering into the existing React frontend without changing the existing functionality.

---

### Admin Vehicle Management

The requirement says:

"For Admin Users: Forms/UI to add, update, and delete vehicles."

My frontend currently has add, update and delete functionality.

Help me make sure these controls are shown only to admin users while normal users can still view, search and purchase vehicles.

---

### Backend Authorization Review

Here is my vehicle router:

[vehicle router code]

Check whether adding, updating, deleting and restocking vehicles are restricted to admin users.

Normal authenticated users should receive HTTP 403 when attempting admin-only operations.

Do not restrict viewing, searching or purchasing vehicles.

---

### Project Requirement Review

Review my Car Dealership Inventory System against the given requirements and identify any missing functionality or authorization issues.

The requirements include:
- vehicle CRUD
- vehicle search
- price range filtering
- authentication
- admin authorization
- purchase functionality
- inventory quantity updates
- automated backend tests

---

## Usage Note

AI was used selectively during development for frontend styling, debugging, integration guidance, and requirement review.

The application logic and integration were manually implemented and tested. AI-generated suggestions were reviewed and adapted to the existing project rather than being used as-is.
