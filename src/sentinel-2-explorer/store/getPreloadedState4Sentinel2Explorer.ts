/* Copyright 2024 Esri
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
import { PartialRootState } from '@shared/store/configureStore';
import { getPreloadedState4Map } from '@shared/store/Map/getPreloadedState';
import { getPreloadedState4UI } from '@shared/store/UI/getPreloadedState';
import { getPreloadedState4ChangeCompareTool } from '@shared/store/ChangeCompareTool/getPreloadedState';
import { getPreloadedTrendToolState } from '@shared/store/TrendTool/getPreloadedState';
import { getPreloadedState4MaskTool } from '@shared/store/MaskTool/getPrelaodedState';
import { InterestingPlaceData } from '@typing/shared';
// import { LandsatRasterFunctionName } from '@shared/services/landsat-level-2/config';
import { getPreloadedState4ImageryScenes } from '@shared/store/ImageryScene/getPreloadedState';
import { getPreloadedState4SpectralProfileTool } from '@shared/store/SpectralProfileTool/getPreloadedState';
import { Sentinel2FunctionName } from '@shared/services/sentinel-2/config';

export const getPreloadedState = async (): Promise<PartialRootState> => {
    // get default raster function and location and pass to the getPreloadedMapState, getPreloadedUIState and getPreloadedImageryScenesState

    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const randomInterestingPlace: InterestingPlaceData = null;

    const defaultRasterFunction: Sentinel2FunctionName =
        'Natural Color with DRA';

    const preloadedState: PartialRootState = {
        Map: getPreloadedState4Map(hashParams, randomInterestingPlace),
        UI: getPreloadedState4UI(hashParams, randomInterestingPlace),
        ImageryScenes: getPreloadedState4ImageryScenes(
            hashParams,
            randomInterestingPlace,
            defaultRasterFunction
        ),
        ChangeCompareTool: getPreloadedState4ChangeCompareTool(hashParams),
        TrendTool: getPreloadedTrendToolState(hashParams),
        MaskTool: getPreloadedState4MaskTool(hashParams),
        SpectralProfileTool: getPreloadedState4SpectralProfileTool(hashParams),
    };

    return preloadedState;
};
