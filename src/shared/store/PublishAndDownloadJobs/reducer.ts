/* Copyright 2025 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    createSlice,
    // createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { AppName } from '@shared/config';
import {
    RasterAnalysisRasterFunction,
    RasterAnalysisTaskName,
} from '@shared/services/raster-analysis/types';

/**
 * Enum representing different save options available in the application.
 */
export enum PublishAndDownloadJobType {
    PublishScene = 'Publish Scene',
    PublishIndexMask = 'Publish Index Mask',
    PublishChangeDetection = 'Publish Change Detection',
    // DownloadIndexMask = 'Download Index Mask',
    SaveWebMappingApp = 'Save Web Mapping App',
    SaveWebMap = 'Save Web Map',
    SaveWebMapWithMultipleScenes = 'Save Web Map with Multiple Scenes',
    SaveWebMapWithMultipleScenesInSingleLayer = 'Save Web Map with Multiple Scenes in Single Layer',
}

/**
 * type of the publish
 */
export type PublishJob =
    | PublishAndDownloadJobType.PublishChangeDetection
    | PublishAndDownloadJobType.PublishIndexMask
    | PublishAndDownloadJobType.PublishScene;

export enum PublishAndDownloadJobStatus {
    /**
     * The job is pending checking cost
     */
    PendingCheckingCost = 'pendingCheckingCost',
    // /**
    //  * In process of checking cost of the job
    //  */
    // CheckingCost = 'checkingCost',
    /**
     * The job is pending user approval for actual cost
     */
    PendingUserApprovalForActualCost = 'pendingUserApprovalForActualCost',
    /**
     * The job is submitted
     */
    Submitted = 'esriJobSubmitted',
    /**
     * The new raster analysis job is created
     */
    New = 'esriJobNew',
    /**
     * The job is waiting in the queue
     */
    Waiting = 'esriJobWaiting',
    /**
     * The job is in progress
     */
    Executing = 'esriJobExecuting',
    /**
     * The job is succeeded
     */
    Succeeded = 'esriJobSucceeded',
    /**
     * The job is failed
     */
    Failed = 'esriJobFailed',
    /**
     * The job is timed out
     */
    TimedOut = 'esriJobTimedOut',
    /**
     * The job is cancelling
     */
    Cancelling = 'esriJobCancelling',
    /**
     * The job is cancelled
     */
    Cancelled = 'esriJobCancelled',
    /**
     * The job is expired
     */
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
     * if true, the job output will be published to the hosted imagery service
     */
    publishToHostedImageryService: boolean;
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
    /**
     * progress of the job, 0-100
     */
    progress?: number;
    /**
     * estimated cost of the raster analysis job
     */
    estimatedCost?: number;
    /**
     * actual cost of the raster analysis job
     */
    actualCost?: number;
    /**
     * raster function of the raster analysis job.
     * It is a JSON object that represents the raster function chain.
     */
    rasterFunction?: RasterAnalysisRasterFunction;
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
        jobsCleared: (state) => {
            state.jobs.byId = {};
            state.jobs.allIds = [];
        },
    },
});

const { reducer } = slice;

export const { jobAdded, jobRemoved, jobUpdated, jobsCleared } = slice.actions;

export default reducer;
