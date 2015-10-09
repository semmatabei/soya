const initialState = [];

export default function(state = initialState, action) {
  // no-operation.
  switch (action.type) {
    case 'ADD_MODAL':
      console.log(action);
      return state;
      break;
    default:
      return state;
  }
}