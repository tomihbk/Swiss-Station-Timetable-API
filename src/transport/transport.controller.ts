import { Body, Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransportBodyRequestDto } from './dto/transport.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
    constructor(private readonly TransportService: TransportService) { }

    @Get()
    @UsePipes(ValidationPipe)
    getTransportData(@Body() transportBodyRequestDto: TransportBodyRequestDto): any {
        return this.TransportService.getTransportData(transportBodyRequestDto)
    }
}
