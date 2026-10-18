# mern-social-auth
social-auth-app/
├── backend/
│   ├── package.json
│   ├── server.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config/db.ts
│   │   ├── controllers/authController.ts
│   │   ├── middleware/authMiddleware.ts
│   │   ├── models/User.ts
│   │   ├── routes/authRoutes.ts
│   │   └── socket/socketHandler.ts
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── store/
        │   ├── index.ts
        │   └── authSlice.ts
        ├── services/
        │   └── authApi.ts
        └── components/
            ├── Login.tsx
            └── Dashboard.tsx
