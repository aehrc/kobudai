/*
 * Copyright © 2022 SNOMED International
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {TokenMsg, UserInfo} from '../_models/user';
import {Task} from '../_models/task';
import {IAppState} from '../store/app.state';
import {Store} from '@ngrx/store';
import {isAuthenticated, selectToken} from '../store/auth-feature/auth.selectors';
import {APP_CONFIG, AppConfig} from '../app.config';
import {LogOut} from '../store/auth-feature/auth.actions';
import {selectAssignedTasks, selectAuthorizedProjects} from '../store/app.selectors';
import {ActivatedRouteSnapshot} from '@angular/router';
import {ServiceUtils} from '../_utils/service_utils';
import jwt_decode from 'jwt-decode';
import {selectMappingLoading} from '../store/mapping-feature/mapping.selectors';
import {catchError, map, switchMap} from "rxjs/operators";
import {MapService} from "./map.service";

interface OidcConfig {
  token_endpoint: string;
  authorization_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
              private http: HttpClient,
              private mapService: MapService,
              private store: Store<IAppState>) {
  }

  private issuerUri = this.config.issuerUri;
  private oidcConfig?: OidcConfig;
  private authClientID = this.config.authClientID;
  private authLoginResponseType = this.config.authLoginResponseType;
  private authLoginScope = this.config.authLoginScope;
  private authLoginGrantType = this.config.authLoginGrantType;
  private identityProvider = this.config.identityProvider;

  private authLoginRedirectUrl = window.location.origin;
  private authLogout = window.location.origin + '/';

  static getTokenFromSession(): string {
    return localStorage.getItem('token') as string;
  }

  static getUseridFromSession(): string {
    return localStorage.getItem('userid') as string;
  }

  private autoconfigure(): Observable<OidcConfig> {
    if (this.oidcConfig) {
      return of(this.oidcConfig);
    }

    const wellKnownUrl = `${this.issuerUri}/.well-known/openid-configuration`;
    return this.http.get(wellKnownUrl).pipe(
      map(result => {
        this.oidcConfig = result as OidcConfig;
        return this.oidcConfig;
      }),
      catchError(err => {
        console.error(`Failed requesting ${wellKnownUrl}`, JSON.stringify(err, undefined, 2));
        return throwError({ error: `Authentication configuration failed - ${err}` });
      })
    );
  }

  loginWithRedirect(): void {
    // clear SessionStorage first
    this.clearSessionStorage();

    this.autoconfigure()
      .subscribe((oidcConfig) => {
        const tokenEndpoint = oidcConfig.token_endpoint;
        const authorizationEndpoint = oidcConfig.authorization_endpoint;

        if (tokenEndpoint.length > 5) {
          let params = new HttpParams()
            .set('client_id', this.authClientID)
            .set('response_type', this.authLoginResponseType)
            .set('scope', this.authLoginScope)
            .set('redirect_uri', this.authLoginRedirectUrl)

          if (this.identityProvider) {
            params = params.set('identity_provider', this.identityProvider);
          }

          // Redirect to AWS Cognito hosted UI
          window.location.href = `${authorizationEndpoint}?${params.toString()}`;
        } else {
          throwError({ error: `Login unsuccessful - missing URL ${tokenEndpoint}` });
        }
      })
  }

  public handleRedirectCallback(code: string): Observable<TokenMsg> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      })
    };
    // body must be form encoded
    const body = new HttpParams({
      fromObject: {
        grant_type: this.authLoginGrantType,
        client_id: this.authClientID,
        code,
        redirect_uri: this.authLoginRedirectUrl,
        response_type: 'code',
      }
    });

    return this.autoconfigure().pipe(
      switchMap(oidcConfig => {
        return this.http.post<TokenMsg>(oidcConfig.token_endpoint, body.toString(), header);
      })
    );
  }

  public getUserInfo(token: string): Observable<UserInfo> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + token,
        Accept: '*/*',
      })
    };
    return this.autoconfigure().pipe(
      switchMap(oidcConfig => {
        return this.http.get<UserInfo>(oidcConfig.userinfo_endpoint, header);
      })
    );
  }

  saveSessionAuth(token: string, userid: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userid', userid);
  }

  clearSessionStorage(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    let auth = false;
    this.store.select(isAuthenticated).subscribe((state) => {
      auth = state;
    }).unsubscribe();
    return auth;
  }

  acceptTerms(): Observable<any> {
    const url = `${this.config.apiBaseUrl}/users/acceptTerms`;
    const header = ServiceUtils.getHTTPHeaders();
    return this.http.post(url, null, header);
  }

  isAuthorized(route: ActivatedRouteSnapshot): boolean {
    let auth = route.data?.permissions ? route.data.permissions === 'ALL' : true;
    const mapping_id = ServiceUtils.cleanParamId(route.paramMap.get('mappingid'));
    const task_id = ServiceUtils.cleanParamId(route.paramMap.get('taskid'));
    if (this.isAdmin()) {
      auth = true;
    } else {
      if (task_id && mapping_id) {
        this.store.select(selectAssignedTasks).subscribe((tasks) => {
          auth = tasks.filter((t: Task) => t.id.toString() === task_id
            && t.mapping.id?.toString() === mapping_id).length > 0;
        }).unsubscribe();
      } else if (mapping_id) {
        this.store.select(selectAuthorizedProjects).subscribe(
          (projects) => {
            auth = projects.filter((p) => {
              if (!p.maps || p.maps.length == 0) {
                return this.mapService.getMapsForProjectId(p.id).pipe(map(mapDto => {
                  p.maps = [...mapDto._embedded.maps];
                  return (p.maps.filter((m) => m.id?.toString() === mapping_id).length > 0);
                }));
              } else {
                return (p.maps.filter((m) => m.id?.toString() === mapping_id).length > 0);
              }
            }).length > 0;
          }
        ).unsubscribe();
      }
    }
    return auth;
  }

  isAdmin(): boolean {
    let admin = false;
    this.store.select(selectToken).subscribe((state) => {
      if (state && state.id_token) {
        const decoded = jwt_decode(state.id_token);
        // @ts-ignore
        const groups = this.config.useCognito ? decoded['cognito:groups'] ?? null : decoded['groups'] ?? null;
        if (groups) {
          admin = groups.indexOf(this.config.adminGroup) >= 0;
        }
      }
    }).unsubscribe();
    return admin;
  }

  hasUserAcceptedToS(): boolean {
    let expired = true;
    this.store.select(selectToken).subscribe((state) => {
      if (state && state.id_token) {
        const decoded = jwt_decode(state.id_token);
        // @ts-ignore
        const expireTime = decoded['exp'] ?? null;
        if (expireTime) {
          expired = (expireTime*1000) < Date.now();
        }
      }
    }).unsubscribe();
    return expired;
  }

  isTokenExpired(): boolean {
    let expired = true;
    this.store.select(selectToken).subscribe((state) => {
      if (state && state.access_token) {
        const decoded = jwt_decode(state.access_token);
        // @ts-ignore
        const expireTime = decoded['exp'] ?? null;
        if (expireTime) {
          expired = (expireTime*1000) < Date.now();
        }
      }
    }).unsubscribe();
    return expired;
  }

  // Logout from AWS Cognito hosted UI
  logout(): void {
    const params = new HttpParams()
      .set('client_id', this.authClientID)
      .set('logout_uri', `${this.authLogout}`);
    if (this.oidcConfig) {
      const token_endpoint = this.oidcConfig.token_endpoint;
      const end_session_endpoint = this.oidcConfig.end_session_endpoint;
      this.oidcConfig = undefined;

      this.clearSessionStorage();

      if (end_session_endpoint) {
        window.location.href = `${end_session_endpoint}?${params.toString()}`;
      } else {
        const logout_endpoint = new URL('/logout', token_endpoint).href;
        console.log('Guessing a Cognito-style logout endpoint', logout_endpoint);
        window.location.href = `${logout_endpoint}?${params.toString()}`;
      }
    }
  }

  refreshAuthSession(token: TokenMsg): Observable<TokenMsg> {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    if (token) {
      headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      });
      body = new HttpParams({
        fromObject: {
          grant_type: 'refresh_token',
          client_id: this.authClientID,
          refresh_token: token.refresh_token,
          response_type: 'code',
        }
      });
    } else {
      throwError({error: 'Token is missing'});
    }
    return this.autoconfigure().pipe(
      switchMap(oidcConfig => {
        return this.http.post<TokenMsg>(oidcConfig.token_endpoint, body.toString(), {headers});
      })
    );
  }

  redirectToLogout(): void {
    this.store.dispatch(new LogOut());
  }

  isLoading(): boolean {
    let isLoading = false;
    this.store.select(selectMappingLoading).subscribe((loading) => {
      isLoading = loading;
    });
    return isLoading;
  }
}
