# BringFresh GraphQL API Documentation

## Overview

This document describes the comprehensive GraphQL API for the BringFresh application, built with Prisma, Node.js, and TypeScript. The API provides full CRUD operations for all major entities in the system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Schema Overview](#schema-overview)
4. [Queries](#queries)
5. [Mutations](#mutations)
6. [Types](#types)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Prisma CLI

### Installation

```bash
npm install
npx prisma generate
npx prisma db push
```

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bringfresh_db"
JWT_SECRET="your-secret-key"
```

## Authentication

The API uses JWT-based authentication. Most mutations require a valid JWT token in the Authorization header.

```graphql
# Login
mutation {
  login(input: { email: "user@example.com", password: "password" }) {
    user {
      id
      name
      email
    }
    token
  }
}
```

## Schema Overview

The API includes the following major entities:

- **Users** - System users with roles and permissions
- **Customers** - End customers of the platform
- **Products** - Products with variants and categories
- **Vendors** - Product suppliers
- **Orders** - Customer orders with delivery tracking
- **Categories** - Product categorization
- **Wishlists** - Customer wishlists
- **Wallets** - Customer wallet transactions
- **Reviews** - Product reviews and ratings
- **Delivery** - Delivery boys and areas
- **Notifications** - System notifications
- **Configs** - System configuration

## Queries

### User Queries

```graphql
# Get current user profile
query {
  me {
    id
    name
    email
    status
    # ... other fields
  }
}

# Get all users
query {
  users {
    id
    name
    email
    status
    createdAt
  }
}

# Get specific user
query {
  user(id: "1") {
    id
    name
    email
    # ... other fields
  }
}
```

### Customer Queries

```graphql
# Get all customers
query {
  customers {
    id
    firstName
    lastName
    email
    mobile
    balance
    status
  }
}

# Get customer by email
query {
  customerByEmail(email: "customer@example.com") {
    id
    firstName
    lastName
    # ... other fields
  }
}

# Get customer by mobile
query {
  customerByMobile(mobile: "+1234567890") {
    id
    firstName
    lastName
    # ... other fields
  }
}
```

### Product Queries

```graphql
# Get all products
query {
  products {
    id
    name
    sku
    status
    rating
    variants {
      id
      varient
      rate
    }
  }
}

# Get featured products
query {
  featuredProducts {
    id
    name
    coverImage
    rating
  }
}

# Search products
query {
  searchProducts(query: "organic") {
    id
    name
    sku
    brand
  }
}

# Get products by category
query {
  productsByCategory(categoryId: "1") {
    id
    name
    sku
    status
  }
}
```

### Category Queries

```graphql
# Get all categories
query {
  categories {
    id
    name
    subName
    image
    featured
    orderIndex
  }
}

# Get featured categories
query {
  featuredCategories {
    id
    name
    image
    orderIndex
  }
}
```

### Vendor Queries

```graphql
# Get all vendors
query {
  vendors {
    id
    storeName
    storeAddress
    status
    rating
    totalProducts
    totalOrders
  }
}

# Get vendor by ID
query {
  vendor(id: "1") {
    id
    storeName
    storeAddress
    # ... other fields
  }
}
```

### Order Queries

```graphql
# Get all orders
query {
  orders {
    id
    orderId
    orderDate
    amount
    paymentStatus
    customer {
      firstName
      lastName
    }
    vendor {
      storeName
    }
  }
}

# Get orders by customer
query {
  ordersByCustomer(customerId: "1") {
    id
    orderId
    orderDate
    amount
    status
  }
}
```

### Wishlist Queries

```graphql
# Get customer wishlist
query {
  wishlistByCustomer(customerId: "1") {
    id
    quantity
    vendorProduct {
      product {
        name
        coverImage
      }
      vendor {
        storeName
      }
    }
  }
}
```

### Wallet Queries

```graphql
# Get customer wallet
query {
  walletByCustomer(customerId: "1") {
    id
    transactionType
    amount
    totalAmount
    title
    createdAt
  }
}
```

### Review Queries

```graphql
# Get product reviews
query {
  reviewsByProduct(productId: "1") {
    id
    rating
    review
    customer {
      firstName
      lastName
    }
    createdAt
  }
}
```

### Delivery Queries

```graphql
# Get all delivery boys
query {
  deliveryBoys {
    id
    vehicleType
    isOnline
    isAvailable
    rating
    totalDeliveries
    user {
      name
      mobile
    }
  }
}

# Get delivery areas
query {
  deliveryAreas {
    id
    pincode
    area
    status
  }
}
```

### Notification Queries

```graphql
# Get all notifications
query {
  notifications {
    id
    title
    body
    type
    isSend
    createdAt
  }
}
```

### Config Queries

```graphql
# Get all configs
query {
  configs {
    id
    keyName
    value
    description
  }
}

# Get specific config
query {
  config(key: "site_name") {
    keyName
    value
    description
  }
}
```

## Mutations

### Authentication Mutations

```graphql
# Signup
mutation {
  signup(input: {
    name: "John Doe"
    email: "john@example.com"
    password: "password123"
    mobile: "+1234567890"
  }) {
    user {
      id
      name
      email
    }
    token
  }
}

# Login
mutation {
  login(input: {
    email: "john@example.com"
    password: "password123"
  }) {
    user {
      id
      name
      email
    }
    token
  }
}

# Logout
mutation {
  logout
}

# Change password
mutation {
  changePassword(input: {
    currentPassword: "oldpassword"
    newPassword: "newpassword"
  })
}
```

### User Mutations

```graphql
# Create user
mutation {
  createUser(input: {
    name: "Jane Doe"
    email: "jane@example.com"
    password: "password123"
    mobile: "+1234567890"
    status: ACTIVE
  }) {
    id
    name
    email
    status
  }
}

# Update user
mutation {
  updateUser(id: "1", input: {
    name: "Jane Smith"
    status: INACTIVE
  }) {
    id
    name
    status
  }
}

# Delete user
mutation {
  deleteUser(id: "1")
}
```

### Customer Mutations

```graphql
# Create customer
mutation {
  createCustomer(input: {
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    mobile: "+1234567890"
    alternateMobile: "+0987654321"
  }) {
    id
    firstName
    lastName
    email
    mobile
    referralCode
  }
}

# Update customer
mutation {
  updateCustomer(id: "1", input: {
    firstName: "Johnny"
    status: ACTIVE
  }) {
    id
    firstName
    lastName
    status
  }
}
```

### Product Mutations

```graphql
# Create product
mutation {
  createProduct(input: {
    name: "Organic Apples"
    productHindiName: "सेब"
    type: PACKED
    sku: "APPLE001"
    tax: 5.0
    brand: "Fresh Farms"
    coverImage: "apple.jpg"
    status: ACTIVE
    featured: true
  }) {
    id
    name
    sku
    status
  }
}

# Update product
mutation {
  updateProduct(id: "1", input: {
    name: "Fresh Organic Apples"
    featured: false
  }) {
    id
    name
    featured
  }
}

# Add product to category
mutation {
  addProductToCategory(productId: "1", categoryId: "1") {
    id
    product {
      name
    }
    category {
      name
    }
  }
}
```

### Category Mutations

```graphql
# Create category
mutation {
  createCategory(input: {
    name: "Fruits"
    subName: "Fresh Fruits"
    hindiName: "फल"
    image: "fruits.jpg"
    featured: true
    orderIndex: 1
  }) {
    id
    name
    featured
    orderIndex
  }
}

# Update category
mutation {
  updateCategory(id: "1", input: {
    name: "Fresh Fruits"
    featured: false
  }) {
    id
    name
    featured
  }
}
```

### Vendor Mutations

```graphql
# Create vendor
mutation {
  createVendor(input: {
    userId: "1"
    storeName: "Fresh Market"
    storeAddress: "123 Main St"
    storeImage: "store.jpg"
    storeUrl: "freshmarket.com"
    gstNumber: "GST123456"
    commissionType: "percentage"
    commissionRate: 10.0
  }) {
    id
    storeName
    status
    rating
  }
}

# Approve vendor
mutation {
  approveVendor(id: "1") {
    id
    prApproval
    status
  }
}
```

### Order Mutations

```graphql
# Create order
mutation {
  createOrder(input: {
    customerId: "1"
    vendorId: "1"
    deliveryBoyId: "1"
    amount: 150.00
    paymentMethod: "COD"
    orderDetails: [
      {
        vendorProductId: "1"
        quantity: 2
        rate: 75.00
      }
    ]
  }) {
    id
    orderId
    amount
    paymentStatus
    orderDetails {
      productName
      qty
      rate
    }
  }
}

# Cancel order
mutation {
  cancelOrder(id: "1") {
    id
    paymentStatus
    cancellationReason
  }
}
```

### Wishlist Mutations

```graphql
# Add to wishlist
mutation {
  addToWishlist(input: {
    customerId: "1"
    vendorProductId: "1"
    quantity: 1
  }) {
    id
    quantity
    vendorProduct {
      product {
        name
      }
    }
  }
}

# Remove from wishlist
mutation {
  removeFromWishlist(id: "1")
}
```

### Wallet Mutations

```graphql
# Add wallet transaction
mutation {
  addWalletTransaction(input: {
    customerId: "1"
    transactionType: CREDIT
    amount: 50.00
    title: "Referral Bonus"
  }) {
    id
    amount
    totalAmount
    title
  }
}
```

### Review Mutations

```graphql
# Create review
mutation {
  createReview(input: {
    customerId: "1"
    productId: "1"
    rating: 5.0
    review: "Great product, very fresh!"
  }) {
    id
    rating
    review
    status
  }
}

# Update review
mutation {
  updateReview(id: "1", input: {
    rating: 4.0
    review: "Good product, but could be better"
  }) {
    id
    rating
    review
  }
}
```

### Delivery Mutations

```graphql
# Create delivery boy
mutation {
  createDeliveryBoy(input: {
    userId: "1"
    vehicleType: BIKE
    vehicleNumber: "MH12AB1234"
    licenseNumber: "DL123456"
    aadharNumber: "123456789012"
  }) {
    id
    vehicleType
    status
    rating
  }
}

# Assign delivery boy to order
mutation {
  assignDeliveryBoy(orderId: "1", deliveryBoyId: "1") {
    id
    status
    assignedAt
    order {
      orderId
    }
    deliveryBoy {
      user {
        name
      }
    }
  }
}
```

### Notification Mutations

```graphql
# Create notification
mutation {
  createNotification(input: {
    title: "Order Update"
    body: "Your order has been delivered"
    type: "order"
    role: "customer"
  }) {
    id
    title
    body
    type
    isSend
  }
}

# Send notification
mutation {
  sendNotification(id: "1")
}
```

### Config Mutations

```graphql
# Create config
mutation {
  createConfig(input: {
    keyName: "site_name"
    value: "BringFresh"
    description: "Website name"
  }) {
    id
    keyName
    value
  }
}

# Update config
mutation {
  updateConfig(key: "site_name", input: {
    value: "FreshBring"
    description: "Updated website name"
  }) {
    keyName
    value
    description
  }
}

# Bulk update configs
mutation {
  bulkUpdateConfigs(configs: [
    { key: "site_name", value: "BringFresh" }
    { key: "contact_email", value: "contact@bringfresh.com" }
  ]) {
    keyName
    value
  }
}
```

## Types

### Core Types

#### User
```graphql
type User {
  id: ID!
  tenantId: UUID!
  uuid: UUID!
  name: String!
  email: String!
  mobile: String
  status: UserStatus!
  profilePicture: String
  dob: DateTime
  twoFactorEnabled: Boolean!
  dataConsent: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  createdBy: User
  createdUsers: [User!]!
  vendorDetails: VendorDetail
  deliveryBoy: DeliveryBoy
  # ... other relations
}
```

#### Customer
```graphql
type Customer {
  id: ID!
  uuid: UUID!
  firstName: String!
  lastName: String!
  email: String
  mobile: String!
  balance: Decimal!
  referralCode: String
  status: CustomerStatus!
  verified: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  addresses: [Address!]!
  wallets: [Wallet!]!
  wishlists: [Wishlist!]!
  orders: [Order!]!
  # ... other relations
}
```

#### Product
```graphql
type Product {
  id: ID!
  name: String!
  productHindiName: String
  type: ProductType!
  sku: String!
  tax: Decimal!
  rating: Decimal!
  status: ProductStatus!
  featured: Boolean!
  isDeleted: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  variants: [ProductVariant!]!
  vendorProducts: [VendorProduct!]!
  categories: [ProductCategory!]!
  # ... other relations
}
```

### Enums

```graphql
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

enum ProductType {
  PACKED
  LOOSE
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  DRAFT
}

enum TransactionType {
  CREDIT
  DEBIT
}

enum VehicleType {
  BIKE
  SCOOTER
  BICYCLE
}
```

### Input Types

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!
  mobile: String
  status: UserStatus
}

input CreateProductInput {
  name: String!
  productHindiName: String
  type: ProductType!
  sku: String!
  tax: Decimal
  brand: String
  coverImage: String
  status: ProductStatus
  featured: Boolean
}

input CreateOrderInput {
  customerId: ID!
  vendorId: ID!
  deliveryBoyId: ID!
  amount: Decimal!
  paymentMethod: String!
  orderDetails: [OrderDetailInput!]!
}
```

## Error Handling

The API uses GraphQL errors with meaningful messages. Common error types:

- **Authentication required** - User not logged in
- **User not found** - Requested resource doesn't exist
- **Validation error** - Invalid input data
- **Permission denied** - User lacks required permissions

Example error response:
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

## Examples

### Complete Order Flow

```graphql
# 1. Create customer
mutation {
  createCustomer(input: {
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    mobile: "+1234567890"
  }) {
    id
    firstName
    lastName
  }
}

# 2. Create product
mutation {
  createProduct(input: {
    name: "Fresh Apples"
    type: PACKED
    sku: "APPLE001"
    tax: 5.0
    status: ACTIVE
  }) {
    id
    name
    sku
  }
}

# 3. Create order
mutation {
  createOrder(input: {
    customerId: "1"
    vendorId: "1"
    deliveryBoyId: "1"
    amount: 100.00
    paymentMethod: "COD"
    orderDetails: [
      {
        vendorProductId: "1"
        quantity: 2
        rate: 50.00
      }
    ]
  }) {
    id
    orderId
    amount
    orderDetails {
      productName
      qty
      rate
    }
  }
}

# 4. Add review
mutation {
  createReview(input: {
    customerId: "1"
    productId: "1"
    rating: 5.0
    review: "Excellent quality!"
  }) {
    id
    rating
    review
  }
}
```

### User Management

```graphql
# 1. Create user
mutation {
  createUser(input: {
    name: "Admin User"
    email: "admin@example.com"
    password: "admin123"
    status: ACTIVE
  }) {
    id
    name
    email
    status
  }
}

# 2. Login
mutation {
  login(input: {
    email: "admin@example.com"
    password: "admin123"
  }) {
    user {
      id
      name
      email
    }
    token
  }
}

# 3. Update user
mutation {
  updateUser(id: "1", input: {
    name: "Super Admin"
    status: ACTIVE
  }) {
    id
    name
    status
  }
}
```

## Best Practices

1. **Always use authentication** for mutations that modify data
2. **Handle errors gracefully** in your client applications
3. **Use pagination** for large data sets (implement with `first` and `after` arguments)
4. **Cache responses** when appropriate
5. **Validate input** on both client and server side
6. **Use descriptive field names** and documentation
7. **Implement rate limiting** for production use
8. **Monitor API usage** and performance

## Development

### Adding New Resolvers

1. Create resolver file in `src/graphql/resolvers/`
2. Export resolver object with Query and/or Mutation
3. Add to main resolver index
4. Update GraphQL schema if needed

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Code Generation

```bash
# Generate Prisma client
npx prisma generate

# Generate GraphQL types (if using codegen)
npm run codegen
```

## Support

For questions or issues:

1. Check the Prisma documentation
2. Review GraphQL best practices
3. Check existing resolver implementations
4. Contact the development team

---

**Note**: This API is designed for the BringFresh application and includes comprehensive functionality for e-commerce, delivery management, and user administration. All mutations include proper authentication and authorization checks.
