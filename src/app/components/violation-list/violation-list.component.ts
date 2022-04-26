import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

  constructor(
    public route: ActivatedRoute,
    private tripsService: ViolationServiceService
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
    console.log("0", params)
    const { fleetId, assetId } = params;
    this.fleetId = fleetId;
    this.currentAsset = assetId;
    if(this.currentAsset && this.fleetId){
      this.getViolationsVideos();
    }
  }
  public getViolationsVideos(isRefresh?: boolean) {
    this.violationLoader = true;
    // this.dataService._currentAsset.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value: string) => {
    //   this.currentAsset = value;
    // });
    console.log("1")
    if (!this.currentAsset) {
      return;
    }
    console.log("2")
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
      .getViolationsEvents(params, requestType, isRefresh, this.currentAsset)
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
}
