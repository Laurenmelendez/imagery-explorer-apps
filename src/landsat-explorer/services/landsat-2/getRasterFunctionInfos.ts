import { RasterFunctionInfo } from '../../../types/imagery-service';
import { RasterFunctionInfos } from './config';

/**
 * Get raster function infos of the Landsat-2 Imagery Service
 * @returns
 */
export const getRasterFunctionInfos = (): RasterFunctionInfo[] => {
    const data = RasterFunctionInfos.slice(0, 9);
    return data;
};
