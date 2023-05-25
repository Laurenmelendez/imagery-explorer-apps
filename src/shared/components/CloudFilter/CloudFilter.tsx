import React, { FC, useEffect, useRef } from 'react';
import ISlider from 'esri/widgets/Slider';
import { loadModules } from 'esri-loader';
import classNames from 'classnames';
import { Slider } from '../Slider/Slider';

type Props = {
    /**
     * user selected cloud coverage threshold ranges from 0 to 1
     */
    cloudCoverage: number;
    /**
     * if true, Cloud Filter should be disabled
     */
    disabled: boolean;
    /**
     * fires when user selects a new cloud coverage threshold
     * @param val new cloud coverage threshold
     * @returns
     */
    onChange: (val: number) => void;
};

type TitleTextProps = {
    cloudCoverage: number;
};

const TitleText: FC<TitleTextProps> = ({ cloudCoverage }: TitleTextProps) => {
    const getFormattedCouldCoverageInPercent = () => {
        if (isNaN(cloudCoverage)) {
            return 'N/A';
        }

        return `${Math.floor(cloudCoverage * 100)}%`;
    };

    return (
        <div className="text-xs">
            <span className="uppercase text-custom-light-blue-50 mr-1">
                Cloud Tolerance
            </span>

            <span>{getFormattedCouldCoverageInPercent()}</span>
        </div>
    );
};

/**
 * A slider component to select cloud coverage that will be used to find Landsat scenes
 * @param param0
 * @returns
 */
export const CloudFilter: FC<Props> = ({
    cloudCoverage,
    disabled,
    onChange,
}) => {
    const cloudIconOnClick = (shouldDecrement: boolean) => {
        // do the calculation using integer to make the result more accurate
        let newVal = cloudCoverage * 100;

        if (shouldDecrement) {
            newVal -= 10;
        } else {
            newVal += 10;
        }

        if (newVal > 100) {
            newVal = 100;
        }

        if (newVal < 0) {
            newVal = 0;
        }

        // convert back to the val within range of 0 - 1
        newVal = newVal / 100;

        onChange(newVal);
    };

    return (
        <div
            className={classNames('mx-2 flex items-center', {
                'is-disabled': disabled,
            })}
        >
            <TitleText cloudCoverage={cloudCoverage} />

            <div className="flex items-center ml-3">
                {/* use offline icon to indicate low cloud tolerance */}
                <calcite-icon
                    scale="s"
                    icon="offline"
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={cloudIconOnClick.bind(null, true)}
                />

                <div
                    // id="cloud-filter-container"
                    className="w-20 h-4 mx-3"
                >
                    <Slider value={cloudCoverage} onChange={onChange} />
                </div>

                {/* use online icon to indicate high cloud tolerance */}
                <calcite-icon
                    scale="s"
                    icon="online"
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={cloudIconOnClick.bind(null, false)}
                />
            </div>
        </div>
    );
};
