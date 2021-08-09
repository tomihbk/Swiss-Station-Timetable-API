import { Parser } from "xml2js";

export class XmlToJsonResponse {
    private responseXml: any
    private responseJson: any
    private convertedResponseXmlToJson: any
    private isItDeparture: boolean
    private arrivalEstimatedAvailable: boolean
    private depatureEstimatedAvailable: boolean
    private originPreviousArrivalEstimatedAvailable: boolean
    private originPreviousDepatureEstimatedAvailable: boolean
    private originOnwardArrivalEstimatedAvailable: boolean
    private originOnwardDepatureEstimatedAvailable: boolean

    constructor(resXml: string, isItDeparture: boolean) {
        this.responseXml = resXml
        this.isItDeparture = isItDeparture
        this.responseJson = []
    }

    async convertXmlToJson() {

        const parser = new Parser();

        await parser.parseStringPromise(this.responseXml).then((res) => {
            this.convertedResponseXmlToJson = res
        })

        const StopEventResponseContextLocation = this.convertedResponseXmlToJson["siri:OJP"]["siri:OJPResponse"][0]["siri:ServiceDelivery"][0]["ojp:OJPStopEventDelivery"][0]["ojp:StopEventResponseContext"][0]["ojp:Places"][0]["ojp:Location"][0]

        const StopEventResults = this.convertedResponseXmlToJson["siri:OJP"]["siri:OJPResponse"][0]["siri:ServiceDelivery"][0]["ojp:OJPStopEventDelivery"][0]["ojp:StopEventResult"]

        Object.entries(StopEventResults).forEach(([key, val]) => {

            if (StopEventResults.hasOwnProperty(key)) {

                const CallAtStop = val["ojp:StopEvent"][0]["ojp:ThisCall"][0]["ojp:CallAtStop"][0]

                const PreviousCall = val["ojp:StopEvent"][0].hasOwnProperty("ojp:PreviousCall") ? val["ojp:StopEvent"][0]["ojp:PreviousCall"][0]["ojp:CallAtStop"][0] : undefined

                const lastOnwardCall = val["ojp:StopEvent"][0].hasOwnProperty("ojp:OnwardCall") ? Object.keys(val["ojp:StopEvent"][0]["ojp:OnwardCall"]).length - 1 : 0

                const OnwardCall = val["ojp:StopEvent"][0].hasOwnProperty("ojp:OnwardCall") ? val["ojp:StopEvent"][0]["ojp:OnwardCall"][lastOnwardCall]["ojp:CallAtStop"][0] : undefined

                const StopEventService = val["ojp:StopEvent"][0]["ojp:Service"]

                this.depatureEstimatedAvailable = CallAtStop.hasOwnProperty("ojp:ServiceDeparture") && CallAtStop["ojp:ServiceDeparture"][0].hasOwnProperty("ojp:EstimatedTime")

                this.arrivalEstimatedAvailable = CallAtStop.hasOwnProperty("ojp:ServiceArrival") && CallAtStop["ojp:ServiceArrival"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originPreviousDepatureEstimatedAvailable = PreviousCall != undefined && PreviousCall.hasOwnProperty("ojp:ServiceDeparture") && PreviousCall["ojp:ServiceDeparture"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originPreviousArrivalEstimatedAvailable = PreviousCall != undefined && PreviousCall.hasOwnProperty("ojp:ServiceArrival") && PreviousCall["ojp:ServiceArrival"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originOnwardDepatureEstimatedAvailable = OnwardCall != undefined && OnwardCall.hasOwnProperty("ojp:ServiceDeparture") && OnwardCall["ojp:ServiceDeparture"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originOnwardArrivalEstimatedAvailable = OnwardCall != undefined && OnwardCall.hasOwnProperty("ojp:ServiceArrival") && OnwardCall["ojp:ServiceArrival"][0].hasOwnProperty("ojp:EstimatedTime")

                this.responseJson.push({
                    "result": {
                        "Id": val["ojp:ResultId"][0],
                        "StopEventResponseContext": {
                            "location": {
                                "id": StopEventResponseContextLocation["ojp:StopPlace"][0]["ojp:StopPlaceRef"][0],
                                "name": StopEventResponseContextLocation["ojp:StopPlace"][0]["ojp:StopPlaceName"][0]["ojp:Text"][0],
                                "GeoLocation": {
                                    "latitude": StopEventResponseContextLocation["ojp:GeoPosition"][0]["siri:Latitude"][0],
                                    "longitude": StopEventResponseContextLocation["ojp:GeoPosition"][0]["siri:Longitude"][0]
                                }
                            }
                        },
                        "RequestedStation": {
                            "StartPointRef": CallAtStop["siri:StopPointRef"][0],
                            "StartPoint": CallAtStop["ojp:StopPointName"][0]["ojp:Text"][0],
                            "ServiceDeparture": {
                                "TimetabledTime": this.isItDeparture ? CallAtStop["ojp:ServiceDeparture"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": this.isItDeparture && this.depatureEstimatedAvailable ? CallAtStop["ojp:ServiceDeparture"][0]["ojp:EstimatedTime"][0] : undefined
                            },
                            "ServiceArrival": {
                                "TimetabledTime": !this.isItDeparture ? CallAtStop["ojp:ServiceArrival"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": !this.isItDeparture && this.arrivalEstimatedAvailable ? CallAtStop["ojp:ServiceArrival"][0]["ojp:EstimatedTime"][0] : undefined
                            },
                            "PlannedPlatform": CallAtStop["ojp:PlannedQuay"][0]["ojp:Text"][0]._,
                            "OperatingDay": StopEventService[0]["ojp:OperatingDayRef"][0],
                            "PublishedLineName": StopEventService[0]["ojp:PublishedLineName"][0]["ojp:Text"][0],
                            "TransportMethod": {
                                "PtMode": StopEventService[0]["ojp:Mode"][0]["ojp:PtMode"][0],
                                "RailSubMode": StopEventService[0]["ojp:Mode"][0]["siri:RailSubmode"][0],
                                "TransportName": StopEventService[0]["ojp:Mode"][0]["ojp:Name"][0]["ojp:Text"][0]._,
                                "TransportShortName": StopEventService[0]["ojp:Mode"][0]["ojp:ShortName"][0]["ojp:Text"][0]._
                            }
                        },
                        "Origin": {
                            "IsAvailable": val["ojp:StopEvent"][0].hasOwnProperty("ojp:PreviousCall"),
                            "PointRef": PreviousCall ? PreviousCall["siri:StopPointRef"][0] : undefined,
                            "PointName": PreviousCall ? PreviousCall["ojp:StopPointName"][0]["ojp:Text"][0] : undefined,
                            "ServiceDeparture": {
                                "TimetabledTime": PreviousCall && PreviousCall.hasOwnProperty("ojp:ServiceDeparture") ? PreviousCall["ojp:ServiceDeparture"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": this.originPreviousDepatureEstimatedAvailable ? PreviousCall["ojp:ServiceDeparture"][0]["ojp:EstimatedTime"][0] : undefined
                            },
                            "ServiceArrival": {
                                "TimetabledTime": PreviousCall && PreviousCall.hasOwnProperty("ojp:ServiceArrival") ? PreviousCall["ojp:ServiceArrival"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": this.originPreviousArrivalEstimatedAvailable ? PreviousCall["ojp:ServiceArrival"][0]["ojp:EstimatedTime"][0] : undefined
                            }
                        },
                        "Destination": {
                            "EndPointRef": StopEventService[0]["ojp:DestinationStopPointRef"][0],
                            "EndPointName": StopEventService[0]["ojp:DestinationText"][0]["ojp:Text"][0]._,
                            "ServiceDeparture": {
                                "TimetabledTime": OnwardCall && OnwardCall.hasOwnProperty("ojp:ServiceDeparture") ? OnwardCall["ojp:ServiceDeparture"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": this.originOnwardDepatureEstimatedAvailable ? OnwardCall["ojp:ServiceDeparture"][0]["ojp:EstimatedTime"][0] : undefined
                            },
                            "ServiceArrival": {
                                "TimetabledTime": OnwardCall && OnwardCall.hasOwnProperty("ojp:ServiceArrival") ? OnwardCall["ojp:ServiceArrival"][0]["ojp:TimetabledTime"][0] : undefined,
                                "EstimatedTime": this.originOnwardArrivalEstimatedAvailable ? OnwardCall["ojp:ServiceArrival"][0]["ojp:EstimatedTime"][0] : undefined
                            }
                        }
                    }
                })
            }
        });

        return this.responseJson
    }

}