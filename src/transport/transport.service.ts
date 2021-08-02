import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TransportBodyRequestDto } from './dto/transport.dto';
import axios, { AxiosResponse } from 'axios';
import { OTDXmlBody } from './util/otd-body-builder';

@Injectable()
export class TransportService {
    constructor(private readonly logger: Logger) { }
    private response: AxiosResponse;

    async getDataOTD(xmlData: string): Promise<AxiosResponse> {
        try {
            this.response = await axios({
                method: 'post',
                url: process.env.OPEN_TRANSPORT_DATA_API_URL,
                headers: {
                    'Content-Type': 'application/xml',
                    'Authorization': 'Bearer ' + process.env.OPEN_TRANSPORT_DATA_API_TOKEN
                },
                data: xmlData
            })
            return this.response.data
        } catch (err) {
            this.logger.error(err)
            return err
        }
    }

    async getTransportData(transportBodyRequestDto: TransportBodyRequestDto): Promise<AxiosResponse> {
        const body = new OTDXmlBody(transportBodyRequestDto);
        return this.getDataOTD(body.getXmlBody())
    }
}