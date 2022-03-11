import {ImportMappingFileParams, ImportMappingFileResult, SourceActions, SourceActionTypes} from './source.actions';
import {Source} from '../../_models/source';

export interface ISourceState {
  sources: Source[];
  selectedSource?: Source | null;
  selectedMappingFile?: ImportMappingFileParams | null;
  loadedMappingFile?: ImportMappingFileResult | null;
  errorMessage: any | null;
  isLoading: boolean;
  isMappingFileLoading: boolean;
}

export const initialSourceState: ISourceState = {
  sources: [],
  selectedSource: null,
  selectedMappingFile: null,
  loadedMappingFile: null,
  errorMessage: null,
  isLoading: false,
  isMappingFileLoading: false
};

export function sourceReducer(state = initialSourceState, action: SourceActions): ISourceState {
  switch (action.type) {

    case SourceActionTypes.LOAD_SOURCES:
      return {
        ...state,
        isLoading: true
      };

    case SourceActionTypes.LOAD_SOURCES_SUCCESS:
      return {
        ...state,
        sources: action.payload,
        errorMessage: null,
        isLoading: false
      };

    case SourceActionTypes.LOAD_SOURCES_FAILED:
      return {
        ...state,
        sources: [],
        errorMessage: action.payload.error,
        isLoading: false
      };

    case SourceActionTypes.IMPORT_SOURCE:
      return {
        ...state,
        selectedSource: null,
        isLoading: true,
        errorMessage: null
      };

    case SourceActionTypes.IMPORT_SOURCE_SUCCESS:
      return {
        ...state,
        selectedSource: action.payload,
        sources: [...state.sources, action.payload],
        errorMessage: null,
        isLoading: false
      };

    case SourceActionTypes.IMPORT_SOURCE_FAILED:
      return {
        ...state,
        errorMessage: action.payload.error,
        isLoading: false
      };

    case SourceActionTypes.INIT_SELECTED_SOURCE:
      return {
        ...state,
        selectedSource: null,
        errorMessage: null,
        isLoading: false
      };

      case SourceActionTypes.IMPORT_MAPPING_FILE:
        return {
          ...state,
          selectedMappingFile: null,
          errorMessage: null,
          isMappingFileLoading: true
      };

      case SourceActionTypes.IMPORT_MAPPING_FILE_SUCCESS:
        return {
          ...state,
          loadedMappingFile: action.payload,
          errorMessage: null,
          isMappingFileLoading: false
      };

      case SourceActionTypes.IMPORT_MAPPING_FILE_FAILED:
        return {
          ...state,
          errorMessage: action.payload.error,
          isMappingFileLoading: false
      };

      case SourceActionTypes.INIT_SELECTED_MAPPINGFILE:
        return {
          ...state,
          selectedMappingFile: null,
          loadedMappingFile: null
      };

      case SourceActionTypes.SELECT_MAPPINGFILE:
        return {
          ...state,
          selectedMappingFile: action.payload
      };

      default:
      return state;
  }
}
