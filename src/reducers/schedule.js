const SUBSCRIBE = 'SUBSCRIBE'
const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS'
const SUBSCRIBE_FAILED = 'SUBSCRIBE_FAILED'
const UNSUBSCRIBE = 'UNSUBSCRIBE'
const UNSUBSCRIBE_SUCCESS = 'UNSUBSCRIBE_SUCCESS'
const UNSUBSCRIBE_FAILED = 'UNSUBSCRIBE_FAILED'

const initialState = {
  subscribing: true,
  error: null,
  subscription: []
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SUBSCRIBE:
      return {
        ...state,
        subscription: [
          ...state.subscription,
          action.id
        ],
        error: null
      }
    case SUBSCRIBE_SUCCESS:
      return {
        ...state,
        subscribing: false,
        error: null
      }
    case SUBSCRIBE_FAILED:
      return {
        ...state,
        subscribing: false,
        error: action.error
      }
    case UNSUBSCRIBE:
      return {
        ...state,
        subscription: state.subscription.filter(item => item !== action.id),
        error: null
      }
    case UNSUBSCRIBE_SUCCESS:
      return {
        ...state,
        subscribing: false,
        error: null
      }
    case UNSUBSCRIBE_FAILED:
      return {
        ...state,
        subscribing: false,
        error: action.error
      }
    default:
      return state
  }
}

export function subscribe (id) {
  return {
    type: SUBSCRIBE,
    id
  }
}

export function subscribeSuccess () {
  return {
    type: SUBSCRIBE_SUCCESS
  }
}

export function subscribeFailed (error) {
  return {
    type: SUBSCRIBE_FAILED,
    error
  }
}

export function unsubscribe (id) {
  return {
    type: UNSUBSCRIBE,
    id
  }
}

export function unsubscribeSuccess () {
  return {
    type: UNSUBSCRIBE_SUCCESS
  }
}

export function unsubscribeFailed (error) {
  return {
    type: UNSUBSCRIBE_FAILED,
    error
  }
}
