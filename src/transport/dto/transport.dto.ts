import { IsNotEmpty } from 'class-validator'

export class TransportBodyRequestDto {

    @IsNotEmpty()
    RequestorReference: string;

    @IsNotEmpty()
    RequestCurrentTimeStamp: string;

    @IsNotEmpty()
    StopPlaceReference: string;

    @IsNotEmpty()
    NumberOfResult: string;

    @IsNotEmpty()
    ArrivalOrDepature: string;

    @IsNotEmpty()
    ArrivalOrDepatureTime: string;

    @IsNotEmpty()
    EnableRealTimeData: string;
}