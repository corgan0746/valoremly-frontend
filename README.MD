# Valoremly E-Commerce Front-end

## Overview

This project is a front-end application built with React, Zustand state management, and TanStack React Query. It offers a user-friendly experience for publishing items, specifying their prices, and proposing exchanges with other users.

## Features

### 1. Responsive Design

-   Mobile-focused with a responsive design for optimal user experience on various devices.

### 2. User Authentication

-   Secure login and registration functionality.
-   Account verification via email with an activation link.

### 3. Token-based Authentication

-   Authentication through JWT (JSON Web Token) for enhanced security.
-   CSRF token changes after every post request, enhancing security measures.
-   Tokens stored in the app state.

### 4. Item Search and Pagination

-   Search items using a search bar.
-   Navigate through search results with a pagination element.

### 5. Trade Offers

-   Users can offer trades to others for their listed items.
-   Exchange window displays user and item details, supporting drag-and-drop functionality.
-   Real-time sum-up of trade values for easy comparison.

### 6. Notifications

-   Receive notifications for various events:
    -   Offer received for your items.
    -   Offer rejected from another user.
    -   Offer accepted for your items.
    -   Message received from another user.

### 7. Message Handling

-   Messages related to offers persist until the deal is closed (14 days).
-   After closing, related messages are deleted, and items are frozen (not visible to others).

### 8. User Account Menu

-   Access a comprehensive account menu with options to view:
    -   Offers sent.
    -   Offers received.
    -   User's listed items.
    -   Sealed (completed) offers.

### 9. Item Management

-   Easily add items from the user's menu.
-   Include item details such as name, price, category, description, and image.
-   Images are converted to webp format and uploaded to a secure bucket for display.

##

**Technologies Used:**

-   **React:** A powerful JavaScript library for building interactive user interfaces.
-   **Zustand:** A state management library for React applications, providing simplicity and performance.
-   **React Query (TanStack):** A data fetching library for React applications, enabling seamless and efficient data management.
##
**Getting Started:**

-   Clone the repository.
-   Install dependencies: `npm install`.
-   Run the development server: `npm run dev`.
-   Explore the platform at `http://localhost:5173`.
-   Environment variables
VITE_BACKEND_URL -> Backend URL
VITE_AWS_BUCKET -> Aws S3 Bucket URL 

##
**Notes:**
- There might be some functionalities and scheduled processes that do not work properly
- Currently paused to updates due to lack of types in both Frontend and Backend will work on it again after learning Nest.js for the backend and reinforce my knowledge about React.
##
**License:**
-This project is dual-licensed under the following licenses: -

 - [MIT License](https://opensource.org/licenses/MIT): For general use.
 - [Creative Commons Attribution-NonCommercial License (CC BY-NC)](https://creativecommons.org/licenses/by-nc/4.0/): For non-commercial use. Please review the specific terms and conditions of each license before using or contributing to this project.


