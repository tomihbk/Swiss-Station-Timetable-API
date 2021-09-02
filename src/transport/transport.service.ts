import { NotFoundException, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TransportBodyRequestDto } from './dto/transport.dto';
import axios, { AxiosResponse } from 'axios';
import { OTDXmlBody } from './util/otd-body-builder';
import { XmlToJsonResponse } from './util/otd-xmltojson-parser'

@Injectable()
export class TransportService {
    constructor(private readonly logger: Logger) { }
    private response: AxiosResponse;
    private isItDeparture: boolean

    async getDataOTD(xmlData: string) {
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
            if (!this.response.data.includes("STOPEVENT_NOEVENTFOUND")) {
                return new XmlToJsonResponse(this.response.data, this.isItDeparture).convertXmlToJson();
            } else {
                throw new NotFoundException()
            }
        } catch (err) {
            this.logger.error(err)
            return err
        }
    }

    async getTransportData(transportBodyRequestDto: TransportBodyRequestDto): Promise<AxiosResponse> {
        this.isItDeparture = transportBodyRequestDto.ArrivalOrDepature === "departure"
        const body = new OTDXmlBody(transportBodyRequestDto);
        return this.getDataOTD(body.getXmlBody())
    }
}