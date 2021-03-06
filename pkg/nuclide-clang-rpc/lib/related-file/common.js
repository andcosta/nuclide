/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import {arrayEqual} from 'nuclide-commons/collection';
import fsPromise from 'nuclide-commons/fsPromise';
import nuclideUri from 'nuclide-commons/nuclideUri';
import {getFileBasename} from '../utils';

export async function searchFileWithBasename(
  dir: string,
  basename: string,
  condition: (file: string) => boolean,
): Promise<?string> {
  const files = await fsPromise.readdir(dir).catch(() => []);
  for (const file of files) {
    if (condition(file) && getFileBasename(file) === basename) {
      return nuclideUri.join(dir, file);
    }
  }
  return null;
}

export function findSubArrayIndex(arr: string[], subarr: string[]): number {
  for (let offset = 0; offset + subarr.length <= arr.length; offset++) {
    if (arrayEqual(arr.slice(offset, offset + subarr.length), subarr)) {
      return offset;
    }
  }
  return -1;
}
