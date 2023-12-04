import React, { useEffect } from 'react';
import { SamplingDataList } from './SamplingDataList';
import { selectListOfQueryParams } from '@shared/store/ImageryScene/selectors';
import { useSelector } from 'react-redux';
import { SamplingDataControls } from './SamplingDataControls';
import { useDispatch } from 'react-redux';
import {
    addNewItemToListOfQueryParams,
    removeItemFromListOfQueryParams,
} from '@shared/store/ImageryScene/thunks';
import {
    addSpectralSamplingPoint,
    removeSpectralSamplingPoint,
} from '@shared/store/SpectralSamplingTool/thunks';
import { nanoid } from 'nanoid';
import { batch } from 'react-redux';
import { useSamplingListData } from './useSamplingListData';
import { idOfSelectedItemInListOfQueryParamsChanged } from '@shared/store/ImageryScene/reducer';
import { selectClassifictionNameOfSpectralSamplingTask } from '@shared/store/SpectralSamplingTool/selectors';
import { ClassificationNameEditor } from './ClassificationNameEditor';
import { classificationNameUpdated } from '@shared/store/SpectralSamplingTool/reducer';

export const SamplingDataListContainer = () => {
    const dispatch = useDispatch();

    const samplingListData = useSamplingListData();

    // classification name of the current spectral sampling session
    const classificationName = useSelector(
        selectClassifictionNameOfSpectralSamplingTask
    );

    const samplingPointOnAdd = () => {
        // use the same unique id so that the query params of the imagery scene and
        // the sampling point data can be joined
        const idOfSamplingPoint2Add = nanoid(5);

        batch(() => {
            dispatch(addNewItemToListOfQueryParams(idOfSamplingPoint2Add));
            dispatch(addSpectralSamplingPoint(idOfSamplingPoint2Add));
        });
    };

    const samplingPointOnRemove = (idOfItemToRemove: string) => {
        console.log(idOfItemToRemove);
        batch(() => {
            dispatch(removeItemFromListOfQueryParams(idOfItemToRemove));
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
    }, []);

    if (!classificationName) {
        return (
            <ClassificationNameEditor
                classificationNameOnEnter={(name) => {
                    dispatch(classificationNameUpdated(name));
                }}
            />
        );
    }

    return (
        <div className="w-full h-full relative">
            <h5 className="text-sm text-ellipsis">
                Sampling session for {classificationName}:
            </h5>

            <SamplingDataList
                data={samplingListData}
                onSelect={(uniqueId) => {
                    dispatch(
                        idOfSelectedItemInListOfQueryParamsChanged(uniqueId)
                    );
                }}
                onRemove={samplingPointOnRemove}
            />

            <SamplingDataControls
                shouldDisableAddButton={samplingListData?.length >= 10}
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
