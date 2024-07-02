//-- Project Code
export type {Distinct} from './types';
export type {
    AnimationFrameCallback,
    AnimationFrameRequestID,
    DocumentEventListener,
    SetIntervalCallback,
    SetIntervalRequestID,
    SetTimeoutCallback,
    SetTimeoutRequestID,
    WindowEventListener
} from './dom';
export {
    addDocumentEventListener,
    addEventListener,
    addWindowEventListener,
    cancelAnimationFrame,
    clearInterval,
    clearTimeout,
    domReady,
    isDOMReady,
    removeDocumentEventListener,
    removeEventListener,
    removeWindowEventListener,
    requestAnimationFrame,
    setInterval,
    setTimeout
} from './dom';
export type {UUID} from './uuid';
export {createUUID, isUUID} from './uuid';
