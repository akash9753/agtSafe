'use strict';

var _index = require('../../core/index');

var l = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getSyncRemoteData = function getSyncRemoteData() {
  return require('core/remote_data').syncRemoteData;
};

jest.mock('sync', function () {
  return jest.fn();
});

jest.mock('connection/enterprise', function () {
  return {
    isADEnabled: function isADEnabled() {
      return true;
    }
  };
});

jest.mock('core/index', function () {
  return {
    useTenantInfo: function useTenantInfo() {
      return true;
    },
    id: function id() {
      return 'id';
    },
    emitEvent: jest.fn()
  };
});

jest.mock('core/sso/data', function () {
  return {
    fetchSSOData: jest.fn(function (id, adEnabled, cb) {
      return cb(null, {});
    })
  };
});

describe('remote_data.syncRemoteData()', function () {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  describe('calls getSSOData with AD information', function () {
    [true, false].forEach(function (isAdEnabled) {
      it('when isADEnabled is ' + isAdEnabled, function () {
        require('connection/enterprise').isADEnabled = function () {
          return isAdEnabled;
        };

        var syncRemoteData = getSyncRemoteData();
        syncRemoteData();

        var ssoCall = require('sync').mock.calls.find(function (c) {
          return c[1] === 'sso';
        });
        ssoCall[2].syncFn('model', jest.fn());

        var _require$fetchSSOData = require('core/sso/data').fetchSSOData.mock.calls[0],
            sendADInformation = _require$fetchSSOData[1];

        expect(sendADInformation).toBe(isAdEnabled);
        expect(l.emitEvent).toHaveBeenCalledWith('model', 'ssodata fetched', expect.anything());
      });
    });
  });
});
