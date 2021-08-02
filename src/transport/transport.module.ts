import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransportController } from './transport.controller'
import { TransportService } from './transport.service';

@Module({
    imports: [HttpModule],
    controllers: [TransportController],
    providers: [TransportService]
})
export class TransportModule { }
