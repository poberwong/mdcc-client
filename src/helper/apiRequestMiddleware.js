import {genData} from './dataHelper'
export default store => next => action => {
  const {promise, types, ...rest} = action
  if (!promise) {
    return next(action)
  }

  const [REQUEST, SUCCESS, FAILED] = types
  next({...rest, type: REQUEST})

  return promise.then(response => response.json())
  .then(responseData => {
    let result = genData({
      data: responseData.data.list,
      ok: responseData.ok
    })
    console.log('result:', result)
    next({
      ...rest,
      type: SUCCESS,
      days: result
    })
  })
  .catch(error => next({
    ...rest,
    type: FAILED,
    error
  }))
}
