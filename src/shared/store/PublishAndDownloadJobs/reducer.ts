import {
    createSlice,
    // createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { AppName } from '@shared/config';
import { RasterAnalysisTaskName } from '@shared/services/raster-analysis/types';

/**
 * Enum representing different save options available in the application.
 */
export enum PublishAndDownloadJobType {
    PublishScene = 'Publish Scene',
    PublishIndexMask = 'Publish Index Mask',
    PublishChangeDetection = 'Publish Change Detection',
    DownloadIndexMask = 'Download Index Mask',
    SaveWebMappingApp = 'Save Web Mapping App',
    SaveWebMap = 'Save Web Map',
}

export enum PublishAndDownloadJobStatus {
    Submitted = 'esriJobSubmitted',
    New = 'esriJobNew',
    Waiting = 'esriJobWaiting',
    Executing = 'esriJobExecuting',
    Succeeded = 'esriJobSucceeded',
    Failed = 'esriJobFailed',
    TimedOut = 'esriJobTimedOut',
    Cancelling = 'esriJobCancelling',
    Cancelled = 'esriJobCancelled',
    Expired = 'esriJobExpired',
}

export type PublishAndDownloadJob = {
    /**
     * unique id of the job
     */
    id: string;
    /**
     * title of the job
     */
    title: string;
    /**
     * summary of the job
     */
    summary: string;
    /**
     * type of the job
     */
    type: PublishAndDownloadJobType;
    /**
     * id of the user who created the job
     */
    creator: string;
    /**
     * unix timestamp of when the job was created
     */
    createdAt: number;
    /**
     * unix timestamp of when the job was last updated
     */
    updatedAt: number;
    /**
     * name of the imagery explorer app that initiated the job
     */
    appName: AppName;
    /**
     * status of the job
     */
    status: PublishAndDownloadJobStatus;
    /**
     * id of the imagery scene the job is related to
     */
    sceneId?: string;
    /**
     * URL of the job output. It can be the URL of the GeoTIFF file generated by the download raster job
     */
    outputURL?: string;
    /**
     * The item ID of the job output in ArcGIS Online
     */
    outputItemId?: string;
    /**
     * id of the raster analysis job assigned by the raster analysis service
     */
    rasterAnanlysisJobId?: string;
    /**
     * name of the raster analysis task
     */
    rasterAnalysisTaskName?: RasterAnalysisTaskName;
    /**
     * error message of the failed job
     */
    errormessage?: string;
};

// import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
export type PublishAndDownloadJobsState = {
    jobs: {
        byId: {
            [jobId: string]: PublishAndDownloadJob;
        };
        allIds: string[];
    };
};

export const initialPublishAndDownloadJobsState: PublishAndDownloadJobsState = {
    jobs: {
        byId: {},
        allIds: [],
    },
};

const slice = createSlice({
    name: 'PublishAndDownloadJobs',
    initialState: initialPublishAndDownloadJobsState,
    reducers: {
        jobAdded: (state, action: PayloadAction<PublishAndDownloadJob>) => {
            const job = action.payload;
            state.jobs.byId[job.id] = job;
            state.jobs.allIds.push(job.id);
        },
        jobRemoved: (state, action: PayloadAction<string>) => {
            const jobId = action.payload;
            delete state.jobs.byId[jobId];
            state.jobs.allIds = state.jobs.allIds.filter((id) => id !== jobId);
        },
        jobUpdated: (state, action: PayloadAction<PublishAndDownloadJob>) => {
            const job = action.payload;
            if (state.jobs.byId[job.id]) {
                state.jobs.byId[job.id] = job;
            }
        },
    },
});

const { reducer } = slice;

export const { jobAdded, jobRemoved, jobUpdated } = slice.actions;

export default reducer;
