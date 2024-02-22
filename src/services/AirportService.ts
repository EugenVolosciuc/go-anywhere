import { AirportModel } from "src/models/airport";

export class AirportService {
  static async findClosestAirport([lat, long]: [number, number]) {
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
