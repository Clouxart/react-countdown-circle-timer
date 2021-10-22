export const getStartAt = (initialRemainingTime, duration) => {
  if (duration === 0) {
    return 0
  }

  if(typeof initialRemainingTime === 'number'){
    console.log("inital remaing time: ",initialRemainingTime);
    return duration - initialRemainingTime
  }else{
    return 0
  }
}
