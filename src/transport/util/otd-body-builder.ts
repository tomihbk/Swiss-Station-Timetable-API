import { TransportBodyRequestDto } from "../dto/transport.dto";
import JsonRequestBodyModel from "../data/request-body.model"
import { Builder } from "xml2js"

export class OTDXmlBody {
    body: TransportBodyRequestDto
    xmlBody: string

    constructor(TransportBodyRequestDto: TransportBodyRequestDto) {
        this.body = TransportBodyRequestDto
        this.buildXmlBody()
    }

    buildXmlBody() {
        const serviceRequest = JsonRequestBodyModel.OJP.OJPRequest[0].ServiceRequest[0]

        // This feeds RequestTimestamp with the current zulu time
        serviceRequest.RequestTimestamp[0] = serviceRequest['ojp:OJPStopEventRequest'][0].RequestTimestamp[0] = this.body.RequestCurrentTimeStamp

        // reference of the requested api
        serviceRequest.RequestorRef[0] = this.body.RequestorReference

        // This will give the id of the stop station thanks to BAV_liste
        // https://opentransportdata.swiss/en/dataset/bav_liste
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Location'][0]['ojp:PlaceRef'][0]['ojp:StopPlaceRef'][0] = this.body.StopPlaceReference

        // Sets the Depature or Arrival time for the requested station
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Location'][0]['ojp:DepArrTime'][0] = this.body.ArrivalOrDepatureTime

        // Sets the number of results we want
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Params'][0]['ojp:NumberOfResults'][0] = this.body.NumberOfResult

        // Sets if the request is for departure or arrival from a certain stop
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Params'][0]['ojp:StopEventType'][0] = this.body.ArrivalOrDepature

        // Sets if previous station data should be included
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Params'][0]["ojp:IncludePreviousCalls"][0] = this.body.IncludePreviousCalls

        // Sets if real time data should be included
        serviceRequest['ojp:OJPStopEventRequest'][0]['ojp:Params'][0]["ojp:IncludeRealtimeData"][0] = this.body.EnableRealTimeData

        const builder = new Builder({ xmldec: { version: '1.0', encoding: 'UTF-8', standalone: false } });
        this.xmlBody = builder.buildObject(JsonRequestBodyModel)
    }

    getXmlBody(): string {
        return this.xmlBody;
    }
}