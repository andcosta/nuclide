'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HhvmLaunchAttachProvider = undefined;

var _nuclideDebuggerBase;

function _load_nuclideDebuggerBase() {
  return _nuclideDebuggerBase = require('../../nuclide-debugger-base');
}

var _react = _interopRequireDefault(require('react'));

var _LaunchUiComponent;

function _load_LaunchUiComponent() {
  return _LaunchUiComponent = require('./LaunchUiComponent');
}

var _AttachUiComponent;

function _load_AttachUiComponent() {
  return _AttachUiComponent = require('./AttachUiComponent');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

class HhvmLaunchAttachProvider extends (_nuclideDebuggerBase || _load_nuclideDebuggerBase()).DebuggerLaunchAttachProvider {
  constructor(debuggingTypeName, targetUri) {
    super(debuggingTypeName, targetUri);
  }

  getActions() {
    return Promise.resolve(['Attach', 'Launch']);
  }

  getComponent(action, parentEventEmitter) {
    if (action === 'Launch') {
      return _react.default.createElement((_LaunchUiComponent || _load_LaunchUiComponent()).LaunchUiComponent, {
        targetUri: this.getTargetUri(),
        parentEmitter: parentEventEmitter
      });
    } else if (action === 'Attach') {
      return _react.default.createElement((_AttachUiComponent || _load_AttachUiComponent()).AttachUiComponent, {
        targetUri: this.getTargetUri(),
        parentEmitter: parentEventEmitter
      });
    } else {
      if (!false) {
        throw new Error('Unrecognized action for component.');
      }
    }
  }

  dispose() {}
}
exports.HhvmLaunchAttachProvider = HhvmLaunchAttachProvider;