import { Controller, Get } from '@nestjs/common';
import { StationsService } from './stations.service';
import * as STATION_LIST from './data/stationlist.json'

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) { }
    
  @Get('all')
  fetchAllStations(){
    return STATION_LIST
  }
}