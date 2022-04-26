import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/constants/api.constants';
import { EVENTS_CONFIG, EVENT_TAG_KEYS } from 'src/app/constants/constants';
// import { LatLngLiteral } from 'leaflet';
import { map } from 'rxjs/operators';

interface Logo {
  path: string;
  alt: string;
  width?: string;
  height?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ViolationServiceService {
  private clientConfig = CLIENT_CONFIG;
  private eventsConfig = {
    ...EVENTS_CONFIG,
    'Drowsy-Driving-Detected': {
      label: 'Drowsy Driving',
      color: '#e65000',
      showHighlights: false,
    },
  };

  constructor(private http: HttpClient) {}

  public getViolationsEvents(
    params: any,
    requestType?: string,
    isRefresh?: boolean,
    currentAsset?: string
  ): Observable<any> {
    const httpOptions = {
      params: setParams(params),
    };
    let api = requestType === 'DVR' ? API.GET_DVR_REQUESTS : API.GET_VIOLATIONS;

    if (requestType === 'DVR') {
      api = API.GET_DVR_REQUESTS;
    } else if (requestType === 'INCIDENT') {
      api = API.GET_VIOLATIONS;
    } else {
      api = API.GET_EXTERNAL_EVENTS;
    }
    if (isRefresh) {
      // this.cacheService.burstCache$.next(api);
    }
    return this.http.get(api, httpOptions).pipe(
      map((res: any) => {
        if (requestType === 'DVR') {
          const { data = {} } = res;
          let { uploadRequests = [] } = data;
          uploadRequests = uploadRequests.filter(
            (r: any) => r?.assetId === currentAsset
          );
          return {
            ...res,
            rows: uploadRequests.map((dvr: any, index: any) => {
              const {
                startTime = '',
                startTimeUTC = '',
                createdAt = '',
                coachingCompletedTimestamp = '',
              } = dvr;
              if (startTime && startTimeUTC && createdAt) {
                const timeDiff =
                  new Date(startTime).getTime() -
                  new Date(startTimeUTC).getTime();
                const createdAtLocal = new Date(
                  new Date(createdAt).getTime() + timeDiff
                );
                const coachingCompletedTimestampLocal = new Date(
                  new Date(coachingCompletedTimestamp).getTime() + timeDiff
                );
                return {
                  ...dvr,
                  createdAtLocal,
                  positionIndex: index,
                  coachingCompletedTimestampLocal,
                };
              }
              return {
                ...dvr,
                positionIndex: index,
              };
            }),
          };
        } else if (requestType === 'INCIDENT') {
          let { rows = [] } = res || {};
          rows = rows.filter((r: any) => r?.asset?.assetId === currentAsset);
          return {
            ...res,
            rows: rows.map((event: any, index: any) => {
              const {
                tags = [],
                eventVideoFile = '',
                eventType = '',
                coachingCompletedTimestamp = '',
                timestamp = '',
                timestampUTC = '',
              } = event;
              const eventTypeLabel = this.eventsConfig[eventType]?.label || {};
              const mappedTags = tags.map((tag: any) => {
                return EVENT_TAG_KEYS[tag];
              });
              const timeDiff =
                new Date(timestamp).getTime() -
                new Date(timestampUTC).getTime();
              const coachingCompletedTimestampLocal = new Date(
                new Date(coachingCompletedTimestamp).getTime() + timeDiff
              );
              return {
                ...event,
                eventTypeLabel,
                eventTags: mappedTags,
                eventVideoFilename: eventVideoFile,
                positionIndex: index,
                coachingCompletedTimestampLocal,
              };
            }),
          };
        } else {
          let { rows = [] } = res || {};
          rows = rows.filter((r: any) => r?.asset?.assetId === currentAsset);
          return {
            ...res,
            rows: rows.map((event: any, index: any) => {
              const {
                tags = [],
                eventVideoFile = '',
                timestampUTC = '',
                timestamp = '',
                coachingCompletedTimestamp = '',
              } = event;
              const mappedTags = tags.map((tag: string | number) => {
                return EVENT_TAG_KEYS[tag];
              });
              const timeDiff =
                new Date(timestamp).getTime() -
                new Date(timestampUTC).getTime();
              const coachingCompletedTimestampLocal = new Date(
                new Date(coachingCompletedTimestamp).getTime() + timeDiff
              );
              return {
                ...event,
                eventTypeLabel: this.clientConfig.externalEventsLabel,
                eventTags: mappedTags,
                eventVideoFilename: eventVideoFile,
                positionIndex: index,
                coachingCompletedTimestampLocal,
              };
            }),
          };
        }
      })
    );
  }
}

export function setParams(params: any) {
  return new HttpParams({
    fromObject: params,
  });
}
export const DEFAULT_CLIENT_CONFIG = {
  logo: {
    path: '',
    alt: '',
    width: '',
    height: '',
  },
  showLogo: true,
  showSurveyButton: false,
  showUserProfile: true,
  showManageDriversTab: true,
  allowedRoutes: ['trips'],
  authRoutes: ['callback', 'tsplogin', 'admin-login'],
  wildcardRoute: 'callback',
  defaultMapCoordinates: {
    lat: 40.25,
    lng: -74.5,
  },
  externalEventsLabel: 'Panic Button',
  showFeatureAnnouncement: true,
};

export const CLIENT_CONFIG: ClientConfig = {
  clientName: 'lmpresales',
  ...DEFAULT_CLIENT_CONFIG,
  logo: {
    path: 'assets/horizontal-logo.png',
    alt: 'LightMetrics',
    width: '148px',
    height: '36px',
  },
  showSurveyButton: true,
  showCopyrightText: true,
  showPrivacyPolicyLink: true,
};

export interface ClientConfig {
  clientName: string;
  logo: Logo;
  showLogo: boolean;
  showSurveyButton: boolean;
  showUserProfile: boolean;
  allowedRoutes: string[];
  authRoutes: string[];
  wildcardRoute: string;
  // ssoLocalStorageKeys?: SsoStorageMapping;
  showCopyrightText?: boolean;
  showPrivacyPolicyLink?: boolean;
  showManageDriversTab: boolean;
  // defaultMapCoordinates: LatLngLiteral;
  externalEventsLabel: string;
  showFeatureAnnouncement: boolean;
}
