import { AssetViolationTableActions, AssetViolationTableActionTypes } from '../actions/asset-violation.action';

export interface State {
  pageIndex: number;
  sortKey: string;
  sortDirection: string;
}

export const initialState: State = {
  pageIndex: 0,
  sortKey: 'timeStamp',
  sortDirection: 'desc',
};

export function reducer(state = initialState, action: AssetViolationTableActions): State {
  switch (action.type) {
    case AssetViolationTableActionTypes.UpdateAssetViolationTableSort:
      return {
        ...state,
        pageIndex: 0,
        sortKey: action.payload.sortKey,
        sortDirection: action.payload.sortDirection,
      };
    case AssetViolationTableActionTypes.UpdateAssetViolationTablePageIndex:
      return {
        ...state,
        pageIndex: action.payload.pageIndex,
      };

    case AssetViolationTableActionTypes.ResetAssetViolationTableState:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
}
