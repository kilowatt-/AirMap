export const SET_LOCATION = 'SET_LOCATION';
export const SET_BOUNDS = 'SET_BOUNDS';
export const LOAD_VISIBLE_MARKERS_START = 'LOAD_VISIBLE_MARKERS_START';
export const LOAD_VISIBLE_MARKERS_FINISH = 'LOAD_VISIBLE_MARKETS_FINISH';
export const LOAD_VISIBLE_MARKERS_ERROR = 'LOAD_VISIBLE_MARKERS_ERROR';


export function loadVisibleMarkersStart() {
    return {
        type: LOAD_VISIBLE_MARKERS_START
    };
}

export function loadVisibleMarkersFinish(markers) {
    return {
        type: LOAD_VISIBLE_MARKERS_FINISH,
        payload: markers
    }
}

export function loadVisibleMarkersError(err) {
    return {
        type: LOAD_VISIBLE_MARKERS_ERROR,
        payload: err
    }
}

