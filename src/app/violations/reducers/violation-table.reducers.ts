import { ViolationTableActions, ViolationTableActionTypes } from '../actions/violation-table.action';

export interface State {
  pageIndex: number;
  sortKey: string;
  sortDirection: string;
}

export const initialState: State = {
  pageIndex: 0,
  sortKey: 'value',
  sortDirection: 'desc',
};

export function reducer(state = initialState, action: ViolationTableActions): State {
  switch (action.type) {
    case ViolationTableActionTypes.UpdateViolationTableSort:
      return {
        ...state,
        pageIndex: 0,
        sortKey: action.payload.sortKey,
        sortDirection: action.payload.sortDirection,
      };
    case ViolationTableActionTypes.UpdateViolationTablePageIndex:
      return {
        ...state,
        pageIndex: action.payload.pageIndex,
      };

    case ViolationTableActionTypes.ResetViolationTableState:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
}
