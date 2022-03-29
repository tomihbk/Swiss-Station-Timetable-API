import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino'
import { TransportController } from './transport/transport.controller';
import { Transport } from './transport';
import { TransportService } from './transport/transport.service';
import { ConfigModule } from '@nestjs/config';
import { TransportModule } from './transport/transport.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';
//process.env.NODE_ENV === 'development' ? 
@Module({
  imports: [TerminusModule ,LoggerModule.forRoot({
    pinoHttp: {
      prettyPrint: {
        colorize: true,
        levelFirst: true
      }
    }
  }), ConfigModule.forRoot(), TransportModule],
  controllers: [AppController, TransportController, HealthController],
  providers: [AppService, Transport, TransportService],
})

export class AppModule { }
