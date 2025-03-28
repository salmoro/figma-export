/* eslint-disable import/order */

import svgstore from 'svgstore';

import * as FigmaExport from '@figma-export/types';

import { Options as SvgStoreOptions } from './svgstore.js';

import fs from 'fs';
import path from 'path';

type Options = {
    output: string;
    /** https://www.npmjs.com/package/svgstore#options */
    svgstoreConfig?: SvgStoreOptions;
    getIconId?: (options: FigmaExport.ComponentOutputterParamOption) => string;
}

export default ({
    output,
    getIconId = (options): string => `${options.pageName}/${options.componentName}`,
    svgstoreConfig = {},
}: Options): FigmaExport.ComponentOutputter => {
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            const sprites = svgstore(svgstoreConfig);

            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                sprites.add(getIconId(options), svg);
            });

            const filePath = path.resolve(output, `${pageName}.svg`);

            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, sprites.toString({}));
        });
    };
};
