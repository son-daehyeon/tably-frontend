import ApiRequest from '@/api/request';
import { SignUpRequest, UpdateClubRequest, UserResponse, UsersResponse } from '@/api/types/user';

export default class User {
  constructor(private readonly request: ApiRequest) {}

  public async getAllUser(query: string = ''): Promise<UsersResponse> {
    return this.request.get('/users?query=' + query);
  }

  public async getMyInfo(): Promise<UserResponse> {
    return this.request.get('/users/me');
  }

  public async signUp(body: SignUpRequest): Promise<UserResponse> {
    return this.request.post('/users/sign-up', body);
  }

  public async updateClub(body: UpdateClubRequest): Promise<UserResponse> {
    return this.request.put('/users/club', body);
  }
}
