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

                //const tripCancelledv2 = StopEventService[0].hasOwnProperty("ojp:Cancelled") && StopEventService[0]["ojp:Cancelled"][0]
                const tripCancelled = CallAtStop.hasOwnProperty("ojp:NotServicedStop") && !!CallAtStop["ojp:NotServicedStop"][0]

                this.originPreviousDepatureEstimatedAvailable = PreviousCall != undefined && PreviousCall.hasOwnProperty("ojp:ServiceDeparture") && PreviousCall["ojp:ServiceDeparture"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originPreviousArrivalEstimatedAvailable = PreviousCall != undefined && PreviousCall.hasOwnProperty("ojp:ServiceArrival") && PreviousCall["ojp:ServiceArrival"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originOnwardDepatureEstimatedAvailable = OnwardCall != undefined && OnwardCall.hasOwnProperty("ojp:ServiceDeparture") && OnwardCall["ojp:ServiceDeparture"][0].hasOwnProperty("ojp:EstimatedTime")

                this.originOnwardArrivalEstimatedAvailable = OnwardCall != undefined && OnwardCall.hasOwnProperty("ojp:ServiceArrival") && OnwardCall["ojp:ServiceArrival"][0].hasOwnProperty("ojp:EstimatedTime")

                // PtMode(modes of transport) exist in multiple forms, instead of defining an entry for each transport type
                // I simply concat the name while maintaing 1 simple entry
                const transportSubMode = `siri:${this.capitalize(StopEventService[0]["ojp:Mode"][0]["ojp:PtMode"][0])}Submode`

                this.responseJson.push({

                    "Id": val["ojp:ResultId"][0],
                    "StopEventResponseContext": {
                        "location": {
                            "id": StopEventResponseContextLocation.hasOwnProperty("ojp:StopPoint") ?
                                StopEventResponseContextLocation["ojp:StopPoint"][0]["siri:StopPointRef"][0] :
                                StopEventResponseContextLocation["ojp:StopPlace"][0]["ojp:StopPlaceRef"][0],
                            "name": StopEventResponseContextLocation.hasOwnProperty("ojp:StopPoint") ?
                                StopEventResponseContextLocation["ojp:StopPoint"][0]["ojp:StopPointName"][0]["ojp:Text"][0]._ :
                                StopEventResponseContextLocation["ojp:StopPlace"][0]["ojp:StopPlaceName"][0]["ojp:Text"][0]._,
                            "GeoLocation": {
                                "latitude": StopEventResponseContextLocation["ojp:GeoPosition"][0]["siri:Latitude"][0],
                                "longitude": StopEventResponseContextLocation["ojp:GeoPosition"][0]["siri:Longitude"][0]
                            }
                        },
                        "IsItDeparture": this.isItDeparture
                    },
                    "RequestedStation": {
                        "StartPointRef": CallAtStop["siri:StopPointRef"][0],
                        "StartPoint": CallAtStop["ojp:StopPointName"][0]["ojp:Text"][0]._,
                        "ServiceDeparture": {
                            "TimetabledTime": this.isItDeparture ? CallAtStop["ojp:ServiceDeparture"][0]["ojp:TimetabledTime"][0] : undefined,
                            "EstimatedTime": this.isItDeparture && this.depatureEstimatedAvailable ? CallAtStop["ojp:ServiceDeparture"][0]["ojp:EstimatedTime"][0] : undefined
                        },
                        "ServiceArrival": {
                            "TimetabledTime": !this.isItDeparture ? CallAtStop["ojp:ServiceArrival"][0]["ojp:TimetabledTime"][0] : undefined,
                            "EstimatedTime": !this.isItDeparture && this.arrivalEstimatedAvailable ? CallAtStop["ojp:ServiceArrival"][0]["ojp:EstimatedTime"][0] : undefined
                        },
                        "IsTripCancelled": tripCancelled,
                        "PlannedPlatform": CallAtStop.hasOwnProperty("ojp:PlannedQuay") ? CallAtStop["ojp:PlannedQuay"][0]["ojp:Text"][0]._ : undefined,
                        "EstimatedPlatform": CallAtStop.hasOwnProperty("ojp:EstimatedQuay") ? CallAtStop["ojp:EstimatedQuay"][0]["ojp:Text"][0]._ : undefined,
                        "OperatingDay": StopEventService[0]["ojp:OperatingDayRef"][0],
                        "PublishedLineName": StopEventService[0]["ojp:PublishedLineName"][0]["ojp:Text"][0]._,
                        "TransportMethod": {
                            "PtMode": StopEventService[0]["ojp:Mode"][0]["ojp:PtMode"][0],
                            "SubMode": StopEventService[0]["ojp:Mode"][0][transportSubMode][0],
                            "TransportName": StopEventService[0]["ojp:Mode"][0]["ojp:Name"][0]["ojp:Text"][0]._,
                            "TransportShortName": StopEventService[0]["ojp:Mode"][0].hasOwnProperty("ojp:ShortName") && StopEventService[0]["ojp:Mode"][0]["ojp:ShortName"][0]["ojp:Text"][0]._
                        }
                    },
                    "Origin": {
                        "IsAvailable": val["ojp:StopEvent"][0].hasOwnProperty("ojp:PreviousCall"),
                        "PointRef": PreviousCall ? PreviousCall["siri:StopPointRef"][0] : undefined,
                        "PointName": PreviousCall ? PreviousCall["ojp:StopPointName"][0]["ojp:Text"][0]._ : undefined,
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

                })
            }
        });
        return this.responseJson
    }

    capitalize(word: string) {
        return word[0].toUpperCase() + word.slice(1);
    }
}