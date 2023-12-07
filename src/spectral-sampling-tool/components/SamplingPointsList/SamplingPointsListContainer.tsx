import React, { useEffect, useState } from 'react';
import { SamplingPointsList } from './SamplingPointsList';
import { selectListOfQueryParams } from '@shared/store/ImageryScene/selectors';
import { useSelector } from 'react-redux';
import { AddSamplingPointButton } from './AddSamplingPointButton';
import { useDispatch } from 'react-redux';
import {
    addNewItemToQueryParamsList,
    removeItemFromQueryParamsList,
} from '@shared/store/ImageryScene/thunks';
import {
    addSpectralSamplingPoint,
    resetCurrentSamplingSession,
    removeSpectralSamplingPoint,
} from '@shared/store/SpectralSamplingTool/thunks';
import { nanoid } from 'nanoid';
import { batch } from 'react-redux';
import { useFormattedSpectralSamplingData } from './useFormattedSpectralSamplingData';
import { selectedItemIdOfQueryParamsListChanged } from '@shared/store/ImageryScene/reducer';
import { selectClassifictionNameOfSpectralSamplingTask } from '@shared/store/SpectralSamplingTool/selectors';
import { SamplingSessionNameEditor } from './SamplingSessionNameEditor';
import {
    classificationNameUpdated,
    idOfItem2HighlightChanged,
} from '@shared/store/SpectralSamplingTool/reducer';
import { ResetDialog } from './ResetDialog';

export const SamplingPointsListContainer = () => {
    const dispatch = useDispatch();

    const samplingListData = useFormattedSpectralSamplingData();

    // classification name of the current spectral sampling session
    const classificationName = useSelector(
        selectClassifictionNameOfSpectralSamplingTask
    );

    const [shouldShowResetDialog, setShouldShowResetDialog] = useState(false);

    const samplingPointOnAdd = () => {
        // use the same unique id so that the query params of the imagery scene and
        // the sampling point data can be joined
        const idOfSamplingPoint2Add = nanoid(5);

        batch(() => {
            dispatch(addNewItemToQueryParamsList(idOfSamplingPoint2Add));
            dispatch(addSpectralSamplingPoint(idOfSamplingPoint2Add));
        });
    };

    const samplingPointOnRemove = (idOfItemToRemove: string) => {
        console.log(idOfItemToRemove);
        batch(() => {
            dispatch(removeItemFromQueryParamsList(idOfItemToRemove));
            dispatch(removeSpectralSamplingPoint(idOfItemToRemove));
        });
    };

    useEffect(() => {
        // we should add a sampling point using query params from the main scene
        // when there is no sampling point. Only need to do this when the Animation Controls is mounted.
        if (samplingListData.length === 0) {
            // dispatch(addNewItemToListOfQueryParams(nanoid(5)));
            samplingPointOnAdd();
        }
    }, [samplingListData]);

    if (!classificationName) {
        return (
            <SamplingSessionNameEditor
                classificationNameOnEnter={(name) => {
                    dispatch(classificationNameUpdated(name));
                }}
            />
        );
    }

    if (shouldShowResetDialog) {
        return (
            <ResetDialog
                cancelButtonOnClick={setShouldShowResetDialog.bind(null, false)}
                resetButtonOnClick={() => {
                    dispatch(resetCurrentSamplingSession());

                    // close the reset dialog
                    setShouldShowResetDialog(false);
                }}
            />
        );
    }

    return (
        <div className="w-full h-full relative">
            <div className="flex items-center">
                <h5 className="text-sm text-ellipsis flex-grow">
                    {classificationName}:
                </h5>

                <div
                    className="cursor-pointer ml-1"
                    onClick={setShouldShowResetDialog.bind(null, true)}
                >
                    <calcite-icon
                        className="cursor-pointer"
                        scale="s"
                        icon="reset"
                    />
                </div>
            </div>

            <SamplingPointsList
                data={samplingListData}
                onSelect={(uniqueId) => {
                    dispatch(selectedItemIdOfQueryParamsListChanged(uniqueId));
                }}
                onRemove={samplingPointOnRemove}
                item2HighlightOnToggle={(uniqueId) => {
                    dispatch(idOfItem2HighlightChanged(uniqueId));
                }}
            />

            <AddSamplingPointButton
                shouldDisableAddButton={samplingListData?.length >= 100}
                addButtonOnClick={samplingPointOnAdd}
            />

            {samplingListData && samplingListData.length <= 1 ? (
                <div className="absolute w-full left-0 bottom-0">
                    <p className="text-xs opacity-50">
                        Add sampling points to this list.
                    </p>
                </div>
            ) : null}
        </div>
    );
};
