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

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

export const selectSelectedIndex4MaskTool = createSelector(
    (state: RootState) => state.MaskTool.selectedIndex,
    (selectedIndex) => selectedIndex
);

export const selectMaskOptions = createSelector(
    (state: RootState) => state.MaskTool.selectedIndex,
    (state: RootState) => state.MaskTool.maskOptionsBySelectedIndex,
    (selectedIndex, maskOptionsBySpectralIndex) =>
        maskOptionsBySpectralIndex[selectedIndex]
);

export const selectMaskLayerOpcity = createSelector(
    (state: RootState) => state.MaskTool.maskLayerOpacity,
    (maskLayerOpacity) => maskLayerOpacity
);

export const selectShouldClipMaskLayer = createSelector(
    (state: RootState) => state.MaskTool.shouldClipMaskLayer,
    (shouldClipMaskLayer) => shouldClipMaskLayer
);

export const selectMaskToolState = createSelector(
    (state: RootState) => state.MaskTool,
    (maskTool) => maskTool
);
