# BringFresh Backend - Project Structure

```
backend/
├── 📁 src/
│   ├── 📁 graphql/
│   │   ├── 📁 mutations/
│   │   │   └── sample.graphql          # Sample GraphQL mutations
│   │   ├── 📁 queries/
│   │   │   └── sample.graphql          # Sample GraphQL queries
│   │   ├── 📁 resolvers/
│   │   │   ├── index.ts                # Main resolvers aggregator
│   │   │   ├── user.ts                 # User resolvers
│   │   │   ├── product.ts              # Product resolvers
│   │   │   ├── order.ts                # Order resolvers
│   │   │   ├── review.ts               # Review resolvers
│   │   │   └── address.ts              # Address resolvers
│   │   └── schema.ts                   # GraphQL schema definition
│   ├── 📁 lib/
│   │   └── prisma.ts                   # Prisma client configuration
│   ├── 📁 types/
│   │   └── context.ts                  # GraphQL context types
│   └── index.ts                        # Main server entry point
├── 📁 prisma/
│   ├── schema.prisma                   # Database schema
│   └── seed.ts                         # Database seed data
├── 📁 generated/                       # Generated GraphQL types (auto-created)
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── codegen.yml                         # GraphQL Code Generator config
├── env.example                         # Environment variables template
├── .env                                # Environment variables (create from template)
├── .gitignore                          # Git ignore rules
├── Dockerfile                          # Docker configuration
├── docker-compose.yml                  # Docker Compose setup
├── setup.sh                            # Automated setup script
├── README.md                           # Project documentation
└── PROJECT_STRUCTURE.md                # This file
```

## 📋 Key Components

### 🗄️ Database Layer (Prisma)
- **`prisma/schema.prisma`**: Database schema with models for User, Product, Order, Review, Address
- **`prisma/seed.ts`**: Sample data for development and testing
- **`src/lib/prisma.ts`**: Prisma client configuration with connection management

### 🎯 GraphQL Layer
- **`src/graphql/schema.ts`**: Complete GraphQL schema with types, queries, and mutations
- **`src/graphql/resolvers/`**: Organized resolvers by domain (user, product, order, etc.)
- **`src/types/context.ts`**: TypeScript types for GraphQL context

### 🚀 Server Configuration
- **`src/index.ts`**: Express server with Apollo Server integration
- **Security middleware**: Helmet, CORS, compression
- **Error handling**: Global error handlers and GraphQL error formatting
- **Health checks**: `/health` endpoint for monitoring

### 🔧 Development Tools
- **TypeScript**: Full type safety throughout the application
- **GraphQL Code Generator**: Auto-generates TypeScript types from GraphQL schema
- **Hot reload**: Development server with automatic restarts
- **Prisma Studio**: Database GUI for development

## 🏗️ Architecture Patterns

### Domain-Driven Design
- Resolvers organized by business domain
- Clear separation of concerns
- Scalable structure for future features

### Type Safety
- Full TypeScript coverage
- Generated types from GraphQL schema
- Prisma types for database operations

### Security
- Input validation in resolvers
- Authentication-ready context
- Security headers with Helmet
- CORS configuration

## 🔄 Data Flow

1. **Client Request** → GraphQL endpoint
2. **Apollo Server** → Parses and validates query/mutation
3. **Resolvers** → Business logic and data access
4. **Prisma Client** → Database operations
5. **Response** → Formatted GraphQL response

## 📊 Database Models

### User
- Authentication and authorization
- Role-based access (ADMIN, CUSTOMER, DELIVERY_PARTNER)
- Relationships with orders, reviews, addresses

### Product
- Product catalog management
- Stock tracking
- Category organization
- Review relationships

### Order
- Order lifecycle management
- Status tracking (PENDING → DELIVERED)
- Order items with quantities and pricing
- Address relationships

### Review
- Product ratings and comments
- User-product relationships
- Validation (one review per user per product)

### Address
- User delivery addresses
- Default address management
- Order delivery information

## 🚀 Getting Started

1. **Setup**: Run `./setup.sh` for automated setup
2. **Development**: `npm run dev` for hot reload
3. **Database**: `npm run prisma:studio` for database GUI
4. **Types**: `npm run codegen` for GraphQL type generation

## 🔧 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open database GUI
- `npm run codegen` - Generate GraphQL types
- `npm run codegen:watch` - Watch mode for type generation 