import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino'
import { TransportController } from './transport/transport.controller';
import { Transport } from './transport';
import { TransportService } from './transport/transport.service';
import { ConfigModule } from '@nestjs/config';
import { TransportModule } from './transport/transport.module';
import { StationsController } from './stations/stations.controller';
import { StationsModule } from './stations/stations.module';
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
  providers: [AppService, Transport, TransportService],
})

export class AppModule { }
