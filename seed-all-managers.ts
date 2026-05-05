// Script to seed all 3 managers
// Run with: npx ts-node seed-all-managers.ts

import { DataSource } from 'typeorm';
import { Manager, ManagerRole } from './src/entities/manager.entity';
import { Approval } from './src/entities/approval.entity';
import { Review } from './src/entities/review.entity';
import { Project } from './src/entities/project.entity';
import { Document } from './src/entities/document.entity';
import { TeamMember } from './src/entities/team-member.entity';
import { Invoice } from './src/entities/invoice.entity';
import { Notification } from './src/entities/notification.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'vdms_db',
  entities: [Manager, Approval, Review, Project, Document, TeamMember, Invoice, Notification],
  synchronize: false,
  logging: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    
    const managerRepo = AppDataSource.getRepository(Manager);
    
    console.log('🗑️ Deleting existing managers...');
    const allManagers = await managerRepo.find();
    if (allManagers.length > 0) {
      await managerRepo.remove(allManagers);
    }
    
    const managers = [
      {
        name: 'MD Director',
        email: 'l1.manager@vdms.com',
        password: 'password123',
        role: ManagerRole.L1,
        phone: '+94771234567',
        isActive: true,
      },
      {
        name: 'AGM Officer',
        email: 'l2.manager@vdms.com',
        password: 'password123',
        role: ManagerRole.L2,
        phone: '+94771234568',
        isActive: true,
      },
      {
        name: 'Senior Valuator',
        email: 'l3.manager@vdms.com',
        password: 'password123',
        role: ManagerRole.L3,
        phone: '+94771234569',
        isActive: true,
      },
    ];

    console.log('📝 Seeding managers...');
    for (const manager of managers) {
      const newManager = managerRepo.create(manager);
      await managerRepo.save(newManager);
      console.log(`✅ Created: ${manager.email} (${manager.role})`);
    }

    console.log('\n✅ All managers seeded successfully!');
    
    const seededManagers = await managerRepo.find();
    console.log(`\n📊 Total managers in database: ${seededManagers.length}`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

seed();
