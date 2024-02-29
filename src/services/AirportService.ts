import { AirportModel } from "models/airport";
import { Location } from "types";

export class AirportService {
  static async findClosestAirport({ lat, long }: Location) {
    return await AirportModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 100000, // Max distance in meters
        },
      },
    });
  }
}
