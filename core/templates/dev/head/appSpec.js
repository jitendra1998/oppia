// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for generic services.
 *
 * @author sll@google.com (Sean Lip)
 */

describe('Validators service', function() {
  beforeEach(module('oppia'));

  describe('validators service', function() {
    var vs = null;

    beforeEach(inject(function($injector) {
      vs = $injector.get('validatorsService');
    }));

    it('should correctly validate entity names', function() {
      GLOBALS = {INVALID_NAME_CHARS: 'xyz'};

      expect(vs.isValidEntityName('b')).toBe(true);
      expect(vs.isValidEntityName('b   ')).toBe(true);
      expect(vs.isValidEntityName('   b')).toBe(true);
      expect(vs.isValidEntityName('bd')).toBe(true);

      expect(vs.isValidEntityName('')).toBe(false);
      expect(vs.isValidEntityName('   ')).toBe(false);
      expect(vs.isValidEntityName('x')).toBe(false);
      expect(vs.isValidEntityName('y')).toBe(false);
      expect(vs.isValidEntityName('bx')).toBe(false);
    });

    it('should correctly validate non-emptiness', function() {
      expect(vs.isNonempty('b')).toBe(true);
      expect(vs.isNonempty('abc def')).toBe(true);

      expect(vs.isNonempty('')).toBe(false);
      expect(vs.isNonempty(null)).toBe(false);
      expect(vs.isNonempty(undefined)).toBe(false);
    });
  });
});

describe('Datetime Formatter', function() {
  beforeEach(module('oppia'));

  describe('datetimeformatter', function() {
    // This corresponds to Fri, 21 Nov 2014 9:45:00 GMT.
    var NOW_MILLIS = 1416563100000;
    var YESTERDAY_MILLIS = NOW_MILLIS - 24 * 60 * 60 * 1000;
    var df = null;
    var oldDate = Date;

    beforeEach(inject(function($injector) {
      df = $injector.get('oppiaDatetimeFormatter');

      // Mock Date() to give a time of NOW_MILLIS in GMT. (Unfortunately, there
      // doesn't seem to be a good way to set the timezone locale directly.)
      spyOn(window, 'Date').andCallFake(function(optionalMillisSinceEpoch) {
        if (optionalMillisSinceEpoch) {
          return new oldDate(optionalMillisSinceEpoch);
        } else {
          return new oldDate(NOW_MILLIS);
        }
      });
    }));

    it('should correctly return date time string', function() {
      expect(df.getHumanReadableDatetime(NOW_MILLIS)).toBe(
        'Fri, 21 Nov 2014 09:45:00 GMT');
      expect(df.getHumanReadableDatetime(YESTERDAY_MILLIS)).toBe(
        'Thu, 20 Nov 2014 09:45:00 GMT');
    });

    it('should show only the time for a datetime occurring today', function() {
      // In any timezone, 10 minutes before xx:45:00 should still fall within the
      // same date as xx:45:00.
      expect(df.getLocaleAbbreviatedDatetimeString(
        NOW_MILLIS - 10 * 60 * 1000)).not.toBe('11/21/2014');
    });

    it('should show only the date for a datetime occurring before today', function() {
      // 100 hours ago.
      expect(df.getLocaleAbbreviatedDatetimeString(
        NOW_MILLIS - 100 * 60 * 60 * 1000)).toBe('11/16/2014');
    });
  });
});
