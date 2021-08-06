const requestBodyModel = {
    "OJP": {
        "$": {
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "xmlns": "http://www.siri.org.uk/siri",
            "version": "1.0",
            "xmlns:ojp": "http://www.vdv.de/ojp",
            "xsi:schemaLocation": "http://www.siri.org.uk/siri ../ojp-xsd-v1.0/OJP.xsd"
        },
        "OJPRequest": [
            {
                "ServiceRequest": [
                    {
                        "RequestTimestamp": [
                            "2021-07-23T23:07:14.243Z"
                        ],
                        "RequestorRef": [
                            "API-Explorer"
                        ],
                        "ojp:OJPStopEventRequest": [
                            {
                                "RequestTimestamp": [
                                    "2021-07-23T23:07:14.243Z"
                                ],
                                "ojp:Location": [
                                    {
                                        "ojp:PlaceRef": [
                                            {
                                                "ojp:StopPlaceRef": [
                                                    "8507000"
                                                ]
                                            }
                                        ],
                                        "ojp:DepArrTime": [
                                            "2021-07-24T01:07:14"
                                        ]
                                    }
                                ],
                                "ojp:Params": [
                                    {
                                        "ojp:NumberOfResults": [
                                            "1"
                                        ],
                                        "ojp:StopEventType": [
                                            "departure"
                                        ],
                                        "ojp:IncludePreviousCalls": [
                                            "true"
                                        ],
                                        "ojp:IncludeOnwardCalls": [
                                            "true"
                                        ],
                                        "ojp:IncludeRealtimeData": [
                                            "true"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

export default requestBodyModel