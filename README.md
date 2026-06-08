# Power Pit

## Project Overview

This project involves the development of a web application using React, with the primary focus on frontend development.

### Clone the Repository

To get started, clone the repository into your local environment:

```bash
git clone https://github.com/UTEP-Agile-SP24/team-repository-team-9.git
```

### Usage Guide

#### For Windows Users:

1. Navigate to the root directory of the project.
2. Run the following commands:

    ```bash
    npm install
    npm run dev
    ```

    This will launch the application on your localhost.

#### For Mac Users:

1. After cloning the repository, navigate to the project directory.
2. Execute the following commands:

    ```bash
    npm install
    npm install --global yarn
    npm install yarn
    npm i
    npm run dev
    ```

#### After Each Pull

After pulling changes from the repository, execute the following commands:

```bash
npm install
npm install yarn
npm i
npm run dev
```

## Design Pattern

We have decided to implement the Atomic Design Pattern for this project.

## Debugging

### NPM Errors

#### 'MODULE_NOT_FOUND' Error

If you encounter a 'MODULE_NOT_FOUND' error, follow these steps:

```bash
rm -rf package-lock.json node_modules
npm i
npm run build
npm run dev
```

#### React DOM Issue

If you encounter issues related to react-dom, specifically when dealing with react-router-dom:

1. Uninstall the current version of react-router, react-router-dom, and history:

    ```bash
    npm uninstall -s react-router react-router-dom history
    ```

2. Install react-router-dom v6:

    ```bash
    npm install -s react-router-dom@6
    ```

After these steps, you may still encounter the 'MODULE_NOT_FOUND' error. If so, repeat the steps listed above for that specific error.

## Technical Documentation

This section provides a detailed overview of each portion of our codebase, along with links to Google documents containing further documentation for each component.

### About Page 
- **Description:** This section provides information about the project and its objectives, offering insights into the team's background and vision.
- **Link:** [Google Document](https://docs.google.com/document/d/1eA9ejic46qlJ9MC79oyJ7KpdW2MF1_T97SrTCK_Vda4/edit?usp=sharing)

### Community Page 
- **Description:** This section focuses on building a community around the project, facilitating discussions, and fostering collaboration among users.
- **Link:** [Google Document](https://docs.google.com/document/d/1DcYH511X-g8igkhaoD6aSWJyy5oOJDQ2K1qgThrIxik/edit?usp=sharing)

### Create Account Page 
- **Description:** This page allows users to create a new account to access the features of the platform, providing a seamless onboarding experience.
- **Link:** [Google Document](https://docs.google.com/document/d/1cFLUgrSRtnUpOqtg-QzwLbug59HM_YDJXjZKp_XTJpU/edit?usp=sharing)

### Home Page
- **Description:** The main landing page of the website, providing an overview of the platform's features and functionalities, serving as the entry point for users.
- **Link:** [Google Document](https://docs.google.com/document/d/1QT0LDVboUk7HiXECY1VuJas7eqXqhq3E_ZI6w0is65Y/edit?usp=sharing)

### Landing Page
- **Description:** A landing page designed to attract and inform potential users about the project, highlighting its key features and benefits.
- **Link:** [Google Document](https://docs.google.com/document/d/1E-W9XPDtbTLSV_Cdi-Xv303d3jsb-4-hGI7kHNSgmeM/edit?usp=sharing)

### Log In Page
- **Description:** This page allows existing users to log in to their accounts securely, ensuring smooth access to the platform's services.
- **Link:** [Google Document](https://docs.google.com/document/d/1f8IyUe-bNAsj-9IQ1e5b2Je6ab7KQ6aKufKTu8JTjvI/edit?usp=sharing)

### Manager Page
- **Description:** A section dedicated to project management, enabling managers to oversee tasks, assignments, and progress effectively, enhancing productivity.
- **Link:** [Google Document](https://docs.google.com/document/d/1FUHOSeZBvGyPBKZLpgIkBEGTNdT3Fzzsp9BXriDZ2Vc/edit?usp=sharing)

### Membership Page
- **Description:** This page provides comprehensive information on membership plans and benefits, helping users make informed decisions regarding their subscription.
- **Link:** [Google Document](https://docs.google.com/document/d/1PF7Zl9vORKHJTjIyVXuFaAB8D4Nm36CfoOg9I72xqq8/edit?usp=sharing)

### Choose Membership Page
- **Description:** The 'Choose Membership' page serves as the initial step in the account creation process. 
- **Link:** [Google Document](https://docs.google.com/document/d/1zSpcTfefro2MqaeNzzZmIOc4HUo_0rHTbPzqky7ZNLw/edit)

### Payment / Checkout Page
- **Overview:** The ‘Payment Checkout’' page serves as the final step in the account creation process. It finalizes the process of creating an account by requesting the user to enter their card information for membership purchases.
- **Link:** [Google Document](https://docs.google.com/document/d/1hWwI8wuGXlnPMnpd5aEnAuR0ifi5iU95hxCicc3W4cs/edit)

### Tracker Page Dashboard
- **Description:** A dashboard within the Tracker Page provides an overview of user activities, progress, and performance metrics.
- **Link:** [Google Document](https://docs.google.com/document/d/13DoM37SLcm98hvxS4Z2LchSIbKroWFEq7c_CURI1EzE/edit?usp=drive_link)

### Tracker Page Fitness Calendar
- **Description:** A feature within the Tracker Page allowing users to schedule and track their fitness activities and routines.
- **Link:** [Google Document](https://docs.google.com/document/d/1uD7bjefFfTh4sRfA4nNlVRR-YDn35FT4tGHdwLMgkjg/edit?usp=sharing)
