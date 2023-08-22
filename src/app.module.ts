import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino'
import { TransportController } from './transport/transport.controller';
import { TransportService } from './transport/transport.service';
import { ConfigModule } from '@nestjs/config';
import { TransportModule } from './transport/transport.module';
import { StationsController } from './stations/stations.controller';
import { StationsModule } from './stations/stations.module';
import { StationsService } from './stations/stations.service';
//process.env.NODE_ENV === 'development' ? 
@Module({
  imports: [LoggerModule.forRoot({
    pinoHttp: {
      prettyPrint: {
        colorize: true,
        levelFirst: true
      }
    }
  }), ConfigModule.forRoot(), TransportModule, StationsModule],
  controllers: [AppController, TransportController, StationsController],
  providers: [AppService, TransportService, StationsService],
})

export class AppModule { }
