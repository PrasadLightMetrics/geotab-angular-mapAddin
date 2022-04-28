import { Action } from '@ngrx/store';

export enum ViolationTableActionTypes {
  UpdateViolationTableSort = '[Violation] Update Violation Table Sorting',

  UpdateViolationTablePageIndex = '[Violation] Update Violation Table Page Index',
  ResetViolationTablePageIndex = '[Violation] Reset Violation Table Page Index',
  ResetViolationTableState = '[Violation] Reset Violation Table State',
}

export class UpdateViolationTableSort implements Action {
  public readonly type = ViolationTableActionTypes.UpdateViolationTableSort;

  constructor(
    public payload: {
      sortKey: string;
      sortDirection: string;
    }
  ) {}
}

export class UpdateViolationTablePageIndex implements Action {
  public readonly type = ViolationTableActionTypes.UpdateViolationTablePageIndex;

  constructor(
    public payload: {
      pageIndex: number;
    }
  ) {}
}

export class ResetViolationTableState implements Action {
  public readonly type = ViolationTableActionTypes.ResetViolationTableState;
}

export type ViolationTableActions = UpdateViolationTableSort | ResetViolationTableState | UpdateViolationTablePageIndex;
