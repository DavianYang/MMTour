import { itineraryModel } from '@models/itineraries.model';
import { findAll, findOne, createOne, updateOne, deleteOne } from '@services/factory.service';
import { Itinerary } from '@interfaces/itineraries.interface';
import { QueryString } from '@interfaces/queries.interface';

class ItineraryService {
  public itineraries = itineraryModel;

  public async findAllItineraries(query: object) {
    return await findAll(this.itineraries, query as QueryString);
  }

  public async findItinerary(id: string) {
    return await findOne(this.itineraries, id);
  }

  public async createItinerary(itineraryBody: Itinerary) {
    return await createOne(this.itineraries, itineraryBody);
  }

  public async updateItinerary(id: string, body: object) {
    return await updateOne(this.itineraries, id, body);
  }

  public async deleteItinerary(id: string) {
    return await deleteOne(this.itineraries, id);
  }
}

export { ItineraryService };
