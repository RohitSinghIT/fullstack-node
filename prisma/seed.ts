import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@bringfresh.com' },
    update: {},
    create: {
      email: 'superadmin@bringfresh.com',
      name: 'Super Admin',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Create Vendors
  const vendor1 = await prisma.vendor.upsert({
    where: { id: 'vendor-1' },
    update: {},
    create: {
      id: 'vendor-1',
      name: 'Fresh Groceries Co.',
      description: 'Premium fresh groceries and organic products',
      logo: 'https://example.com/logo1.png',
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { id: 'vendor-2' },
    update: {},
    create: {
      id: 'vendor-2',
      name: 'Organic Market',
      description: '100% organic and natural products',
      logo: 'https://example.com/logo2.png',
    },
  });

  // Create Vendor Users
  const vendor1Password = await bcrypt.hash('vendor123', 10);
  const vendor1User = await prisma.user.upsert({
    where: { email: 'vendor1@bringfresh.com' },
    update: {},
    create: {
      email: 'vendor1@bringfresh.com',
      name: 'Vendor One',
      password: vendor1Password,
      role: UserRole.VENDOR,
      vendorId: vendor1.id,
    },
  });

  const vendor2Password = await bcrypt.hash('vendor123', 10);
  const vendor2User = await prisma.user.upsert({
    where: { email: 'vendor2@bringfresh.com' },
    update: {},
    create: {
      email: 'vendor2@bringfresh.com',
      name: 'Vendor Two',
      password: vendor2Password,
      role: UserRole.VENDOR,
      vendorId: vendor2.id,
    },
  });

  // Create Teams
  const team1 = await prisma.team.upsert({
    where: { id: 'team-1' },
    update: {},
    create: {
      id: 'team-1',
      name: 'Sales Team',
      vendorId: vendor1.id,
    },
  });

  const team2 = await prisma.team.upsert({
    where: { id: 'team-2' },
    update: {},
    create: {
      id: 'team-2',
      name: 'Marketing Team',
      vendorId: vendor1.id,
    },
  });

  // Create Products
  const product1 = await prisma.product.upsert({
    where: { id: 'product-1' },
    update: {},
    create: {
      id: 'product-1',
      name: 'Organic Apples',
      description: 'Fresh organic apples from local farms',
      category: 'Fruits',
      brand: 'Fresh Farm',
      images: ['https://example.com/apple1.jpg', 'https://example.com/apple2.jpg'],
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: 'product-2' },
    update: {},
    create: {
      id: 'product-2',
      name: 'Whole Grain Bread',
      description: 'Freshly baked whole grain bread',
      category: 'Bakery',
      brand: 'Bakery Fresh',
      images: ['https://example.com/bread1.jpg'],
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: 'product-3' },
    update: {},
    create: {
      id: 'product-3',
      name: 'Organic Milk',
      description: 'Pure organic milk from grass-fed cows',
      category: 'Dairy',
      brand: 'Organic Valley',
      images: ['https://example.com/milk1.jpg'],
    },
  });

  // Create Product Variants
  const variant1 = await prisma.productVariant.upsert({
    where: { id: 'variant-1' },
    update: {},
    create: {
      id: 'variant-1',
      productId: product1.id,
      name: 'Size',
      value: '1kg',
      sku: 'APPLE-1KG',
      stock: 100,
    },
  });

  const variant2 = await prisma.productVariant.upsert({
    where: { id: 'variant-2' },
    update: {},
    create: {
      id: 'variant-2',
      productId: product1.id,
      name: 'Size',
      value: '500g',
      sku: 'APPLE-500G',
      stock: 50,
    },
  });

  const variant3 = await prisma.productVariant.upsert({
    where: { id: 'variant-3' },
    update: {},
    create: {
      id: 'variant-3',
      productId: product2.id,
      name: 'Size',
      value: '400g',
      sku: 'BREAD-400G',
      stock: 75,
    },
  });

  const variant4 = await prisma.productVariant.upsert({
    where: { id: 'variant-4' },
    update: {},
    create: {
      id: 'variant-4',
      productId: product3.id,
      name: 'Size',
      value: '1L',
      sku: 'MILK-1L',
      stock: 200,
    },
  });

  // Create Vendor Products
  const vendorProduct1 = await prisma.vendorProduct.upsert({
    where: { id: 'vp-1' },
    update: {},
    create: {
      id: 'vp-1',
      vendorId: vendor1.id,
      productId: product1.id,
    },
  });

  const vendorProduct2 = await prisma.vendorProduct.upsert({
    where: { id: 'vp-2' },
    update: {},
    create: {
      id: 'vp-2',
      vendorId: vendor1.id,
      productId: product2.id,
    },
  });

  const vendorProduct3 = await prisma.vendorProduct.upsert({
    where: { id: 'vp-3' },
    update: {},
    create: {
      id: 'vp-3',
      vendorId: vendor2.id,
      productId: product1.id,
    },
  });

  const vendorProduct4 = await prisma.vendorProduct.upsert({
    where: { id: 'vp-4' },
    update: {},
    create: {
      id: 'vp-4',
      vendorId: vendor2.id,
      productId: product3.id,
    },
  });

  // Create Vendor Prices
  await prisma.vendorPrice.upsert({
    where: { id: 'price-1' },
    update: {},
    create: {
      id: 'price-1',
      vendorProductId: vendorProduct1.id,
      variantId: variant1.id,
      price: 4.99,
      comparePrice: 5.99,
    },
  });

  await prisma.vendorPrice.upsert({
    where: { id: 'price-2' },
    update: {},
    create: {
      id: 'price-2',
      vendorProductId: vendorProduct1.id,
      variantId: variant2.id,
      price: 2.99,
      comparePrice: 3.49,
    },
  });

  await prisma.vendorPrice.upsert({
    where: { id: 'price-3' },
    update: {},
    create: {
      id: 'price-3',
      vendorProductId: vendorProduct2.id,
      variantId: variant3.id,
      price: 3.49,
      comparePrice: 3.99,
    },
  });

  await prisma.vendorPrice.upsert({
    where: { id: 'price-4' },
    update: {},
    create: {
      id: 'price-4',
      vendorProductId: vendorProduct3.id,
      variantId: variant1.id,
      price: 5.49,
      comparePrice: 6.49,
    },
  });

  await prisma.vendorPrice.upsert({
    where: { id: 'price-5' },
    update: {},
    create: {
      id: 'price-5',
      vendorProductId: vendorProduct4.id,
      variantId: variant4.id,
      price: 4.99,
      comparePrice: 5.99,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Super Admin: superadmin@bringfresh.com / superadmin123');
  console.log('📧 Vendor 1: vendor1@bringfresh.com / vendor123');
  console.log('📧 Vendor 2: vendor2@bringfresh.com / vendor123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 