// Quick verification script to check managers in database
// Run with: npx ts-node verify-managers.ts

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

async function verify() {
  try {
    await AppDataSource.initialize();
    
    const managers = await AppDataSource.getRepository(Manager).find();
    
    console.log('✅ Managers in database:');
    managers.forEach(m => {
      console.log(`
  Name: ${m.name}
  Email: ${m.email}
  Role: ${m.role}
  Password: ${m.password}
  Phone: ${m.phone}
  ---`);
    });

    if (managers.length === 0) {
      console.log('❌ No managers found in database!');
    } else {
      console.log(`\n✅ Total managers: ${managers.length}`);
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verify();
