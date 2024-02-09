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

import React from 'react';
import { RenderingControls } from './RenderingControls';
import {
    maskLayerOpacityChanged,
    shouldClipMaskLayerToggled,
} from '@shared/store/MaskTool/reducer';
import {
    selectMaskLayerOpcity,
    selectMaskOptions,
    selectShouldClipMaskLayer,
} from '@shared/store/MaskTool/selectors';
import { updateMaskColor } from '@shared/store/MaskTool/thunks';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const RenderingControlsContainer = () => {
    const dispatch = useDispatch();

    /**
     * options for selected spectral index
     */
    const maskOptions = useSelector(selectMaskOptions);

    /**
     * opacity of the mask layer
     */
    const opacity = useSelector(selectMaskLayerOpcity);

    /**
     * if true, use mask layer to clip the imagery scene
     */
    const shouldClip = useSelector(selectShouldClipMaskLayer);

    return (
        <RenderingControls
            transparence={1 - opacity}
            shouldClip={shouldClip}
            color={maskOptions.color}
            colorOnChange={(color) => {
                dispatch(updateMaskColor(color));
            }}
            shouldClipOnToggle={() => {
                dispatch(shouldClipMaskLayerToggled());
            }}
            transparenceOnChange={(val) => {
                dispatch(maskLayerOpacityChanged(1 - val));
            }}
        />
    );
};
