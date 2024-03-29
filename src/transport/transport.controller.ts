import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransportBodyRequestDto } from './dto/transport.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransportService } from './transport.service';
import { AxiosResponse } from 'axios';

@Controller('transport')
export class TransportController {
    constructor(private readonly TransportService: TransportService) { }

    @Post()
    @UsePipes(ValidationPipe)
    getTransportData(@Body() transportBodyRequestDto: TransportBodyRequestDto): Promise<AxiosResponse<any>> {
        return this.TransportService.getTransportData(transportBodyRequestDto)
    }
}
