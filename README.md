# Backend

A modern GraphQL API built with TypeScript, Apollo Server, Prisma ORM, and PostgreSQL for the e-commerce platform.

## 🚀 Features

- **GraphQL API** with Apollo Server
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **GraphQL Code Generator** for type generation
- **JWT Authentication** with secure token handling
- **Domain-driven architecture** with organized resolvers
- **Comprehensive CRUD operations**
- **Error handling and validation**
- **Security middleware** (Helmet, CORS)
- **Health check endpoints**

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/bringfresh_db?schema=public"
   PORT=4000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database
   npm run prisma:seed
   
   # (Optional) Open Prisma Studio to view/edit data
   npm run prisma:studio
   ```

4. **Generate GraphQL types:**
   ```bash
   npm run codegen
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📊 API Endpoints

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **Health Check**: `http://localhost:4000/health`

## 🏗️ Project Structure

```
backend/
├── 📁 src/
│   ├── 📁 graphql/
│   │   ├── 📁 schema/
│   │   │   ├── index.ts              # Main schema aggregator
│   │   │   ├── scalers.graphql       # Custom scalar definitions
│   │   │   ├── outputs.graphql       # GraphQL type definitions
│   │   │   ├── inputs.graphql        # Input type definitions
│   │   │   ├── queries.graphql       # Query definitions
│   │   │   └── mutations.graphql     # Mutation definitions
│   │   ├── 📁 resolvers/
│   │   │   ├── index.ts              # Main resolvers aggregator
│   │   │   ├── 📁 auth/
│   │   │   │   ├── index.ts          # Auth resolvers
│   │   │   │   ├── 📁 queries/
│   │   │   │   │   ├── index.ts      # Auth queries aggregator
│   │   │   │   │   └── me.ts         # Individual me query
│   │   │   │   └── 📁 mutations/
│   │   │   │       ├── index.ts      # Auth mutations aggregator
│   │   │   │       ├── login.ts      # Individual login mutation
│   │   │   │       ├── signup.ts     # Individual signup mutation
│   │   │   │       ├── logout.ts     # Individual logout mutation
│   │   │   │       ├── forgotPassword.ts
│   │   │   │       ├── resetPassword.ts
│   │   │   │       ├── changePassword.ts
│   │   │   │       └── acceptPrivacyPolicy.ts
│   │   │   └── 📁 users/
│   │   │       ├── index.ts          # User resolvers
│   │   │       ├── 📁 queries/
│   │   │       │   ├── index.ts      # User queries aggregator
│   │   │       │   ├── getUsers.ts   # Individual getUsers query
│   │   │       │   └── getUser.ts    # Individual getUser query
│   │   │       └── 📁 mutations/
│   │   │           ├── index.ts      # User mutations aggregator
│   │   │           ├── createUser.ts # Individual createUser mutation
│   │   │           ├── updateUser.ts # Individual updateUser mutation
│   │   │           └── deleteUser.ts # Individual deleteUser mutation
│   ├── 📁 middleware/
│   │   └── auth.ts                   # JWT authentication middleware
│   ├── 📁 lib/
│   │   └── prisma.ts                 # Prisma client configuration
│   ├── 📁 types/
│   │   └── context.ts                # GraphQL context types
│   └── index.ts                      # Main server entry point
├── 📁 prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seed data
├── 📁 generated/                     # Generated GraphQL types (auto-created)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── codegen.yml                       # GraphQL Code Generator config
├── env.example                       # Environment variables template
├── .env                              # Environment variables (create from template)
├── .gitignore                        # Git ignore rules
├── Dockerfile                        # Docker configuration
├── docker-compose.yml                # Docker Compose setup
├── setup.sh                          # Automated setup script
├── README.md                         # Project documentation
└── PROJECT_STRUCTURE.md              # This file
```

## 🗄️ Database Schema

The application currently includes the following model:

- **User**: Customer accounts with roles (ADMIN, CUSTOMER, DELIVERY_PARTNER)

Additional models (Product, Order, Review, Address) can be added as needed for future features.

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio
- `npm run codegen` - Generate GraphQL types
- `npm run codegen:watch` - Watch mode for GraphQL codegen

## 📝 GraphQL Queries & Mutations

### Authentication
```graphql
# Login
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    user {
      id
      email
      name
    }
    token
  }
}

# Register
mutation {
  register(input: {
    email: "user@example.com"
    name: "John Doe"
    password: "password123"
    confirmPassword: "password123"
  }) {
    user {
      id
      email
      name
    }
    token
  }
}
```

### Users
```graphql
# Get all users
query {
  users {
    id
    email
    name
    role
  }
}

# Get current user
query {
  me {
    id
    email
    name
    role
  }
}
```



## 🔐 Authentication

The API uses JWT-based authentication:

1. **Login/Register** to get a token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Protected resolvers** will check for valid user context

### Protected Routes
- `me` query
- User mutations (create, update, delete)
- Review mutations
- Address mutations

## 🧪 Testing

To add testing:

1. Install testing dependencies:
   ```bash
   npm install --save-dev jest @types/jest ts-jest
   ```

2. Create test files in `src/__tests__/`

## 📦 Deployment

### Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database URL
- Set up proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 