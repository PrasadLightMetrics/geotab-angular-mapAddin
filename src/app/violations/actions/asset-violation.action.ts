import { Action } from '@ngrx/store';

export enum AssetViolationTableActionTypes {
  UpdateAssetViolationTableSort = '[AssetViolation] Update AssetViolation Table Sorting',

  UpdateAssetViolationTablePageIndex = '[AssetViolation] Update AssetViolation Table Page Index',
  ResetAssetViolationTablePageIndex = '[AssetViolation] Reset AssetViolation Table Page Index',
  ResetAssetViolationTableState = '[AssetViolation] Reset AssetViolation Table State',
}

export class UpdateAssetViolationTableSort implements Action {
  public readonly type = AssetViolationTableActionTypes.UpdateAssetViolationTableSort;

  constructor(
    public payload: {
      sortKey: string;
      sortDirection: string;
    }
  ) {}
}

export class UpdateAssetViolationTablePageIndex implements Action {
  public readonly type = AssetViolationTableActionTypes.UpdateAssetViolationTablePageIndex;

  constructor(
    public payload: {
      pageIndex: number;
    }
  ) {}
}

export class ResetAssetViolationTableState implements Action {
  public readonly type = AssetViolationTableActionTypes.ResetAssetViolationTableState;
}

export type AssetViolationTableActions = UpdateAssetViolationTableSort | ResetAssetViolationTableState | UpdateAssetViolationTablePageIndex;
