import Reservation from '@/api/domain/reservation';
import User from '@/api/domain/user';
import ApiRequest from '@/api/request';

export default class Api {
  private static instance: Api | null = null;

  private readonly request = new ApiRequest();

  private readonly domain = {
    User: new User(this.request),
    Reservation: new Reservation(this.request),
  };

  private constructor() {
    Api.instance = this;
  }

  private static get Instance(): Api {
    if (Api.instance === null) {
      Api.instance = new Api();
    }

    return Api.instance!;
  }

  public static get Domain() {
    return Api.Instance.domain;
  }

  public static get Request(): ApiRequest {
    return Api.Instance.request;
  }
}
