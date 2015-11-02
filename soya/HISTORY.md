# Version 0.0.x

## 0.0.22

- Change registerSegments() into createSegments(), a static method.
- Create ReduxStore.registerDataComponent() to allow conditional runtime
  creation of DataComponents.
- Move Segment equality check to ReduxStore().

## 0.0.21

- Client resolve functions working again.
- Append module.hot.accept() automatically on Page files.
- Separated Segment registration and query subscription at ReduxStore.
- Hot-reload Segment and ActionCreator now works.
- DataComponent now assumes immutability on props and state, overrides
  shouldComponentUpdate() by default.
- DataComponent now uses componentWillReceiveProps() to update internal state
  with segment pieces.
- DataComponent now has shouldSubscriptionsUpdate() - which determines whether
  we should unsubscribe everything and re-run subscribeQueries() again.
- Simplified RenderType to just CLIENT and SERVER.
- Removed HydrationType, CLIENT subscription now *always* load data, while
  SERVER subscription *never* loads. Server hydration is done explicitly with
  Store.hydrate().
- Added Store._setRenderType(), making ReduxStore behavior different between
  client and server.
  - At SERVER, handleChange *never* triggers callback.
  - At SERVER, subscription doesn't load automatically.

## 0.0.20

- Hot-loading done at Page level without react-hot-loader.