import { Body, Controller, Get } from '@nestjs/common';
import { TransportBodyRequestDto } from './dto/transport.dto';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
    constructor(private readonly TransportService: TransportService) { }

    @Get()
    getTransportData(@Body() transportBodyRequestDto: TransportBodyRequestDto): any {
        return this.TransportService.getTransportData(transportBodyRequestDto)
    }
}
