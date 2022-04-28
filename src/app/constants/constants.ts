import { Breakpoints } from '@angular/cdk/layout';

export const VIDEO_LIST_TABLE_PAGE_SIZE = [5];
export const  VIOLATION_VIDEOS_TABLE_COLUMNS = ['eventType', 'eventTime', 'actions'];
export const DVR_REQUEST_LIST_TABLE_COLUMNS = ['requestType', 'requestCreated', 'startTime', 'endTime', 'driverId', 'assetId', 'actions'];
export const VIOLATION_PANIC_BUTTON_TABLE_COLUMNS = ['timestamp', 'driverName', 'actions'];
export const PAGINATE_SIZES = 10;
export const VIOLATIONS_TYPE_LIST = [
    {
      label: 'All Incidents',
      value: 'incidents',
      type: 'INCIDENT',
    },
    {
      label: 'Distracted Driving',
      value: 'Distracted-Driving',
      type: 'INCIDENT',
    },
    {
      label: 'Harsh Acceleration',
      value: 'Harsh-Acceleration',
      type: 'INCIDENT',
    },
    {
      label: 'Harsh Braking',
      value: 'Harsh-Braking',
      type: 'INCIDENT',
    },
    {
      label: 'Harsh Cornering',
      value: 'Cornering',
      type: 'INCIDENT',
    },
    {
      label: 'Lane Drift',
      value: 'Lane-Drift-Found',
      type: 'INCIDENT',
    },
    {
      label: 'Speed Limit Violation',
      value: 'Traffic-Speed-Violated',
      type: 'INCIDENT',
    },
    {
      label: 'Stop Sign Violation',
      value: 'Traffic-STOP-Sign-Violated',
      type: 'INCIDENT',
    },
    {
      label: 'Tailgating',
      value: 'Tail-Gating-Detected',
      type: 'INCIDENT',
      showDivider: true,
    },
    {
      label: 'DVR',
      value: 'dvr',
      type: 'DVR',
    },
    // {
    //   label: CLIENT_CONFIG.externalEventsLabel,
    //   value: 'externalEvents',
    //   type: 'EXTERNAL',
    // },
    {
      label: 'CellPhone',
      value: 'Cellphone-Distracted-Driving',
      type: 'INCIDENT',
      showDivider: true,
    },
    {
      label: 'Forward Collision',
      value: 'Forward-Collision-Warning',
      type: 'INCIDENT',
      showDivider: true,
    },
  ];
export  const TIME_LIMIT_IN_MS = 30 * 24 * 60 * 60 * 1000;

export const EVENTS_CONFIG: any = {
    'Traffic-Speed-Violated': {
      label: 'Speed Limit Violation',
      color: '#00bfff',
      showHighlights: true,
    },
    Cornering: {
      label: 'Harsh Cornering',
      color: '#8000ff',
      showHighlights: true,
    },
    'Traffic-STOP-Sign-Violated': {
      label: 'Stop Sign Violation',
      color: '#b5651d',
      showHighlights: true,
    },
    'Harsh-Braking': {
      label: 'Harsh Braking',
      color: '#ff00ff',
      showHighlights: true,
    },
    'Tail-Gating-Detected': {
      label: 'Tailgating',
      color: '#ffff00',
      showHighlights: true,
    },
    'Harsh-Acceleration': {
      label: 'Harsh Acceleration',
      color: '#228B22',
      showHighlights: true,
    },
    'Lane-Drift-Found': {
      label: 'Lane Drift',
      color: '#FFA500',
      showHighlights: false,
    },
    'Distracted-Driving': {
      label: 'Distracted Driving',
      color: '#e65000',
      showHighlights: true,
    },
    SAFETY: {
      label: 'SAFETY',
      color: '#25477B',
      showHighlights: true,
    },
    PRODUCTIVITY: {
      label: 'PRODUCTIVITY',
      color: '#25477B',
      showHighlights: true,
    },
    'FLEET OPTIMIZATION': {
      label: 'FLEET OPTIMIZATION',
      color: '#25477B',
      showHighlights: true,
    },
    COMPLIANCE: {
      label: 'COMPLIANCE',
      color: '#25477B',
      showHighlights: true,
    },
    SUSTAINABILITY: {
      label: 'SUSTAINABILITY',
      color: '#25477B',
      showHighlights: true,
    },
    ADVANCED: {
      label: 'ADVANCED',
      color: '#25477B',
      showHighlights: true,
    },
    'Cellphone-Distracted-Driving': {
      label: 'CellPhone',
      color: '#25477B',
      showHighlights: true,
    },
    'Forward-Collision-Warning': {
      label: 'Forward Collision',
      color: '#25477B',
      showHighlights: true,
    },
  };

  export const EVENT_TAG_KEYS: any = {
    CELLPHONE: 'Cellphone',
    COLLISION: 'Collision',
    EATING_OR_DRINKING: 'Drinking/Eating',
    NO_SEATBELT: 'No seatbelt',
    SMOKING: 'Smoking',
    OTHER: 'Other',
  };

  export const EVENT_TAG_LIST = [
    {
      value: 'CELLPHONE',
      text: 'Cellphone',
    },
    {
      value: 'COLLISION',
      text: 'Collision',
    },
    {
      value: 'EATING_OR_DRINKING',
      text: 'Drinking/Eating',
    },
    {
      value: 'NO_SEATBELT',
      text: 'No seatbelt',
    },
    {
      value: 'SMOKING',
      text: 'Smoking',
    },
    {
      value: 'OTHER',
      text: 'Other',
    },
  ];

  export const BREAKPOINTS_XSMALL = [Breakpoints.XSmall];
  export const BREAKPOINTS_SMALL = [Breakpoints.Small, Breakpoints.XSmall];
  export const BREAKPOINTS_MEDIUM = [Breakpoints.Medium];
  export const BREAKPOINTS_LARGE = [Breakpoints.Large, Breakpoints.XLarge];
  export const BREAKPOINTS_LANDSCAPE = [Breakpoints.HandsetLandscape];

  export const AUTO_TAGS_LIST: any = {
    DROWSY_DRIVING: 'Drowsy',
  };

  export const MEDIA_SOURCES_ENUM: any = {
    ROAD_FACING: 'Road facing',
    DRIVER_FACING: 'Driver facing',
    SIDE_BY_SIDE: 'Side-by-side',
    PIP_ROAD_MAJOR: 'PiP Road major',
    PIP_DRIVER_MAJOR: 'PiP Driver major',
  };

  export class GetEventListParams {
    public tripId: string;
    public driverId: string;
    public includeViolations: boolean;
  
    constructor({ tripId = '', driverId = '', includeViolations = false }) {
      this.tripId = tripId;
      this.driverId = driverId;
      this.includeViolations = includeViolations;
    }
  }