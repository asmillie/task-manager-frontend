import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, IUser } from '../user/user';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = environment.taskApi.url;
  private LOGIN = environment.taskApi.endpoint.login;
  private LOGOUT = environment.taskApi.endpoint.logout;

  constructor(private http: HttpClient) { }

  login$(email: string, password: string): Observable<User> {
    return this.http.post<IUser>(
      this.API_URL + this.LOGIN,
      {
        email: { address: email },
        password,
      }
    ).pipe(
      map((res: IUser) => {
        return new User(res.name, res.email.address, res._id);
      })
    );
  }
}
