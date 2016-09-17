const DAY_NAMES = ['第一天', '第二天']
export function genData ({data, ok}) {
  return ok && data.map((day, index) => {
    let topicSessionMap = {}
    day.forEach(session => {
      const {topics, ...rest} = session
      const newTopics = topics.map((topic, id) => ({
        dayId: index,
        session: rest,
        isSubscribed: false,
        ...topic
      }))
      topicSessionMap[session.session_title] = newTopics
    })
    return {
      name: DAY_NAMES[index],
      topics: topicSessionMap
    }
  })
}

/*
 * 潜在Bug: 组合数据时，一定要返回一个新的对象。(days是一个不可变的源数据)
 * 否则，第一次调用，ListView接收到的是被修改了的原始数据。后期则是一直使用对原始数据的修改。
 * 因此，在每次调用的时候，一定要返回一个新的对象，以供ListView的WillReceiveProps做对比
 */
export function combineData (days, subscription) {
  return days.map(day => {
    const newTopics = {}
    for (let sessionTitle in day.topics) {
      let session = day.topics[sessionTitle].map(
        topic => ({
          ...topic,
          isSubscribed: subscription.indexOf(topic.id) > -1
        })
      )
      newTopics[sessionTitle] = session
    }
    return {...day, topics: newTopics}
  })
}

// [{..., topics: {1: [], 2: []}}, {}]
export function genSubscribedData (days, subscription) {
  let result = {}
  days.forEach(day => {
    for (let sessionTitle in day.topics) {
      day.topics[sessionTitle].forEach(topic => {
        if (subscription.indexOf(topic.id) > -1) {
          if (!result[day.name]) {
            result[day.name] = []
          }
          result[day.name].push(topic)
        }
      })
    }
  })
  return result
}
