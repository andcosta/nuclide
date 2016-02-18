var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _logging = require('../../logging/');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var logger = (0, _logging.getLogger)();

var _require = require('atom');

var CompositeDisposable = _require.CompositeDisposable;
var TextBuffer = _require.TextBuffer;

var _require2 = require('../../analytics');

var track = _require2.track;

var NuclideTextBuffer = (function (_TextBuffer) {
  _inherits(NuclideTextBuffer, _TextBuffer);

  function NuclideTextBuffer(connection, params) {
    _classCallCheck(this, NuclideTextBuffer);

    _get(Object.getPrototypeOf(NuclideTextBuffer.prototype), 'constructor', this).call(this, params);
    this.connection = connection;
    this.setPath(params.filePath);
    var encoding = atom.config.get('core.fileEncoding');
    this.setEncoding(encoding);
  }

  // Atom 1.4.0+ serializes TextBuffers with the ID generated by `getId`. When
  // a buffer is deserialized, it is looked up in the buffer cache by this key.
  // The logic there is setup to create a new buffer when there is a cache miss.
  // However, when there is no key, it's not looked up in cache, but rather by
  // its path. This behavior ensures that when a connection is reestablished,
  // a buffer exists with that path. See https://github.com/atom/atom/pull/9968.

  _createClass(NuclideTextBuffer, [{
    key: 'getId',
    value: function getId() {
      return '';
    }
  }, {
    key: 'setPath',
    value: function setPath(filePath) {
      if (!this.connection) {
        // If this.connection is not set, then the superclass constructor is still executing.
        // NuclideTextBuffer's constructor will ensure setPath() is called once this.constructor
        // is set.
        return;
      }
      if (filePath === this.getPath()) {
        return;
      }
      if (filePath) {
        this.file = this.createFile(filePath);
        if (this.file !== null) {
          var file = this.file;
          file.setEncoding(this.getEncoding());
          this.subscribeToFile();
        }
      } else {
        this.file = null;
      }
      this.emitter.emit('did-change-path', this.getPath());
    }
  }, {
    key: 'createFile',
    value: function createFile(filePath) {
      return this.connection.createFile(filePath);
    }
  }, {
    key: 'saveAs',
    value: _asyncToGenerator(function* (filePath) {
      if (!filePath) {
        throw new Error('Can\'t save buffer with no file path');
      }

      var success = undefined;
      this.emitter.emit('will-save', { path: filePath });
      this.setPath(filePath);
      try {
        (0, _assert2['default'])(this.file);
        var file = this.file;
        yield file.write(this.getText());
        this.cachedDiskContents = this.getText();
        this.conflict = false;
        /* $FlowFixMe Private Atom API */
        this.emitModifiedStatusChanged(false);
        this.emitter.emit('did-save', { path: filePath });
        success = true;
      } catch (e) {
        logger.fatal('Failed to save remote file.', e);
        atom.notifications.addError('Failed to save remote file: ' + e.message);
        success = false;
      }

      track('remoteprojects-text-buffer-save-as', {
        'remoteprojects-file-path': filePath,
        'remoteprojects-save-success': success.toString()
      });
    })
  }, {
    key: 'updateCachedDiskContentsSync',
    value: function updateCachedDiskContentsSync() {
      throw new Error('updateCachedDiskContentsSync isn\'t supported in NuclideTextBuffer');
    }
  }, {
    key: 'subscribeToFile',
    value: function subscribeToFile() {
      var _this = this;

      if (this.fileSubscriptions) {
        this.fileSubscriptions.dispose();
      }
      (0, _assert2['default'])(this.file);
      this.fileSubscriptions = new CompositeDisposable();

      this.fileSubscriptions.add(this.file.onDidChange(_asyncToGenerator(function* () {
        var isModified = yield _this._isModified();
        if (isModified) {
          _this.conflict = true;
        }
        var previousContents = _this.cachedDiskContents;
        /* $FlowFixMe Private Atom API */
        yield _this.updateCachedDiskContents();
        if (previousContents === _this.cachedDiskContents) {
          return;
        }
        if (_this.conflict) {
          _this.emitter.emit('did-conflict');
        } else {
          _this.reload();
        }
      })));

      (0, _assert2['default'])(this.file);
      this.fileSubscriptions.add(this.file.onDidDelete(function () {
        var modified = _this.getText() !== _this.cachedDiskContents;
        /* $FlowFixMe Private Atom API */
        _this.wasModifiedBeforeRemove = modified;
        if (modified) {
          /* $FlowFixMe Private Atom API */
          _this.updateCachedDiskContents();
        } else {
          /* $FlowFixMe Private Atom API */
          _this.destroy();
        }
      }));

      (0, _assert2['default'])(this.file);
      this.fileSubscriptions.add(this.file.onDidRename(function () {
        _this.emitter.emit('did-change-path', _this.getPath());
      }));

      (0, _assert2['default'])(this.file);
      this.fileSubscriptions.add(this.file.onWillThrowWatchError(function (errorObject) {
        _this.emitter.emit('will-throw-watch-error', errorObject);
      }));
    }
  }, {
    key: '_isModified',
    value: _asyncToGenerator(function* () {
      if (!this.loaded) {
        return false;
      }
      if (this.file) {
        var exists = yield this.file.exists();
        if (exists) {
          return this.getText() !== this.cachedDiskContents;
        } else {
          return this.wasModifiedBeforeRemove != null ? this.wasModifiedBeforeRemove : !this.isEmpty();
        }
      } else {
        return !this.isEmpty();
      }
    })
  }]);

  return NuclideTextBuffer;
})(TextBuffer);

