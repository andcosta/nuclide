

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var markers = require('../../constants/markers');
var wrapExpression = require('../../wrappers/simple/wrapExpression');

function printMemberExpression(print, node, context) {
  var wrap = function wrap(x) {
    return wrapExpression(print, node, x);
  };

  if (node.computed) {
    return wrap([print(node.object), '[', markers.openScope, markers.scopeIndent, markers.scopeBreak, print(node.property), markers.scopeBreak, markers.scopeDedent, markers.closeScope, ']']);
  } else {
    return wrap([print(node.object), '.', print(node.property)]);
  }
}

module.exports = printMemberExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50TWVtYmVyRXhwcmVzc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBY0EsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDbkQsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O0FBRXZFLFNBQVMscUJBQXFCLENBQzVCLEtBQVksRUFDWixJQUFzQixFQUN0QixPQUFnQixFQUNUO0FBQ1AsTUFBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLENBQUcsQ0FBQztXQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztHQUFBLENBQUM7O0FBRWpELE1BQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixXQUFPLElBQUksQ0FBQyxDQUNWLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ2xCLEdBQUcsRUFDSCxPQUFPLENBQUMsU0FBUyxFQUNqQixPQUFPLENBQUMsV0FBVyxFQUNuQixPQUFPLENBQUMsVUFBVSxFQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUNwQixPQUFPLENBQUMsVUFBVSxFQUNsQixPQUFPLENBQUMsV0FBVyxFQUNuQixPQUFPLENBQUMsVUFBVSxFQUNsQixHQUFHLENBQ0osQ0FBQyxDQUFDO0dBQ0osTUFBTTtBQUNMLFdBQU8sSUFBSSxDQUFDLENBQ1YsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFDbEIsR0FBRyxFQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3JCLENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyIsImZpbGUiOiJwcmludE1lbWJlckV4cHJlc3Npb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTGluZXMsIFByaW50fSBmcm9tICcuLi8uLi90eXBlcy9jb21tb24nO1xuaW1wb3J0IHR5cGUge01lbWJlckV4cHJlc3Npb259IGZyb20gJ2FzdC10eXBlcy1mbG93JztcblxuY29uc3QgbWFya2VycyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9tYXJrZXJzJyk7XG5jb25zdCB3cmFwRXhwcmVzc2lvbiA9IHJlcXVpcmUoJy4uLy4uL3dyYXBwZXJzL3NpbXBsZS93cmFwRXhwcmVzc2lvbicpO1xuXG5mdW5jdGlvbiBwcmludE1lbWJlckV4cHJlc3Npb24oXG4gIHByaW50OiBQcmludCxcbiAgbm9kZTogTWVtYmVyRXhwcmVzc2lvbixcbiAgY29udGV4dDogQ29udGV4dCxcbik6IExpbmVzIHtcbiAgY29uc3Qgd3JhcCA9IHggPT4gd3JhcEV4cHJlc3Npb24ocHJpbnQsIG5vZGUsIHgpO1xuXG4gIGlmIChub2RlLmNvbXB1dGVkKSB7XG4gICAgcmV0dXJuIHdyYXAoW1xuICAgICAgcHJpbnQobm9kZS5vYmplY3QpLFxuICAgICAgJ1snLFxuICAgICAgbWFya2Vycy5vcGVuU2NvcGUsXG4gICAgICBtYXJrZXJzLnNjb3BlSW5kZW50LFxuICAgICAgbWFya2Vycy5zY29wZUJyZWFrLFxuICAgICAgcHJpbnQobm9kZS5wcm9wZXJ0eSksXG4gICAgICBtYXJrZXJzLnNjb3BlQnJlYWssXG4gICAgICBtYXJrZXJzLnNjb3BlRGVkZW50LFxuICAgICAgbWFya2Vycy5jbG9zZVNjb3BlLFxuICAgICAgJ10nLFxuICAgIF0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB3cmFwKFtcbiAgICAgIHByaW50KG5vZGUub2JqZWN0KSxcbiAgICAgICcuJyxcbiAgICAgIHByaW50KG5vZGUucHJvcGVydHkpLFxuICAgIF0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJpbnRNZW1iZXJFeHByZXNzaW9uO1xuIl19