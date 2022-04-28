import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSliderChange } from '@angular/material/slider';

import { Observable, of, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AUTO_TAGS_LIST, BREAKPOINTS_MEDIUM, BREAKPOINTS_SMALL, EVENT_TAG_LIST, GetEventListParams, MEDIA_SOURCES_ENUM } from 'src/app/constants/constants';

@Component({
  selector: 'app-incident-modal',
  templateUrl: './incident-modal.component.html',
  styleUrls: ['./incident-modal.component.scss'],
})
export class IncidentModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paginator', { static: true })
  public paginator!: MatPaginator ;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private formValueChangesUnsubscribe: Subject<void> = new Subject<void>();
  public isDirty$: Observable<boolean> = of(false);

  public isVideoPlaying = false;
  public eventTagList = EVENT_TAG_LIST;
  public videoSeekerTranslateVal = 0;
  public videoRef!: HTMLVideoElement;
  public videoRef2!: HTMLVideoElement;
  public isMapMode = true;
  public isFullscreen = false;
  public customMapOptions = {
    recenterButton: {
      display: 'inline-block',
      top: '84px',
      left: '10px',
    },
    fullscreenButton: {
      display: 'none',
    },
  };
  public incidentListDataSource = new MatTableDataSource<any>([]);
  public incidentListObservable!: Observable<any>;
  public incidentMarker = [];
  public mapInitialCoordinates: any = {};
  public mapIcon: any = {};
  public commentList = [];

  public incidentMedia1: any;
  public incidentMedia1Label!: string;
  public incidentMedia2: any;
  public incidentMedia2Label!: string;
  public videoLoader = true;
  public incidentType = 'INCIDENT';

  public formLoaders = {
    bookmarkLoader: false,
    tagsLoader: false,
    commentLoader: false,
    coachingLoader: false,
  };

  public incidentTags = new FormControl([], [Validators.required, Validators.maxLength(3)]);
  public incidentComment = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(140)]);
  public isBookmarked = false;
  public timelineLoader = false;
  public eventIndicatorList = [];
  public mediaType = 'VIDEO';
  public isMediaAvailable = true;
  public fleetManagerCommentCount = 0;
  public isTouchDevice = false;
  public isMediaStream1 = true;
  public presentIndex = 0;
  public videoResolution: any;
  public autoTags = [];
  public isCoachingCompleted = false;

  constructor(
    public dialogRef: MatDialogRef<IncidentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private snackbarService: SnackBarService,
    // public dataService: DataService,
    // private mapService: MapService,
    // private tripDetailsService: TripDetailsService,
    private cdRef: ChangeDetectorRef,
    // private accessService: AccessService,
    private breakpointObserver: BreakpointObserver,
  ) {
    // this.mapIcon.eventIcon = this.mapService.getIcon();
  }

  public ngOnInit() {
    this.breakpointObserver.observe([...BREAKPOINTS_SMALL, ...BREAKPOINTS_MEDIUM]).subscribe((state: BreakpointState) => {
      this.isTouchDevice = state.matches;
    });

    const { allEvents = [], currentIndex = 0 } = this.data || {};
    this.incidentListDataSource.data = allEvents;

    // connect datasource and pagination
    this.incidentListDataSource.paginator = this.paginator;
    this.incidentListObservable = this.incidentListDataSource.connect();
    this.paginator.pageIndex = currentIndex;

    // setting modal data
    this.resetData();
    this.setData(currentIndex);

    this.checkFullscreen();

    this.isDirty$ = this.incidentTags.valueChanges.pipe(
      takeUntil(this.formValueChangesUnsubscribe),
      // dirtyCheck(of(allEvents[currentIndex].tags || []))
    );
  }

  public checkFullscreen() {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = document['fullscreenElement'] ? true : false;
      this.resetVideo();
    });
    document.addEventListener('mozfullscreenchange', () => {
      this.isFullscreen = document['fullscreenElement'] ? true : false;
      this.resetVideo();
    });
    document.addEventListener('webkitfullscreenchange', () => {
      this.isFullscreen = document['fullscreenElement'] ? true : false;
      this.resetVideo();
    });
    document.addEventListener('msfullscreenchange', () => {
      this.isFullscreen = document['fullscreenElement'] ? true : false;
      this.resetVideo();
    });
  }

  public resetVideo() {
    if (this.videoRef && !this.isFullscreen) {
      this.videoRef.currentTime = 0;
      this.playVideo();
      this.isVideoPlaying = true;
    }
  }

  public ngAfterViewInit() {
    this.videoRef = document.getElementById('incidentVideo') as HTMLVideoElement;

    this.videoLoader = true;
    setTimeout(() => {
      if (this.videoRef) {
        this.videoRef.onended = () => {
          this.isVideoPlaying = false;
        };
      }
      if (this.videoRef2) {
        this.videoRef2.onended = () => {
          this.isVideoPlaying = false;
        };
      }
      this.videoLoader = false;
    }, 1000);

    this.cdRef.detectChanges();
  }

  // private createMarker(latitude: any, longitude: any): L.Marker {
  //   if (latitude && longitude) {
  //     this.mapInitialCoordinates = { latitude, longitude };
  //     // const marker = this.mapService.getMarker(+latitude, +longitude, this.mapIcon.eventIcon);
  //     // return marker;
  //   }
  // }

  public playAction() {
    if (this.incidentMedia1 && this.incidentMedia2) {
      this.videoRef.play();
      this.videoRef2.play();
      this.videoRef.ontimeupdate = () => {
        this.updateSeeker();
      };
      this.videoRef2.play();
      this.videoRef2.currentTime = this.videoRef.currentTime;
    } else {
      if (this.videoRef) {
        this.videoRef.play();
        this.videoRef.ontimeupdate = () => {
          this.updateSeeker();
        };
      }
    }
    this.isVideoPlaying = true;
  }

  public playVideo() {
    this.videoLoader = true;
    this.isVideoPlaying = false;
    // video1
    this.videoRef = document.getElementById('incidentVideo') as HTMLVideoElement;
    if (this.videoRef && !this.incidentMedia2) {
      this.videoLoader = false;
      this.isVideoPlaying = true;
      this.videoRef.play();

      // update video seeker
      this.videoRef.ontimeupdate = () => {
        this.updateSeeker();
      };
    }

    // video2
    this.videoRef2 = document.getElementById('incidentVideo2') as HTMLVideoElement;
    if (this.videoRef && this.videoRef2) {
      let isVideo2Playing = false;
      this.videoRef2.oncanplay = () => {
        if (isVideo2Playing) {
          return;
        }
        isVideo2Playing = true;
        this.videoLoader = false;
        this.isVideoPlaying = true;

        if (this.videoRef && this.videoRef2) {
          this.videoRef.play();
          // update video seeker
          this.videoRef.ontimeupdate = () => {
            this.updateSeeker();
          };

          this.videoRef2.play();
          this.videoRef2.currentTime = this.videoRef.currentTime;
          this.isVideoPlaying = true;
        }
      };
    }
  }

  public pauseVideo() {
    this.isVideoPlaying = false;
    // video1
    const video1PlayPromise = this.videoRef.play();
    if (video1PlayPromise !== undefined) {
      video1PlayPromise
        .then(() => {
          this.videoRef.pause();
        })
        .catch(() => {
          this.videoRef.pause();
        });
    }
    // update video seeker
    this.videoRef.ontimeupdate = () => {
      this.updateSeeker();
    };

    // video2
    const videoRef2 = document.getElementById('incidentVideo2') as HTMLVideoElement;
    if (videoRef2) {
      videoRef2.currentTime = this.videoRef && this.videoRef.currentTime;
      const video2PlayPromise = videoRef2.play();
      if (video2PlayPromise !== undefined) {
        video2PlayPromise
          .then(() => {
            videoRef2.pause();
          })
          .catch(() => {
            videoRef2.pause();
          });
      }
    }
  }

  public updateSeeker() {
    const { duration: totalVideoDuration = 1, currentTime = 0 } = this.videoRef || {};
    this.videoSeekerTranslateVal = Number(((currentTime / totalVideoDuration) * 100).toFixed(0));

    if (this.videoSeekerTranslateVal === 100) {
      this.isVideoPlaying = false;
    }
  }

  public toggleBookmark() {
    this.formLoaders = {
      ...this.formLoaders,
      bookmarkLoader: true,
    };
    this.isBookmarked = !this.isBookmarked;
    this.updateIncident(this.incidentType, 'BOOKMARK');
  }

  public completeCoaching() {
    this.formLoaders = {
      ...this.formLoaders,
      coachingLoader: true,
    };
    this.isBookmarked = true;
    this.updateIncident(this.incidentType, 'COACHING');
  }

  public toggleAdvancedView() {
    this.isMapMode = !this.isMapMode;
  }

  public onPlaybackError() {
    this.pauseVideo();
    this.isMediaAvailable = false;
  }

  public toggleFullscreen(videoId: string) {
    this.isFullscreen = !this.isFullscreen;
    const videoRef = document.getElementById(videoId) as HTMLVideoElement;
    if (this.isFullscreen) {
      // this.enterFullscreen(videoRef);
    } else {
      // this.exitFullscreen();
    }
  }

  // private exitFullscreen() {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document['webkitExitFullscreen']) {
  //     document['webkitExitFullscreen']();
  //   } else if (document['mozCancelFullScreen']) {
  //     document['mozCancelFullScreen']();
  //   } else if (document['msExitFullscreen']) {
  //     document['msExitFullscreen']();
  //   } else {
  //     this.snackbarService.failure(this.translate.instant('incidentModalFullScreenNotSupported'));
  //   }
  //   this.resetVideo();
  // }

  // private enterFullscreen(ele) {
  //   if (ele.requestFullscreen) {
  //     ele.requestFullscreen();
  //   } else if (ele.webkitRequestFullscreen) {
  //     ele.webkitRequestFullscreen();
  //   } else if (ele.mozRequestFullScreen) {
  //     ele.mozRequestFullScreen();
  //   } else if (ele.msRequestFullscreen) {
  //     ele.msRequestFullscreen();
  //   } else {
  //     this.snackbarService.failure(this.translate.instant('incidentModalFullScreenNotSupported'));
  //   }
  // }

  public pageEvent(event: any) {
    const { pageIndex = 0 } = event;
    this.resetData();
    this.setData(pageIndex);
  }

  public switchMedia() {
    this.isMediaStream1 = !this.isMediaStream1;
  }

  public setData(pageIndex: number) {
    const { allEvents = [] } = this.data || {};
    const {
      mediaFiles = [],
      eventVideoFilename = '',
      eventVideoFile = '',
      bookmark = false,
      tags = [],
      isDvrEvent = false,
      timelapseEnabled = false,
      commentsV2 = [],
      latitude = 0,
      longitude = 0,
      videoDetails = {},
      videoResolution = '',
      autoTags = [],
      coachingCompleted = false,
    } = allEvents[pageIndex];

    this.presentIndex = pageIndex;

    this.autoTags = autoTags.map((x:any ) => AUTO_TAGS_LIST[x]);

    setTimeout(() => {
      // incident marker
      // const marker = this.createMarker(latitude, longitude);
      // this.incidentMarker = [];
      // if (marker) {
      //   this.incidentMarker.push(marker);
      // }
    }, 100);

    if (isDvrEvent && videoResolution) {
      this.videoResolution = videoResolution.split('x')[1] || undefined;
    } else {
      this.videoResolution = videoDetails.videoHeight || undefined;
    }

    // media files
    if (mediaFiles && mediaFiles.length) {
      if (mediaFiles.length === 1) {
        this.incidentMedia1 = mediaFiles[0].mediaFile;
      } else {
        this.incidentMedia1 = mediaFiles[0].mediaFile;
        this.incidentMedia1Label = MEDIA_SOURCES_ENUM[mediaFiles[0].source];
        this.incidentMedia2 = mediaFiles[1].mediaFile;
        this.incidentMedia2Label = MEDIA_SOURCES_ENUM[mediaFiles[1].source];
      }
    } else {
      this.incidentMedia1 = eventVideoFilename || eventVideoFile;
    }

    this.assignMediaType();

    this.isBookmarked = bookmark;
    this.isCoachingCompleted = coachingCompleted;
    this.incidentType = isDvrEvent ? 'DVR' : 'INCIDENT';

    this.incidentTags.patchValue(tags);
    this.incidentTags.markAsPristine();
    this.incidentTags.markAsUntouched();

    this.commentList = commentsV2;
    this.fleetManagerCommentCount = this.commentList.filter((x: any) => x.userType === 'FLEET_MANAGER').length;

    this.isMapMode = timelapseEnabled ? false : true;
    this.isMediaAvailable = true;
    this.eventIndicatorList = [];
    if (timelapseEnabled) {
      this.getFilteredEventList();
    }

    this.playVideo();

    setTimeout(() => {
      this.playVideo();
    }, 100);
  }

  public assignMediaType() {
    if (this.incidentMedia1.indexOf('.jpg') > -1 || this.incidentMedia1.indexOf('.jpeg') > -1 || this.incidentMedia1.indexOf('.png') > -1) {
      this.mediaType = 'IMAGE';
      return;
    }
    if (this.incidentMedia1.indexOf('.mp4') > -1) {
      this.mediaType = 'VIDEO';
      return;
    }
  }

  public resetData() {
    this.isMapMode = true;
    this.isVideoPlaying = false;
    this.incidentMarker = [];
    this.incidentMedia1 = null;
    this.incidentMedia2 = null;
    this.videoSeekerTranslateVal = 0;
    if (this.videoRef) {
      this.videoRef.currentTime = 0;
    }
    if (this.videoRef2) {
      this.videoRef2.currentTime = 0;
    }
  }

  public saveTags() {
    this.formLoaders = {
      ...this.formLoaders,
      tagsLoader: true,
    };
    this.updateIncident(this.incidentType, 'TAGS');
  }

  public saveComment() {
    this.formLoaders = {
      ...this.formLoaders,
      commentLoader: true,
    };
    this.updateIncident(this.incidentType, 'COMMENT');
  }

  public updateIncident(type: string, updateType: any) {
    const { allEvents = [] } = this.data || {};
    const { tripId = '', driverId = '', eventIndex, uploadRequestId } = allEvents[this.paginator.pageIndex];
    // const { name = '', loginName = '' } = this.accessService.getLoginInfo();

    const commentV2:any = {
      userType: 'FLEET_MANAGER',
      text: this.incidentComment.value,
      // name: name || loginName,
      timestamp: new Date().toISOString(),
    };
    const tags = this.incidentTags.value;

    const otherParams =
      type === 'DVR'
        ? {
            uploadRequests: [
              {
                uploadRequestId,
                ...(updateType === 'COMMENT' && { commentV2, bookmark: true }),
                ...(updateType === 'TAGS' && { tags, bookmark: tags.length ? true : false }),
                ...(updateType === 'BOOKMARK' && { bookmark: this.isBookmarked }),
                ...(updateType === 'COACHING' && { bookmark: true, coachingCompleted: true }),
              },
            ],
          }
        : {
            events: [
              {
                eventIndex,
                ...(updateType === 'COMMENT' && { commentV2, bookmark: true }),
                ...(updateType === 'TAGS' && { tags, bookmark: tags.length ? true : false }),
                ...(updateType === 'BOOKMARK' && { bookmark: this.isBookmarked }),
                ...(updateType === 'COACHING' && { bookmark: true, coachingCompleted: true }),
              },
            ],
          };

    const body = {
      tripId,
      driverId,
      ...otherParams,
    };

    // const API = type === 'DVR' ? this.dataService.updateDvrMetadata(body) : this.dataService.updateEventMetadata(body);
    // API.pipe(
    //   finalize(() => {
    //     this.formLoaders = {
    //       bookmarkLoader: false,
    //       tagsLoader: false,
    //       commentLoader: false,
    //       coachingLoader: false,
    //     };
    //   }),
    //   takeUntil(this.ngUnsubscribe)
    // ).subscribe(
    //   () => {
    //     this.snackbarService.success(this.translate.instant('incidentModalUpdatedDeatilSuccess'));
    //     this.incidentComment.patchValue('');
    //     this.updateLocalData(type, body);
    //   },
    //   () => {
    //     this.snackbarService.failure(this.translate.instant('incidentModalUpdatedDeatilFailed'));
    //   }
    // );
  }

  private updateLocalData(type: string, updatedData?: any) {
    const { allEvents = [] } = this.data || {};
    const updatedAllEvents = allEvents.map((event: any) => {
      if (updatedData.tripId === event.tripId) {
        const { bookmark, tags, commentV2, coachingCompleted } = type === 'DVR' ? updatedData.uploadRequests[0] : updatedData.events[0];
        if (tags) {
          this.incidentTags.patchValue(tags);
          this.incidentTags.markAsPristine();
        }
        if (commentV2) {
          // this.commentList.push(commentV2);
          // this.commentList = this.commentList.reduce((unique, o) => {
          //   if (!unique.some((obj) => obj.text === o.text && obj.userType === o.userType)) {
          //     unique.push(o);
          //   }
          //   return unique;
          // }, []);
        }
        this.isBookmarked = bookmark;
        this.isCoachingCompleted = coachingCompleted;
        return {
          ...event,
          bookmark,
          tags,
          commentV2,
          coachingCompleted,
        };
      }
      return event;
    });

    this.incidentListDataSource = new MatTableDataSource<any>(updatedAllEvents);

    // scroll to bottom of commentList
    setTimeout(() => {
      const commentListDOM = document.getElementById('commentListDOM');
      if (commentListDOM) {
        commentListDOM.scrollTop = commentListDOM.scrollHeight;
        commentListDOM.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 200);

    this.fleetManagerCommentCount = this.commentList.filter((x: any) => {
      if (x && x.userType && x.userType === 'FLEET_MANAGER') {
        return x;
      }
    }).length;
  }

  public getFilteredEventList() {
    const { allEvents = [] } = this.data || {};
    const { tripId = '', driverId = '', startTimeUTC = '', endTimeUTC = '' } = allEvents[this.paginator.pageIndex];
    this.timelineLoader = true;

    const options = new GetEventListParams({
      tripId,
      driverId,
      includeViolations: true,
    });

    const otherParams = {
      startTimeUTC,
      endTimeUTC,
    };

    // this.tripDetailsService
    //   .getEventList(options, otherParams)
    //   .pipe(
    //     finalize(() => {
    //       this.timelineLoader = false;
    //     }),
    //     takeUntil(this.ngUnsubscribe)
    //   )
    //   .subscribe(
    //     (res) => {
    //       this.eventIndicatorList = res.filteredViolations.map(
    //         (event: { timestampUTC: string | number | Date; eventType: string | number }) => {
    //           const timeDiffInMilliSeconds = new Date(event.timestampUTC).valueOf() - new Date(startTimeUTC).valueOf();
    //           const timelapseTimeDiffInMilliSeconds = new Date(endTimeUTC).valueOf() - new Date(startTimeUTC).valueOf();
    //           const timelinePosition = ((timeDiffInMilliSeconds / timelapseTimeDiffInMilliSeconds) * 100).toFixed(2);
    //           const eventColor = EVENTS_CONFIG[event.eventType].color || undefined;
    //           const eventTypeLabel = EVENTS_CONFIG[event.eventType].label || undefined;
    //           return {
    //             ...event,
    //             eventTypeLabel,
    //             eventColor,
    //             timelinePosition,
    //           };
    //         }
    //       );
    //     },
    //     () => {
    //       this.eventIndicatorList = [];
    //     }
    //   );
  }

  public setVideoPlayTime(currentSliderVal: any) {
    const { duration = 1 } = this.videoRef || {};
    this.videoRef.currentTime = (currentSliderVal / 100) * duration;
    if (this.videoRef2) {
      this.videoRef2.currentTime = (currentSliderVal / 100) * duration;
    }
    if (currentSliderVal > 0 && currentSliderVal < 100) {
      this.playVideo();
    }
  }

  public onSliderChange(event: MatSliderChange) {
    this.setVideoPlayTime(event.value);
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
// function dirtyCheck(arg0: Observable<any>): import("rxjs").OperatorFunction<any, boolean> {
//   throw new Error('Function not implemented.');
// }

