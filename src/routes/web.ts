import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { GraphQLClient, QUERIES } from '../utils/graphql-client';

const router = Router();

// Landing page route
router.get('/', (req, res) => {
  res.render('landing', { 
    title: 'Welcome to BringFresh', 
    message: 'Your fresh grocery delivery platform!' 
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About BringFresh', 
    message: 'Learn more about our mission to deliver fresh groceries to your doorstep.' 
  });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us', 
    message: 'Get in touch with our team for any questions or support.' 
  });
});

// Users page - demonstrates calling GraphQL-like queries directly
router.get('/users', async (req, res) => {
  try {
    // This is equivalent to the GraphQL query: { users { id, name, email, role } }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.render('users', { 
      title: 'Users', 
      users,
      message: `Found ${users.length} users` 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('error', { 
      title: 'Error', 
      message: 'Failed to fetch users' 
    });
  }
});

// Users via GraphQL API - demonstrates calling your own GraphQL API
router.get('/users-graphql', async (req, res) => {
  try {
    const graphqlClient = new GraphQLClient();
    const result = await graphqlClient.query(QUERIES.GET_USERS);
    
    res.render('users', { 
      title: 'Users (via GraphQL API)', 
      users: result.users,
      message: `Found ${result.users.length} users via GraphQL API` 
    });
  } catch (error) {
    console.error('Error fetching users via GraphQL:', error);
    res.render('error', { 
      title: 'Error', 
      message: 'Failed to fetch users via GraphQL API' 
    });
  }
});

// User profile page - demonstrates fetching single user
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // This is equivalent to the GraphQL query: { user(id: "userId") { id, name, email, role } }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.render('error', { 
        title: 'User Not Found', 
        message: 'User not found' 
      });
    }

    res.render('user-profile', { 
      title: `Profile - ${user.name}`, 
      user,
      message: 'User profile details' 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.render('error', { 
      title: 'Error', 
      message: 'Failed to fetch user' 
    });
  }
});

// Dashboard page - demonstrates authenticated user data
router.get('/dashboard', async (req, res) => {
  try {
    // In a real app, you'd get the user from session/token
    // For demo, let's get the first admin user
    const currentUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },   
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Get some stats (equivalent to multiple GraphQL queries)
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
    const customerUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    res.render('dashboard', { 
      title: 'Dashboard', 
      currentUser,
      stats: {
        totalUsers,
        adminUsers,
        customerUsers,
      },
      message: 'Welcome to your dashboard' 
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.render('error', { 
      title: 'Error', 
      message: 'Failed to load dashboard' 
    });
  }
});

export default router; 