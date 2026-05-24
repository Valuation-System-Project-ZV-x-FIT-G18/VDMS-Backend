import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { User } from '../entities/user.entity'; // needed to look up user by NIC
import { PropertyInformationController } from './property-information.controller';
import { PropertyInformationService } from './property-information.service';

@Module({
  imports: [TypeOrmModule.forFeature([Property, User])], // register both repos
  controllers: [PropertyInformationController],
  providers: [PropertyInformationService],
})
export class PropertyInformationModule {}
