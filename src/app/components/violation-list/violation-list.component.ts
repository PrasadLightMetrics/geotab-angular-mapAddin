import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {
  DVR_REQUEST_LIST_TABLE_COLUMNS,
  PAGINATE_SIZES,
  TIME_LIMIT_IN_MS,
  VIOLATIONS_TYPE_LIST,
  VIOLATION_PANIC_BUTTON_TABLE_COLUMNS,
  VIOLATION_VIDEOS_TABLE_COLUMNS,
} from 'src/app/constants/constants';
import { ViolationServiceService } from 'src/app/services/violationService/violation-service.service';
import { IncidentModalComponent } from '../incident-modal/incident-modal.component';

@Component({
  selector: 'app-violation-list',
  templateUrl: './violation-list.component.html',
  styleUrls: ['./violation-list.component.scss'],
})
export class ViolationListComponent implements OnInit, OnChanges {
  public tableColumns = VIOLATION_VIDEOS_TABLE_COLUMNS;
  public viotableSource = new MatTableDataSource<any>([]);

  @Input()
  public videoType: string | undefined;
  @Input()
  public showDriverColumn = false;
  @Input()
  public loader: boolean = false;
  public violationLoader = true;
  public violationList: any;
  public currentAsset: any;
  public tablePageSize = PAGINATE_SIZES;
  public violationsTypeList = VIOLATIONS_TYPE_LIST;
  public selectedViolationType = 'incidents';
  fleetId: any;
  startDate: any;
  endDate: any;
  authToken: any;

  constructor(
    public route: ActivatedRoute,
    private tripsService: ViolationServiceService,
    private dialog: MatDialog
  ) {}

  public getDateParams() {
    const today: any = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return {
      startDate: new Date(today - TIME_LIMIT_IN_MS).toISOString(), // July
      endDate: new Date(today.getTime() + 2 * 86400000).toISOString(), // endDate is always tomorrows date
    };
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.videoType === 'dvr') {
      this.tableColumns = [...DVR_REQUEST_LIST_TABLE_COLUMNS];
    } else if (this.videoType === 'externalEvents') {
      this.tableColumns = VIOLATION_PANIC_BUTTON_TABLE_COLUMNS;
    } else {
      this.tableColumns = VIOLATION_VIDEOS_TABLE_COLUMNS;
    }
    this.tableColumns = this.showDriverColumn
      ? this.tableColumns
      : this.tableColumns.filter((x) => x !== 'driverName');

    if (this.loader) {
      this.viotableSource.data = new Array(5).fill(undefined);
    }

    // if (changes) {
    //   this.getViolationsVideos();
    // }
  }

  public ngOnInit(): void {
    this.viotableSource.data = new Array(5).fill(undefined);
    this.route.queryParams.subscribe((params: any) =>
      this.validateCode(params)
    );
  }

  private validateCode(params: any) {
    console.log('0', params);
    const { fleetId, assetId, authToken } = params;
    this.fleetId = 'lmfleet003';
    this.currentAsset = 'G9ZMJZJD0D03';
    this.authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhbCI6eyJsb2dpbk5hbWUiOiJwcmFzYWQucmFqQGxpZ2h0bWV0cmljcy5jbyIsIm5hbWUiOiJQcmFzYWQgUmFqIiwiZmxlZXRzIjpbeyJmbGVldElkIjoibG1mbGVldDAwMyIsInBlcm1pc3Npb25zIjpbImFkbWluOmZsZWV0X2NvbmZpZyIsInJlYWQ6ZmxlZXRfY29uZmlnIiwidXBkYXRlOmZsZWV0X2NvbmZpZyJdfV0sImN1c3RvbWVyTmFtZSI6Imdlb3RhYiIsInVzZXJUeXBlIjoiZmxlZXRtYW5hZ2VyIiwidXNlck1ldGFkYXRhIjp7InRpbWV6b25lIjoiTG9jYWwiLCJtZXRyaWNVbml0IjoiTWlsZXMiLCJkYXRlRm9ybWF0IjoiTU0vREQvWVlZWSBISDptbTpzcyJ9fSwiaWF0IjoxNjUxMDUyMDAwLCJleHAiOjE2NTExMzg0MDB9.uWZy20csLvJ8mODalLteAnump__OIlaQXCjPqnmksGY';
    if (this.currentAsset && this.fleetId) {
      this.getViolationsVideos();
    }
  }
  public getViolationsVideos(isRefresh?: boolean) {
    this.violationLoader = true;
    // this.dataService._currentAsset.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: string) => {
    //   this.currentAsset = value;
    // });
    if (!this.currentAsset) {
      return;
    }
    const { startDate, endDate } = this.getDateParams();
    // return new Promise<void>(() => {
    const pageIndex = 0;
    const sortBy = '';
    const sort = 'desc';
    // const { pageIndex = 0, sortKey: _sortBy = '', sortDirection: sort = 'desc' } = this.assetTableState || {};
    const offset = pageIndex * this.tablePageSize;
    const requestType =
      this.violationsTypeList.filter(
        (x) => x.value === this.selectedViolationType
      )[0].type || 'INCIDENT';
    const params = {
      offset: offset,
      limit: this.tablePageSize,
      sortBy: 'timestamp',
      sort: sort,
      startDate: startDate,
      endDate: endDate,
      ...(requestType === 'INCIDENT' &&
      this.selectedViolationType !== 'incidents'
        ? {
            eventType: this.selectedViolationType,
          }
        : {}),
      assetId: this.currentAsset,
      fleetId: this.fleetId,
    };
    this.tripsService
      .getViolationsEvents(
        params,
        requestType,
        isRefresh,
        this.currentAsset,
        this.authToken
      )
      .subscribe((res: any) => {
        console.log(res);
        this.violationList = res.rows;

        // For Geotab events time-Stamp is null
        this.violationList = this.violationList.map((e: any, _i: any) => {
          const { timestampUTC, timestamp } = e;
          const localtimeZoneOffset = new Date().getTimezoneOffset();
          const localtimestamp = new Date(
            new Date(timestampUTC).getTime() - localtimeZoneOffset * 60000
          );
          const mediaUploaded = e?.mediaFiles
            ? e?.mediaFiles.some(
                (media: any) => media?.uploadStats?.status === 'UPLOADED'
              )
            : false;
          return {
            ...e,
            timestamp: timestamp || localtimestamp.toISOString(),
            mediaUploaded: mediaUploaded,
          };
        });
        this.violationLoader = false;
        this.viotableSource.data = this.violationList;

        () => {
          this.violationList = [];
        };
      });
  }

  public showMedia(positionIndex?: any) {
    if (this.videoType === 'dvr') {
      this.violationList = this.violationList.map((x: any, index: any) => {
        return {
          ...x,
          isDvrEvent: true,
          eventVideoFilename: x.response.link,
          positionIndex: index,
          videoDetails: {
            videoResolution: x.videoResolution,
          },
          eventTypeLabel: x.timelaspeEnabled ? 'Time-lapse DVR' : 'DVR',
        };
      });
    }
    this.dialog.open(IncidentModalComponent, {
      panelClass: ['incident-modal', 'mobile-modal'],
      position: { top: '24px', bottom: '24px' },
      autoFocus: false,
      disableClose: true,
      data: {
        allEvents: this.violationList,
        currentIndex: positionIndex,
        showCoachingTab: true,
      },
    });
  }
}