module.exports = NuclideTextBuffer;

/* $FlowFixMe */
//# sourceMappingURL=data:application/json;base64,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QztLQUNMOzs7NkJBRWdCLGFBQXFCO0FBQ3BDLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLGVBQU8sS0FBSyxDQUFDO09BQ2Q7QUFDRCxVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDYixZQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDeEMsWUFBSSxNQUFNLEVBQUU7QUFDVixpQkFBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssSUFBSSxDQUFDLGtCQUFrQixDQUFDO1NBQ25ELE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUMsdUJBQXVCLElBQUksSUFBSSxHQUN6QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEQ7T0FDRixNQUFNO0FBQ0wsZUFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN4QjtLQUNGOzs7U0F2SkcsaUJBQWlCO0dBQVMsVUFBVTs7QUEwSjFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMiLCJmaWxlIjoiTnVjbGlkZVRleHRCdWZmZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7UmVtb3RlQ29ubmVjdGlvbn0gZnJvbSAnLi4vLi4vcmVtb3RlLWNvbm5lY3Rpb24vbGliL1JlbW90ZUNvbm5lY3Rpb24nO1xuaW1wb3J0IHR5cGUgUmVtb3RlRmlsZSBmcm9tICcuLi8uLi9yZW1vdGUtY29ubmVjdGlvbi9saWIvUmVtb3RlRmlsZSc7XG5cbmltcG9ydCB7Z2V0TG9nZ2VyfSBmcm9tICcuLi8uLi9sb2dnaW5nLyc7XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCc7XG5cbmNvbnN0IGxvZ2dlciA9IGdldExvZ2dlcigpO1xuY29uc3Qge0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSgnYXRvbScpO1xuY29uc3Qge3RyYWNrfSA9IHJlcXVpcmUoJy4uLy4uL2FuYWx5dGljcycpO1xuXG5jbGFzcyBOdWNsaWRlVGV4dEJ1ZmZlciBleHRlbmRzIFRleHRCdWZmZXIge1xuICBjb25uZWN0aW9uOiBSZW1vdGVDb25uZWN0aW9uO1xuICBmaWxlU3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgLyogJEZsb3dGaXhNZSAqL1xuICBmaWxlOiA/UmVtb3RlRmlsZTtcbiAgY29uZmxpY3Q6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoY29ubmVjdGlvbjogUmVtb3RlQ29ubmVjdGlvbiwgcGFyYW1zOiBhbnkpIHtcbiAgICBzdXBlcihwYXJhbXMpO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgdGhpcy5zZXRQYXRoKHBhcmFtcy5maWxlUGF0aCk7XG4gICAgY29uc3QgZW5jb2Rpbmc6IHN0cmluZyA9IChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuZmlsZUVuY29kaW5nJyk6IGFueSk7XG4gICAgdGhpcy5zZXRFbmNvZGluZyhlbmNvZGluZyk7XG4gIH1cblxuICAvLyBBdG9tIDEuNC4wKyBzZXJpYWxpemVzIFRleHRCdWZmZXJzIHdpdGggdGhlIElEIGdlbmVyYXRlZCBieSBgZ2V0SWRgLiBXaGVuXG4gIC8vIGEgYnVmZmVyIGlzIGRlc2VyaWFsaXplZCwgaXQgaXMgbG9va2VkIHVwIGluIHRoZSBidWZmZXIgY2FjaGUgYnkgdGhpcyBrZXkuXG4gIC8vIFRoZSBsb2dpYyB0aGVyZSBpcyBzZXR1cCB0byBjcmVhdGUgYSBuZXcgYnVmZmVyIHdoZW4gdGhlcmUgaXMgYSBjYWNoZSBtaXNzLlxuICAvLyBIb3dldmVyLCB3aGVuIHRoZXJlIGlzIG5vIGtleSwgaXQncyBub3QgbG9va2VkIHVwIGluIGNhY2hlLCBidXQgcmF0aGVyIGJ5XG4gIC8vIGl0cyBwYXRoLiBUaGlzIGJlaGF2aW9yIGVuc3VyZXMgdGhhdCB3aGVuIGEgY29ubmVjdGlvbiBpcyByZWVzdGFibGlzaGVkLFxuICAvLyBhIGJ1ZmZlciBleGlzdHMgd2l0aCB0aGF0IHBhdGguIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tL3B1bGwvOTk2OC5cbiAgZ2V0SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBzZXRQYXRoKGZpbGVQYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgLy8gSWYgdGhpcy5jb25uZWN0aW9uIGlzIG5vdCBzZXQsIHRoZW4gdGhlIHN1cGVyY2xhc3MgY29uc3RydWN0b3IgaXMgc3RpbGwgZXhlY3V0aW5nLlxuICAgICAgLy8gTnVjbGlkZVRleHRCdWZmZXIncyBjb25zdHJ1Y3RvciB3aWxsIGVuc3VyZSBzZXRQYXRoKCkgaXMgY2FsbGVkIG9uY2UgdGhpcy5jb25zdHJ1Y3RvclxuICAgICAgLy8gaXMgc2V0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZmlsZVBhdGggPT09IHRoaXMuZ2V0UGF0aCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgdGhpcy5maWxlID0gdGhpcy5jcmVhdGVGaWxlKGZpbGVQYXRoKTtcbiAgICAgIGlmICh0aGlzLmZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZTtcbiAgICAgICAgZmlsZS5zZXRFbmNvZGluZyh0aGlzLmdldEVuY29kaW5nKCkpO1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvRmlsZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbGUgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1wYXRoJywgdGhpcy5nZXRQYXRoKCkpO1xuICB9XG5cbiAgY3JlYXRlRmlsZShmaWxlUGF0aDogc3RyaW5nKTogUmVtb3RlRmlsZSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5jcmVhdGVGaWxlKGZpbGVQYXRoKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmVBcyhmaWxlUGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHNhdmUgYnVmZmVyIHdpdGggbm8gZmlsZSBwYXRoJyk7XG4gICAgfVxuXG4gICAgbGV0IHN1Y2Nlc3M7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3dpbGwtc2F2ZScsIHtwYXRoOiBmaWxlUGF0aH0pO1xuICAgIHRoaXMuc2V0UGF0aChmaWxlUGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgIGludmFyaWFudCh0aGlzLmZpbGUpO1xuICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZTtcbiAgICAgIGF3YWl0IGZpbGUud3JpdGUodGhpcy5nZXRUZXh0KCkpO1xuICAgICAgdGhpcy5jYWNoZWREaXNrQ29udGVudHMgPSB0aGlzLmdldFRleHQoKTtcbiAgICAgIHRoaXMuY29uZmxpY3QgPSBmYWxzZTtcbiAgICAgIC8qICRGbG93Rml4TWUgUHJpdmF0ZSBBdG9tIEFQSSAqL1xuICAgICAgdGhpcy5lbWl0TW9kaWZpZWRTdGF0dXNDaGFuZ2VkKGZhbHNlKTtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtc2F2ZScsIHtwYXRoOiBmaWxlUGF0aH0pO1xuICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmZhdGFsKCdGYWlsZWQgdG8gc2F2ZSByZW1vdGUgZmlsZS4nLCBlKTtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIHNhdmUgcmVtb3RlIGZpbGU6ICR7ZS5tZXNzYWdlfWApO1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRyYWNrKCdyZW1vdGVwcm9qZWN0cy10ZXh0LWJ1ZmZlci1zYXZlLWFzJywge1xuICAgICAgJ3JlbW90ZXByb2plY3RzLWZpbGUtcGF0aCc6IGZpbGVQYXRoLFxuICAgICAgJ3JlbW90ZXByb2plY3RzLXNhdmUtc3VjY2Vzcyc6IHN1Y2Nlc3MudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUNhY2hlZERpc2tDb250ZW50c1N5bmMoKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1cGRhdGVDYWNoZWREaXNrQ29udGVudHNTeW5jIGlzblxcJ3Qgc3VwcG9ydGVkIGluIE51Y2xpZGVUZXh0QnVmZmVyJyk7XG4gIH1cblxuICBzdWJzY3JpYmVUb0ZpbGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZmlsZVN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIH1cbiAgICBpbnZhcmlhbnQodGhpcy5maWxlKTtcbiAgICB0aGlzLmZpbGVTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuZmlsZVN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZmlsZS5vbkRpZENoYW5nZShhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpc01vZGlmaWVkID0gYXdhaXQgdGhpcy5faXNNb2RpZmllZCgpO1xuICAgICAgaWYgKGlzTW9kaWZpZWQpIHtcbiAgICAgICAgdGhpcy5jb25mbGljdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCBwcmV2aW91c0NvbnRlbnRzID0gdGhpcy5jYWNoZWREaXNrQ29udGVudHM7XG4gICAgICAvKiAkRmxvd0ZpeE1lIFByaXZhdGUgQXRvbSBBUEkgKi9cbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQ2FjaGVkRGlza0NvbnRlbnRzKCk7XG4gICAgICBpZiAocHJldmlvdXNDb250ZW50cyA9PT0gdGhpcy5jYWNoZWREaXNrQ29udGVudHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY29uZmxpY3QpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jb25mbGljdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICBpbnZhcmlhbnQodGhpcy5maWxlKTtcbiAgICB0aGlzLmZpbGVTdWJzY3JpcHRpb25zLmFkZCh0aGlzLmZpbGUub25EaWREZWxldGUoKCkgPT4ge1xuICAgICAgY29uc3QgbW9kaWZpZWQgPSB0aGlzLmdldFRleHQoKSAhPT0gdGhpcy5jYWNoZWREaXNrQ29udGVudHM7XG4gICAgICAvKiAkRmxvd0ZpeE1lIFByaXZhdGUgQXRvbSBBUEkgKi9cbiAgICAgIHRoaXMud2FzTW9kaWZpZWRCZWZvcmVSZW1vdmUgPSBtb2RpZmllZDtcbiAgICAgIGlmIChtb2RpZmllZCkge1xuICAgICAgICAvKiAkRmxvd0ZpeE1lIFByaXZhdGUgQXRvbSBBUEkgKi9cbiAgICAgICAgdGhpcy51cGRhdGVDYWNoZWREaXNrQ29udGVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qICRGbG93Rml4TWUgUHJpdmF0ZSBBdG9tIEFQSSAqL1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICBpbnZhcmlhbnQodGhpcy5maWxlKTtcbiAgICB0aGlzLmZpbGVTdWJzY3JpcHRpb25zLmFkZCh0aGlzLmZpbGUub25EaWRSZW5hbWUoKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtcGF0aCcsIHRoaXMuZ2V0UGF0aCgpKTtcbiAgICB9KSk7XG5cbiAgICBpbnZhcmlhbnQodGhpcy5maWxlKTtcbiAgICB0aGlzLmZpbGVTdWJzY3JpcHRpb25zLmFkZCh0aGlzLmZpbGUub25XaWxsVGhyb3dXYXRjaEVycm9yKGVycm9yT2JqZWN0ID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCd3aWxsLXRocm93LXdhdGNoLWVycm9yJywgZXJyb3JPYmplY3QpO1xuICAgIH0pKTtcbiAgfVxuXG4gIGFzeW5jIF9pc01vZGlmaWVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5sb2FkZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsZSkge1xuICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy5maWxlLmV4aXN0cygpO1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZXh0KCkgIT09IHRoaXMuY2FjaGVkRGlza0NvbnRlbnRzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FzTW9kaWZpZWRCZWZvcmVSZW1vdmUgIT0gbnVsbCA/XG4gICAgICAgICAgdGhpcy53YXNNb2RpZmllZEJlZm9yZVJlbW92ZSA6ICF0aGlzLmlzRW1wdHkoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICF0aGlzLmlzRW1wdHkoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOdWNsaWRlVGV4dEJ1ZmZlcjtcbiJdfQ==