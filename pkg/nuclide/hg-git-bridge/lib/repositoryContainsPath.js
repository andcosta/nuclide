function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/**
 * @param repository Either a GitRepository or HgRepositoryClient.
 * @param filePath The absolute file path of interest.
 * @return boolean Whether the file path exists within the working directory
 *   (aka root directory) of the repository, or is the working directory.
 */
function repositoryContainsPath(repository, filePath) {
  var workingDirectoryPath = repository.getWorkingDirectory();
  if (pathsAreEqual(workingDirectoryPath, filePath)) {
    return true;
  }

  if (repository.getType() === 'git') {
    var rootGitProjectDirectory = new _atom.Directory(workingDirectoryPath);
    return rootGitProjectDirectory.contains(filePath);
  } else if (repository.getType() === 'hg') {
    var hgRepository = repository;
    return hgRepository._workingDirectory.contains(filePath);
  }
  throw new Error('repositoryContainsPath: Received an unrecognized repository type. Expected git or hg.');
}

/**
 * @param filePath1 An abolute file path.
 * @param filePath2 An absolute file path.
 * @return Whether the file paths are equal, accounting for trailing slashes.
 */
function pathsAreEqual(filePath1, filePath2) {
  return _path2['default'].normalize(filePath1 + _path2['default'].sep) === _path2['default'].normalize(filePath2 + _path2['default'].sep);
}

module.exports = repositoryContainsPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcG9zaXRvcnlDb250YWluc1BhdGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFjd0IsTUFBTTs7b0JBQ2IsTUFBTTs7Ozs7Ozs7OztBQVF2QixTQUFTLHNCQUFzQixDQUFDLFVBQTJCLEVBQUUsUUFBb0IsRUFBVztBQUMxRixNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQzlELE1BQUksYUFBYSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQ2pELFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsTUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ2xDLFFBQU0sdUJBQXVCLEdBQUcsb0JBQWMsb0JBQW9CLENBQUMsQ0FBQztBQUNwRSxXQUFPLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNuRCxNQUFNLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtBQUN4QyxRQUFNLFlBQVksR0FBSyxVQUFVLEFBQTJCLENBQUM7QUFDN0QsV0FBTyxZQUFZLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzFEO0FBQ0QsUUFBTSxJQUFJLEtBQUssQ0FDYix1RkFBdUYsQ0FBQyxDQUFDO0NBQzVGOzs7Ozs7O0FBT0QsU0FBUyxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQixFQUFXO0FBQ3BFLFNBQU8sa0JBQUssU0FBUyxDQUFDLFNBQVMsR0FBRyxrQkFBSyxHQUFHLENBQUMsS0FBSyxrQkFBSyxTQUFTLENBQUMsU0FBUyxHQUFHLGtCQUFLLEdBQUcsQ0FBQyxDQUFDO0NBQ3RGOztBQUdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLENBQUMiLCJmaWxlIjoicmVwb3NpdG9yeUNvbnRhaW5zUGF0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtOdWNsaWRlVXJpfSBmcm9tICcuLi8uLi9yZW1vdGUtdXJpJztcbmltcG9ydCB0eXBlIHtIZ1JlcG9zaXRvcnlDbGllbnR9IGZyb20gJy4uLy4uL2hnLXJlcG9zaXRvcnktY2xpZW50JztcblxuaW1wb3J0IHtEaXJlY3Rvcnl9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8qKlxuICogQHBhcmFtIHJlcG9zaXRvcnkgRWl0aGVyIGEgR2l0UmVwb3NpdG9yeSBvciBIZ1JlcG9zaXRvcnlDbGllbnQuXG4gKiBAcGFyYW0gZmlsZVBhdGggVGhlIGFic29sdXRlIGZpbGUgcGF0aCBvZiBpbnRlcmVzdC5cbiAqIEByZXR1cm4gYm9vbGVhbiBXaGV0aGVyIHRoZSBmaWxlIHBhdGggZXhpc3RzIHdpdGhpbiB0aGUgd29ya2luZyBkaXJlY3RvcnlcbiAqICAgKGFrYSByb290IGRpcmVjdG9yeSkgb2YgdGhlIHJlcG9zaXRvcnksIG9yIGlzIHRoZSB3b3JraW5nIGRpcmVjdG9yeS5cbiAqL1xuZnVuY3Rpb24gcmVwb3NpdG9yeUNvbnRhaW5zUGF0aChyZXBvc2l0b3J5OiBhdG9tJFJlcG9zaXRvcnksIGZpbGVQYXRoOiBOdWNsaWRlVXJpKTogYm9vbGVhbiB7XG4gIGNvbnN0IHdvcmtpbmdEaXJlY3RvcnlQYXRoID0gcmVwb3NpdG9yeS5nZXRXb3JraW5nRGlyZWN0b3J5KCk7XG4gIGlmIChwYXRoc0FyZUVxdWFsKHdvcmtpbmdEaXJlY3RvcnlQYXRoLCBmaWxlUGF0aCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChyZXBvc2l0b3J5LmdldFR5cGUoKSA9PT0gJ2dpdCcpIHtcbiAgICBjb25zdCByb290R2l0UHJvamVjdERpcmVjdG9yeSA9IG5ldyBEaXJlY3Rvcnkod29ya2luZ0RpcmVjdG9yeVBhdGgpO1xuICAgIHJldHVybiByb290R2l0UHJvamVjdERpcmVjdG9yeS5jb250YWlucyhmaWxlUGF0aCk7XG4gIH0gZWxzZSBpZiAocmVwb3NpdG9yeS5nZXRUeXBlKCkgPT09ICdoZycpIHtcbiAgICBjb25zdCBoZ1JlcG9zaXRvcnkgPSAoKHJlcG9zaXRvcnk6IGFueSk6IEhnUmVwb3NpdG9yeUNsaWVudCk7XG4gICAgcmV0dXJuIGhnUmVwb3NpdG9yeS5fd29ya2luZ0RpcmVjdG9yeS5jb250YWlucyhmaWxlUGF0aCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdyZXBvc2l0b3J5Q29udGFpbnNQYXRoOiBSZWNlaXZlZCBhbiB1bnJlY29nbml6ZWQgcmVwb3NpdG9yeSB0eXBlLiBFeHBlY3RlZCBnaXQgb3IgaGcuJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIGZpbGVQYXRoMSBBbiBhYm9sdXRlIGZpbGUgcGF0aC5cbiAqIEBwYXJhbSBmaWxlUGF0aDIgQW4gYWJzb2x1dGUgZmlsZSBwYXRoLlxuICogQHJldHVybiBXaGV0aGVyIHRoZSBmaWxlIHBhdGhzIGFyZSBlcXVhbCwgYWNjb3VudGluZyBmb3IgdHJhaWxpbmcgc2xhc2hlcy5cbiAqL1xuZnVuY3Rpb24gcGF0aHNBcmVFcXVhbChmaWxlUGF0aDE6IHN0cmluZywgZmlsZVBhdGgyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIHBhdGgubm9ybWFsaXplKGZpbGVQYXRoMSArIHBhdGguc2VwKSA9PT0gcGF0aC5ub3JtYWxpemUoZmlsZVBhdGgyICsgcGF0aC5zZXApO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVwb3NpdG9yeUNvbnRhaW5zUGF0aDtcbiJdfQ==