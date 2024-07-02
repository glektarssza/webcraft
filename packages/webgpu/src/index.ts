/// <reference types="@webgpu/types" />

//-- Project Code
export type {Canvas} from './types';
export type {
    WebGPUContext,
    WebGPUContextBase,
    WebGPUContextOptions,
    WebGPUHTMLContext,
    WebGPUOffscreenContext
} from './context';
export {
    createContext,
    createHTMLContext,
    createOffscreenContext
} from './context';
export type {WebGPUBuffer} from './buffer';
export {createBuffer, uploadData} from './buffer';
