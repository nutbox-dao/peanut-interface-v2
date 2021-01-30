
export const firstToUpper = function (str) {
  if (!str) {
    return
  }
  if (str.trim().length === 0) {
    return str
  }
  return str.trim().replace(str[0], str[0].toUpperCase())
}

export const sleep = async function (interval = 6) {
  return new Promise(resolve => {
    setTimeout(resolve, interval * 1000) // 6秒
  })
}

export const retryMethod = async function(func, retries=2, interval=1){
  return new Promise(async (resolve, reject) => {
    const exc = async (retries) => {
      try {
        await func() 
        resolve()
      }catch(e) {
        setTimeout(async () => {
          if (retries > 0){
            console.log('retry method', retries);
            await exc(retries - 1)
          }else{
            reject(e)
          }
        }, interval * 1000)
      }
    }
    exc(retries)
  })
}